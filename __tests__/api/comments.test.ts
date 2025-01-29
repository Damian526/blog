import request from 'supertest';
import { NextResponse } from 'next/server';
import { POST } from '@/app/api/comments/route';
import { prisma } from '@/lib/prisma';
import { createServer } from 'http';

jest.mock('@/lib/prisma', () => require('@/__mocks__/prisma'));

describe('POST /api/comments', () => {
  let server: any;

  beforeAll(() => {
    server = createServer((req, res) =>
      POST(req as any).then((response) => response?.body.pipe(res)),
    );
    server.listen(4000);
  });

  afterAll(() => {
    server.close();
  });

  it('should create a comment when data is valid', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
    });

    prisma.comment.create.mockResolvedValue({
      id: 1,
      content: 'This is a test comment',
      postId: 1,
      authorId: 1,
      createdAt: new Date(),
    });

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

  it('should return 400 if content or postId is missing', async () => {
    const response = await request(server)
      .post('/api/comments')
      .send({})
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Content and postId are required');
  });

  it('should return 401 if user is not authenticated', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

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
    prisma.comment.create.mockRejectedValue(new Error('Database error'));

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
