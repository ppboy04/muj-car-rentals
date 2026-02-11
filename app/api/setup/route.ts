import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { defaultCars } from "@/lib/seed-data"

export async function POST() {
  try {
    console.log('🚀 Starting database setup...')

    // Test connection first
    await prisma.$connect()
    console.log('✅ Database connected')

    // 1. Clear existing data (for development)
    console.log('📝 Clearing existing data...')
    try {
      await prisma.booking.deleteMany()
      await prisma.car.deleteMany() 
      await prisma.user.deleteMany()
      console.log('✅ Data cleared')
    } catch (error) {
      console.log('ℹ️  No existing data to clear')
    }

    // 2. Create default admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 12)
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@jaipur.manipal.edu',
        password: hashedAdminPassword,
        role: 'admin',
        mujId: null, // Admins don't need MUJ ID
        officialEmail: 'admin@jaipur.manipal.edu',
        isOfficial: true,
      }
    })

    // 3. Create default student user
    const hashedUserPassword = await bcrypt.hash('user123', 12)
    const studentUser = await prisma.user.create({
      data: {
        email: 'student@jaipur.manipal.edu',
        password: hashedUserPassword,
        role: 'user',
        mujId: 'MUJ2024001',
        officialEmail: 'student@jaipur.manipal.edu',
        isOfficial: true,
      }
    })

    // 4. Create cars
    const cars = []
    for (const carData of defaultCars) {
      const car = await prisma.car.create({
        data: {
          name: carData.name,
          model: carData.model,
          type: carData.type as any,
          hourlyRate: carData.hourlyRate,
          dailyRate: carData.dailyRate,
          image: carData.image,
          description: carData.description,
        }
      })
      cars.push(car)
    }

    // 5. Create sample booking
    if (cars.length > 0) {
      const sampleBooking = await prisma.booking.create({
        data: {
          carId: cars[0].id,
          carName: cars[0].name,
          carModel: cars[0].model,
          startTime: new Date(),
          unit: 'daily',
          quantity: 1,
          priceBeforeDiscount: cars[0].dailyRate,
          discountApplied: cars[0].dailyRate * 0.1,
          finalPrice: cars[0].dailyRate * 0.9,
          userEmail: studentUser.email,
          mujId: studentUser.mujId,
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!',
      data: {
        users: 2,
        cars: cars.length,
        bookings: 1,
        credentials: {
          admin: { email: 'admin@jaipur.manipal.edu', password: 'admin123' },
          student: { email: 'student@jaipur.manipal.edu', password: 'user123' }
        }
      }
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Database setup failed", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
