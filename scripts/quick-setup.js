// Quick setup script using plain JavaScript to avoid TypeScript issues
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function quickSetup() {
  console.log('🚀 Quick database setup...')
  
  try {
    // Create admin user
    console.log('👤 Creating admin user...')
    const adminPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@jaipur.manipal.edu' },
      update: {},
      create: {
        email: 'admin@jaipur.manipal.edu',
        password: adminPassword,
        role: 'admin',
        mujId: null, // Admins don't need MUJ ID
        officialEmail: 'admin@jaipur.manipal.edu',
        isOfficial: true,
      }
    })
    console.log('✅ Admin created:', admin.email)

    // Create student user
    console.log('👤 Creating student user...')
    const userPassword = await bcrypt.hash('user123', 12)
    
    const student = await prisma.user.upsert({
      where: { email: 'student@jaipur.manipal.edu' },
      update: {},
      create: {
        email: 'student@jaipur.manipal.edu',
        password: userPassword,
        role: 'user',
        mujId: 'MUJ2024001',
        officialEmail: 'student@jaipur.manipal.edu',
        isOfficial: true,
      }
    })
    console.log('✅ Student created:', student.email)

    // Create cars
    console.log('🚗 Creating cars...')
    const carData = [
      {
        name: 'Swift',
        model: 'Maruti Swift 2023',
        type: 'Hatchback',
        hourlyRate: 150,
        dailyRate: 1200,
        image: '/red-small-hatchback-car-on-white-background.png',
        description: 'Compact and efficient hatchback, perfect for city errands and short trips.',
      },
      {
        name: 'City',
        model: 'Honda City 2022',
        type: 'Sedan',
        hourlyRate: 220,
        dailyRate: 1700,
        image: '/silver-sedan-car-on-white-background.png',
        description: 'Comfortable sedan with spacious seating, ideal for longer rides.',
      }
    ]

    for (const car of carData) {
      await prisma.car.upsert({
        where: { model: car.model },
        update: car,
        create: car,
      })
    }
    console.log('✅ Cars created')

    console.log('\\n🎉 Setup complete!')
    console.log('\\nTest credentials:')
    console.log('Admin: admin@jaipur.manipal.edu / admin123')
    console.log('Student: student@jaipur.manipal.edu / user123')

  } catch (error) {
    console.error('❌ Setup failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

quickSetup()
