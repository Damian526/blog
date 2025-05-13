import request from 'supertest';
import { createServer } from 'http';
import { POST } from '@/app/api/comments/route';
import { prisma } from '@/lib/prisma';
import { DeepMockProxy } from 'jest-mock-extended';
import { getServerSession } from 'next-auth';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => {
  const { mockDeep } = require('jest-mock-extended');
  return {
    __esModule: true,
    prisma: mockDeep(),
  };
});

const prismaMock = prisma as unknown as DeepMockProxy<typeof prisma>;

describe('POST /api/comments', () => {
  let server: any;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          content: 'This is a test comment',
          postId: 1,
        }),
      };

      const response = await POST(mockRequest as any);

      res.statusCode = response.status || 200;
      res.setHeader('Content-Type', 'application/json');
      const responseBody = response.body ? await response.text() : null;
      if (responseBody) {
        res.write(responseBody);
      }
      res.end();
    });
    server.listen(4000);
  });

  afterAll(() => {
    server.close();
  });

  it('should create a comment when data is valid', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    } as any);

    prismaMock.comment.create.mockResolvedValue({
      id: 1,
      content: 'This is a test comment',
      postId: 1,
      authorId: 1,
      createdAt: new Date(),
    } as any);

    const response = await request(server)
      .post('/api/comments')
      .send({
        content: 'This is a test comment',
        postId: 1,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.content).toBe('This is a test comment');
  });

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const response = await request(server)
      .post('/api/comments')
      .send({
        content: 'This is a test comment',
        postId: 1,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('You must be logged in to comment');
  });

  it('should return 500 on database error', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    prismaMock.comment.create.mockRejectedValue(new Error('Database error'));

    const response = await request(server)
      .post('/api/comments')
      .send({
        content: 'This is a test comment',
        postId: 1,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to create comment');
  });
});
