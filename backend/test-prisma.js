import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';

console.log("Starting Prisma Test...");
try {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  console.log("Prisma Client created successfully");
  await prisma.$connect();
  console.log("Prisma connected successfully");
  await prisma.$disconnect();
  console.log("Prisma disconnected successfully");
} catch (error) {
  console.error("Prisma Test Failed:");
  console.error(error);
}
