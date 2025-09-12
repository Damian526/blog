// __tests__/api/posts.test.ts
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createServer } from 'http';
import { GET } from '@/app/api/posts/route';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

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

        // Only GET is supported - POST moved to server actions
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({ error: 'Method not allowed' }));
        return res.end();
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({ error: 'Internal server error' }));
        return res.end();
      }
    });
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/posts', () => {
    it('should return a list of posts', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          published: true,
          declineReason: null,
          createdAt: new Date('2024-01-01'),
          author: {
            id: 1,
            name: 'Author 1',
            email: 'author1@example.com',
            profilePicture: null,
            createdAt: new Date('2024-01-01'),
          },
          subcategories: [],
          _count: { comments: 0 },
        },
      ];

      prismaMock.post.findMany.mockResolvedValue(mockPosts as any);

      const response = await request(server).get('/').expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        published: true,
      });
    });

    it('should handle database errors gracefully', async () => {
      prismaMock.post.findMany.mockRejectedValue(new Error('DB error'));

      const response = await request(server).get('/').expect(500);

      expect(response.body).toEqual({ error: 'Failed to fetch posts' });
    });

    it('should filter posts by published status', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Published Post',
          content: 'Content',
          published: true,
          declineReason: null,
          createdAt: new Date('2024-01-01'),
          author: {
            id: 1,
            name: 'Author',
            email: 'author@example.com',
            profilePicture: null,
            createdAt: new Date('2024-01-01'),
          },
          subcategories: [],
          _count: { comments: 0 },
        },
      ];

      prismaMock.post.findMany.mockResolvedValue(mockPosts as any);

      const response = await request(server)
        .get('/?published=true')
        .expect(200);

      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            published: true,
          }),
        })
      );
    });

    it('should handle category filters', async () => {
      prismaMock.post.findMany.mockResolvedValue([]);

      await request(server)
        .get('/?categoryIds=1,2')
        .expect(200);

      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              {
                subcategories: { some: { categoryId: { in: [1, 2] } } }
              }
            ])
          }),
        })
      );
    });
  });

  // Note: POST endpoint was removed - posts are now created via server actions
  // See /lib/actions/posts.ts for createPost server action
});
