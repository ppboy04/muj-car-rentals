import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/bookings - Get bookings (user sees own, admin sees all)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    let bookings
    
    if (session.user.role === 'admin') {
      // Admin can see all bookings
      bookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          car: true,
          user: {
            select: {
              email: true,
              mujId: true,
              isOfficial: true
            }
          }
        }
      })
    } else {
      // Regular users see only their bookings
      bookings = await prisma.booking.findMany({
        where: { userEmail: session.user.email! },
        orderBy: { createdAt: 'desc' },
        include: {
          car: true
        }
      })
    }

    // Transform to match frontend types
    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      carId: booking.carId,
      carName: booking.carName,
      carModel: booking.carModel,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      unit: booking.unit,
      quantity: booking.quantity,
      priceBeforeDiscount: booking.priceBeforeDiscount,
      discountApplied: booking.discountApplied,
      finalPrice: booking.finalPrice,
      userEmail: booking.userEmail,
      mujId: booking.mujId,
      contactNumber: booking.contactNumber,
      status: booking.status,
      createdAt: booking.createdAt.getTime(),
    }))

    return NextResponse.json(transformedBookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      carId,
      carName,
      carModel,
      startTime,
      unit,
      quantity,
      priceBeforeDiscount,
      discountApplied,
      finalPrice,
      mujId,
      contactNumber,
      status
    } = body

    if (!carId || !carName || !carModel || !startTime || !unit || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify the car exists and is available
    const car = await prisma.car.findUnique({
      where: { id: carId }
    })

    if (!car) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      )
    }

    if (!car.isAvailable) {
      return NextResponse.json(
        { error: "Car is currently not available" },
        { status: 400 }
      )
    }

    // Calculate end time based on unit and quantity
    const bookingStartTime = new Date(startTime)
    const bookingEndTime = new Date(bookingStartTime)
    
    if (unit === 'hourly') {
      bookingEndTime.setHours(bookingEndTime.getHours() + parseInt(quantity))
    } else {
      bookingEndTime.setDate(bookingEndTime.getDate() + parseInt(quantity))
    }

    // Create booking and mark car as unavailable in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the booking
      const booking = await tx.booking.create({
        data: {
          carId,
          carName,
          carModel,
          startTime: bookingStartTime,
          endTime: bookingEndTime,
          unit,
          quantity: parseInt(quantity),
          priceBeforeDiscount: parseFloat(priceBeforeDiscount),
          discountApplied: parseFloat(discountApplied || 0),
          finalPrice: parseFloat(finalPrice),
          userEmail: session.user.email!,
          mujId: mujId || session.user.mujId,
          contactNumber: contactNumber || null,
          status: status || 'Pending',
        }
      })

      // Mark car as unavailable
      await tx.car.update({
        where: { id: carId },
        data: { isAvailable: false }
      })

      return booking
    })

    const booking = result

    // Transform to match frontend types
    const transformedBooking = {
      id: booking.id,
      carId: booking.carId,
      carName: booking.carName,
      carModel: booking.carModel,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      unit: booking.unit,
      quantity: booking.quantity,
      priceBeforeDiscount: booking.priceBeforeDiscount,
      discountApplied: booking.discountApplied,
      finalPrice: booking.finalPrice,
      userEmail: booking.userEmail,
      mujId: booking.mujId,
      contactNumber: booking.contactNumber,
      status: booking.status,
      createdAt: booking.createdAt.getTime(),
    }

    return NextResponse.json(transformedBooking, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
