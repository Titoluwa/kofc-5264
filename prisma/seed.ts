import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const EMAIL_ADDRESS ="admin@kofc5264.ca"
const ADMIN_PASSWORD ="admin123"

async function main() {
  console.log('Starting database seed...');

  // Hash the admin password
  const adminPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // Create initial admin user
  const admin = await prisma.user.upsert({
    where: { email: EMAIL_ADDRESS },
    update: {},
    create: {
      email: EMAIL_ADDRESS,
      password: adminPassword,
      name: 'Admin',
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
    { name: 'Who We Are',          slug: '#who-we-are',          navbar: true  },
    { name: 'What We Do',          slug: '#what-we-do',          navbar: true  },
    { name: 'Resources',           slug: 'resources',           navbar: true  },
    { name: 'Newsletters',          slug: 'newsletters',          navbar: true  },
    { name: 'Gallery',             slug: 'gallery',             navbar: true  },
    { name: 'Programs and Events', slug: 'programs',             navbar: true  },
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