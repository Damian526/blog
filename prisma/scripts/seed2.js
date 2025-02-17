// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: 'Frontend',
      subcategories: [
        'HTML',
        'CSS',
        'JavaScript',
        'TypeScript',
        'React',
        'Vue',
        'Angular',
        'Svelte',
      ],
    },
    {
      name: 'Backend',
      subcategories: [
        'Node.js',
        'Java',
        'Django',
        'Spring Boot',
        'Ruby on Rails',
        'PHP',
        'Go',
        'GraphQL',
      ],
    },
    {
      name: 'Mobile',
      subcategories: [
        'React Native',
        'Flutter',
        'Swift (iOS)',
        'Kotlin (Android)',
        'Ionic',
        'PWAs (Progressive Web Apps)',
      ],
    },
    {
      name: 'Database',
      subcategories: [
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Redis',
        'Firebase',
        'Supabase',
        'SQL Optimization',
      ],
    },
    {
      name: 'DevOps',
      subcategories: [
        'CI/CD',
        'Docker',
        'Kubernetes',
        'AWS',
        'Google Cloud',
        'Azure',
        'Terraform',
      ],
    },
    {
      name: 'Security',
      subcategories: [
        'Web Vulnerabilities',
        'Authentication',
        'Encryption',
        'OAuth & JWT',
        'Penetration Testing',
        'Security Audits',
      ],
    },
    {
      name: 'Performance',
      subcategories: [
        'Page Speed Optimization',
        'Caching',
        'Database Optimization',
        'Code Splitting & Bundling',
        'Server-Side Rendering (SSR)',
      ],
    },
    {
      name: 'UX/UI',
      subcategories: [
        'User Research',
        'Accessibility',
        'Design Systems',
        'Figma & Sketch',
        'Interaction Design',
      ],
    },
  ];

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });

    for (const sub of category.subcategories) {
      await prisma.subcategory.upsert({
        where: { name: sub },
        update: {},
        create: { name: sub, categoryId: createdCategory.id },
      });
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
