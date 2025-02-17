import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Generate multiple users
  const users = await Promise.all(
    Array.from({ length: 10 }).map((_, i) => {
      return prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: `password${i + 1}`, // Use plaintext passwords for now
        },
      });
    })
  );

  // Generate multiple posts for each user
  for (const user of users) {
    await Promise.all(
      Array.from({ length: 5 }).map((_, j) => {
        return prisma.post.create({
          data: {
            title: `Post ${j + 1} by ${user.name}`,
            content: `This is the content of post ${j + 1} by ${user.name}.`,
            published: Math.random() > 0.5, // Randomize published status
            authorId: user.id,
          },
        });
      })
    );
  }

  console.log('Database has been seeded with basic passwords.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
