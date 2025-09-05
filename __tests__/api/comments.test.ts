import request from 'supertest';
import { createServer } from 'http';
import { POST } from '@/app/api/comments/route';
import { prisma } from '@/lib/prisma';
import { DeepMockProxy } from 'jest-mock-extended';
import { getServerSession } from 'next-auth';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
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
      // Parse request body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const mockRequest = {
            json: jest.fn().mockResolvedValue(JSON.parse(body)),
          };

          const response = await POST(mockRequest as any);
          const responseData = await response.json();

          res.statusCode = response.status;
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(responseData));
          res.end();
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify({ error: 'Server error' }));
          res.end();
        }
      });
    });
    server.listen(4000);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a comment when data is valid', async () => {
    // Mock the session
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    // Mock user lookup
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      verified: true,
      isExpert: false,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    // Mock comment creation
    const mockCreatedComment = {
      id: 1,
      content: 'This is a test comment',
      postId: 1,
      discussionId: null,
      parentId: null,
      authorId: 1,
      createdAt: new Date(),
      author: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        profilePicture: null,
        createdAt: new Date(),
      },
    };

    prismaMock.comment.create.mockResolvedValue(mockCreatedComment as any);

    const response = await request(server)
      .post('/api/comments')
      .send({
        content: 'This is a test comment',
        postId: 1,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.content).toBe('This is a test comment');
    expect(response.body.postId).toBe(1);
    expect(response.body.author.name).toBe('Test User');
  });

  it('should return 400 when content is missing', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    const response = await request(server)
      .post('/api/comments')
      .send({
        postId: 1,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Content and postId are required');
  });

  it('should return 401 when user is not authenticated', async () => {
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

  it('should return 404 when user is not found', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    prismaMock.user.findUnique.mockResolvedValue(null);

    const response = await request(server)
      .post('/api/comments')
      .send({
        content: 'This is a test comment',
        postId: 1,
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  it('should return 500 on database error', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    } as any);

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
