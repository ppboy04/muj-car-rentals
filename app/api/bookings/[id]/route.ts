import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH /api/bookings/[id] - Update booking status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['Accepted', 'Cancelled'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'Accepted' or 'Cancelled'" },
        { status: 400 }
      )
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { car: true }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Update booking status and car availability in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the booking status
      const updatedBooking = await tx.booking.update({
        where: { id: params.id },
        data: { status }
      })

      // If booking is cancelled, make the car available again
      if (status === 'Cancelled') {
        await tx.car.update({
          where: { id: existingBooking.carId },
          data: { isAvailable: true }
        })
      }

      return updatedBooking
    })

    // Transform to match frontend types
    const transformedBooking = {
      id: result.id,
      carId: result.carId,
      carName: result.carName,
      carModel: result.carModel,
      startTime: result.startTime.toISOString(),
      endTime: result.endTime.toISOString(),
      unit: result.unit,
      quantity: result.quantity,
      priceBeforeDiscount: result.priceBeforeDiscount,
      discountApplied: result.discountApplied,
      finalPrice: result.finalPrice,
      userEmail: result.userEmail,
      mujId: result.mujId,
      status: result.status,
      createdAt: result.createdAt.getTime(),
    }

    return NextResponse.json(transformedBooking)
  } catch (error) {
    console.error("Error updating booking status:", error)
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    )
  }
}
