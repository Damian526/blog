// __tests__/api/posts.test.ts
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createServer } from 'http';
import { GET, POST } from '@/app/api/posts/route';
import prisma from '@/lib/prisma'; // this is the default import
import { getServerSession } from 'next-auth';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => {
  const { mockDeep } = require('jest-mock-extended');
  const prismaMock = mockDeep() as DeepMockProxy<PrismaClient>; // <--- Using type assertion instead
  return {
    __esModule: true,
    default: prismaMock, // <--- Default export
  };
});

// Now TS knows that "prisma" is a DeepMockProxy of PrismaClient:
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('API /posts endpoint', () => {
  let server: any;

  beforeAll(() => {
    // Create a tiny Node server that calls our route handlers
    server = createServer(async (req, res) => {
      try {
        // We'll match routes by method
        if (req.method === 'GET') {
          // Call GET handler
          const response = await GET(req as any);
          res.statusCode = response.status ?? 200;
          res.setHeader('Content-Type', 'application/json');
          const responseBody = response.body ? await response.text() : null;
          if (responseBody) res.write(responseBody);
          return res.end();
        }

        if (req.method === 'POST') {
          // Simulate reading JSON from the request body:
          const mockRequest = {
            json: jest.fn().mockResolvedValue({
              title: 'A new post',
              content: 'Some content',
              mainCategoryIds: [1],
              subcategoryIds: [101],
            }),
          };
          const response = await POST(mockRequest as any);
          res.statusCode = response.status ?? 200;
          res.setHeader('Content-Type', 'application/json');
          const responseBody = response.body ? await response.text() : null;
          if (responseBody) res.write(responseBody);
          return res.end();
        }

        // If no route matched, default:
        res.statusCode = 404;
        return res.end();
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error' }));
      }
    });

    server.listen(4001);
  });

  afterAll(() => {
    server.close();
  });

  describe('GET /api/posts', () => {
    it('should fetch posts successfully', async () => {
      // Simulate Prisma returning a list of posts
      prismaMock.post.findMany.mockResolvedValue([
        {
          id: 1,
          title: 'Post 1',
          content: 'Hello world',
          published: false,
          createdAt: new Date('2023-01-01T00:00:00Z'),
          author: { name: 'Alice', email: 'alice@example.com' },
          subcategories: [],
          mainCategories: [],
        },
      ] as any);

      const response = await request(server).get('/api/posts');
      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('Post 1');
    });

    it('should handle errors when fetching posts', async () => {
      prismaMock.post.findMany.mockRejectedValue(new Error('DB error'));
      const response = await request(server).get('/api/posts');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch posts');
    });
  });

  describe('POST /api/posts', () => {
    it('should return 401 if the user is not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const response = await request(server).post('/api/posts');
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should create a post when data is valid', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: 'user@example.com' },
      });

      // Simulate user found in DB
      prismaMock.user.findUnique.mockResolvedValue({
        id: 42,
        name: 'Test User',
        email: 'user@example.com',
      } as any);

      // Simulate post creation
      prismaMock.post.create.mockResolvedValue({
        id: 101,
        title: 'A new post',
        content: 'Some content',
        published: false,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        mainCategories: [{ id: 1, name: 'Frontend' }],
        subcategories: [
          { id: 101, name: 'React', category: { id: 1, name: 'Frontend' } },
        ],
      } as any);

      const response = await request(server).post('/api/posts');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(101);
      expect(response.body.mainCategories[0].name).toBe('Frontend');
    });
  });
});
