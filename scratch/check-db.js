const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const carCount = await prisma.car.count();
    console.log(`Connection successful!`);
    console.log(`Users in DB: ${userCount}`);
    console.log(`Cars in DB: ${carCount}`);
    
    if (carCount === 0) {
      console.log('No cars found. You may need to run the migration script.');
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
