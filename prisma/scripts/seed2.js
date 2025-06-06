// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
// If you're on Node.js <18 install node-fetch: `npm install node-fetch`
import fetch from 'node-fetch';

const prisma = new PrismaClient();

async function main() {
  // Standard categories with subcategories. For each standard category, we append an "Other" subcategory.
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
        'Other', // fallback for frontend
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
        'Other', // fallback for backend
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
        'Other', // fallback for mobile
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
        'Other', // fallback for database
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
        'Other', // fallback for devops
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
        'Other', // fallback for security
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
        'Other', // fallback for performance
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
        'Other', // fallback for UX/UI
      ],
    },
  ];

  // Insert the standard categories and subcategories
  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });

    for (const sub of category.subcategories) {
      await prisma.subcategory.upsert({
        where: {
          name_categoryId: { name: sub, categoryId: createdCategory.id },
        },
        update: {},
        create: { name: sub, categoryId: createdCategory.id },
      });
    }
  }

  // Add a global "Other" main category.
  await prisma.category.upsert({
    where: { name: 'Other' },
    update: {},
    create: { name: 'Other' },
  });

  // ── Deploy Hook trigger ──
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK;
  if (hookUrl) {
    try {
      await fetch(hookUrl, { method: 'POST' });
      console.log('✅ Vercel Deploy Hook fired: site is rebuilding');
    } catch (err) {
      console.error('❌ Failed to fire Vercel Deploy Hook', err);
    }
  } else {
    console.warn('⚠️ VERCEL_DEPLOY_HOOK is not defined');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
