const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test@fyntrak.com',
        name: 'Test User',
        balance: 100000.00
      }
    });
    
    console.log('Test user created successfully:', user);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Test user already exists');
    } else {
      console.error('Error creating test user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();