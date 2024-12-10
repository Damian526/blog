import prisma from '@/lib/prisma';

export async function GET() {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      posts: {
        create: [
          { title: 'First Post', content: 'Hello World!', published: true },
        ],
      },
    },
  });

  return new Response('Seed data created', { status: 200 });
}