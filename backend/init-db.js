const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Try to create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@init.com',
        password: 'test123'
      }
    });
    console.log('✅ Test user created:', testUser);
    
    // Delete test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Database is working properly');
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();