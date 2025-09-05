// __tests__/api/posts.test.ts
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createServer } from 'http';
import { GET, POST } from '@/app/api/posts/route';
import prisma from '@/lib/prisma';
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
  const prismaMock = mockDeep() as DeepMockProxy<PrismaClient>;
  return {
    __esModule: true,
    default: prismaMock,
  };
});

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('API /posts endpoint', () => {
  let server: any;

  beforeAll(() => {
    server = createServer(async (req, res) => {
      try {
        if (req.method === 'GET') {
          const response = await GET(req as any);
          res.statusCode = response.status ?? 200;
          res.setHeader('Content-Type', 'application/json');
          const responseData = await response.json();
          res.write(JSON.stringify(responseData));
          return res.end();
        }

        if (req.method === 'POST') {
          // Parse request body for POST
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          
          req.on('end', async () => {
            const mockRequest = {
              json: jest.fn().mockResolvedValue(JSON.parse(body)),
            };
            const response = await POST(mockRequest as any);
            res.statusCode = response.status ?? 200;
            res.setHeader('Content-Type', 'application/json');
            const responseData = await response.json();
            res.write(JSON.stringify(responseData));
            res.end();
          });
          return;
        }

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/posts', () => {
    it('should fetch posts successfully', async () => {
      // Mock Prisma to return posts with proper structure
      prismaMock.post.findMany.mockResolvedValue([
        {
          id: 1,
          title: 'Post 1',
          content: 'Hello world',
          excerpt: 'Hello world excerpt',
          published: true,
          publishedAt: new Date('2023-01-01T00:00:00Z'),
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-01T00:00:00Z'),
          authorId: 1,
          author: { 
            id: 1,
            name: 'Alice', 
            email: 'alice@example.com',
            createdAt: new Date('2023-01-01T00:00:00Z'),
          },
          subcategories: [],
          mainCategories: [],
          _count: {
            comments: 0,
          },
        },
      ] as any);

      const response = await request(server).get('/api/posts');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0].title).toBe('Post 1');
      expect(response.body[0].author.name).toBe('Alice');
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

      const response = await request(server)
        .post('/api/posts')
        .send({
          title: 'A new post',
          content: 'Some content',
          mainCategoryIds: [1],
          subcategoryIds: [101],
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should create a post when data is valid', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: 'user@example.com' },
      });

      // Mock user lookup
      prismaMock.user.findUnique.mockResolvedValue({
        id: 42,
        name: 'Test User',
        email: 'user@example.com',
        verified: true,
        isExpert: true,
      } as any);

      // Mock post creation
      prismaMock.post.create.mockResolvedValue({
        id: 101,
        title: 'A new post',
        content: 'Some content',
        excerpt: 'Some content excerpt',
        published: false,
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-01T00:00:00Z'),
        authorId: 42,
        author: {
          id: 42,
          name: 'Test User',
          email: 'user@example.com',
          createdAt: new Date('2023-01-01T00:00:00Z'),
        },
        mainCategories: [{ id: 1, name: 'Frontend' }],
        subcategories: [
          { id: 101, name: 'React', category: { id: 1, name: 'Frontend' } },
        ],
        _count: {
          comments: 0,
        },
      } as any);

      const response = await request(server)
        .post('/api/posts')
        .send({
          title: 'A new post',
          content: 'Some content',
          mainCategoryIds: [1],
          subcategoryIds: [101],
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('A new post');
      expect(response.body.author.name).toBe('Test User');
    });
  });
});
