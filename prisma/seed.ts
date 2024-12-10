import prisma from '../src/lib/prisma';

async function main() {
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

  console.log('Seed data created');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
