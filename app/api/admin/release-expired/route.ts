import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/admin/release-expired - Release cars with expired bookings
export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const now = new Date()

    // Find all expired bookings
    const expiredBookings = await prisma.booking.findMany({
      where: {
        endTime: {
          lt: now
        }
      },
      include: {
        car: true
      }
    })

    // Get car IDs from expired bookings where car is currently unavailable
    const carsToRelease = expiredBookings
      .filter(booking => !booking.car.isAvailable)
      .map(booking => booking.carId)

    // Release cars in a transaction
    if (carsToRelease.length > 0) {
      await prisma.car.updateMany({
        where: {
          id: {
            in: carsToRelease
          }
        },
        data: {
          isAvailable: true
        }
      })
    }

    return NextResponse.json({ 
      message: `Released ${carsToRelease.length} cars from expired bookings`,
      releasedCars: carsToRelease.length
    })
  } catch (error) {
    console.error("Error releasing expired cars:", error)
    return NextResponse.json(
      { error: "Failed to release expired cars" },
      { status: 500 }
    )
  }
}
