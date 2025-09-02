const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Database connection test...');
  
  // Test connection
  await prisma.$connect();
  console.log('Database connected successfully!');
  
  // Check if users table exists
  const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  
  console.log('Available tables:', tables);
  
  await prisma.$disconnect();
  console.log('Database initialization completed!');
}

main()
  .catch(async (e) => {
    console.error('Database initialization error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });