#!/usr/bin/env tsx

/**
 * Migration script to move data from localStorage to PostgreSQL database
 * 
 * Usage: npm run migrate-data
 * 
 * This script will:
 * 1. Seed the database with default cars
 * 2. Create a default admin user
 * 
 * Note: This is a one-time migration script. localStorage bookings cannot be migrated
 * since they require user accounts that don't exist yet.
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { defaultCars } from '../lib/seed-data'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting data migration...')

  try {
    // 1. Clear existing data (for development)
    console.log('📝 Clearing existing data...')
    await prisma.booking.deleteMany()
    await prisma.car.deleteMany()
    await prisma.user.deleteMany()

    // 2. Create default admin user
    console.log('👤 Creating default admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        mujId: null,
        officialEmail: null,
        isOfficial: false,
      }
    })
    console.log('✅ Admin user created:', adminUser.email)

    // 3. Create a default regular user
    const userPassword = await bcrypt.hash('user123', 12)
    const regularUser = await prisma.user.create({
      data: {
        email: 'student@jaipur.manipal.edu',
        password: userPassword,
        role: 'user',
        mujId: 'MUJ2024001',
        officialEmail: 'student@jaipur.manipal.edu',
        isOfficial: true,
      }
    })
    console.log('✅ Regular user created:', regularUser.email)

    // 4. Seed cars from defaultCars
    console.log('🚗 Seeding cars...')
    const cars = await Promise.all(
      defaultCars.map(car => 
        prisma.car.create({
          data: {
            name: car.name,
            model: car.model,
            type: car.type as any,
            hourlyRate: car.hourlyRate,
            dailyRate: car.dailyRate,
            image: car.image,
            description: car.description,
            isAvailable: true,
            adminId: adminUser.id,
          }
        })
      )
    )
    console.log(`✅ ${cars.length} cars created`)

    // 5. Create a sample booking
    console.log('📋 Creating sample booking...')
    const startTime = new Date()
    const endTime = new Date()
    endTime.setDate(endTime.getDate() + 1) // 1 day booking
    
    const sampleBooking = await prisma.booking.create({
      data: {
        carId: cars[0].id,
        carName: cars[0].name,
        carModel: cars[0].model,
        startTime: startTime,
        endTime: endTime,
        unit: 'daily',
        quantity: 1,
        priceBeforeDiscount: cars[0].dailyRate,
        discountApplied: cars[0].dailyRate * 0.1, // 10% discount
        finalPrice: cars[0].dailyRate * 0.9,
        userEmail: regularUser.email,
        mujId: regularUser.mujId,
      }
    })
    console.log('✅ Sample booking created')

    console.log('\n🎉 Migration completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`- Admin user: admin@example.com (password: admin123)`)
    console.log(`- Regular user: student@jaipur.manipal.edu (password: user123)`)
    console.log(`- Cars: ${cars.length} vehicles`)
    console.log(`- Sample booking: 1 booking`)
    console.log('\n💡 You can now start your Next.js app and login with these credentials!')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
