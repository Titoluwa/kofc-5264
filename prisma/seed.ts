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

  console.log('Seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
