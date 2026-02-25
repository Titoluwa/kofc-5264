import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Hash the admin password
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Create initial admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@koc.local' },
    update: {},
    create: {
      email: 'admin@koc.local',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  console.log(`Created/updated admin user: ${admin.email}`);

  // Create sample newsletter subscriber
  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email: 'sample@example.com' },
    update: {},
    create: {
      email: 'sample@example.com',
      isActive: true,
    },
  });

  console.log(`Created/updated newsletter subscriber: ${subscriber.email}`);

  // Seed pages
  const pages = [
    { name: 'Header',              slug: 'header',              navbar: false },
    { name: 'Who We Are',          slug: 'who-we-are',          navbar: true  },
    { name: 'What We Do',          slug: 'what-we-do',          navbar: true  },
    { name: 'Resources',           slug: 'resources',           navbar: true  },
    { name: 'Newsletter',          slug: 'newsletter',          navbar: true  },
    { name: 'Gallery',             slug: 'gallery',             navbar: true  },
    { name: 'Events and Programs', slug: 'events-and-programs', navbar: true  },
    { name: 'History',             slug: 'history',             navbar: true  },
    { name: 'Register',            slug: 'register',            navbar: false },
  ];

  for (const page of pages) {
    const created = await prisma.page.upsert({
      where: { slug: page.slug },
      update: { name: page.name, navbar: page.navbar },
      create: page,
    });
    console.log(`Created/updated page: ${created.name} (/${created.slug})`);
  }

  console.log('Seed completed successfully!');
}

try {
  await main();
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}