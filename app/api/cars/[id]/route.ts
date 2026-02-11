import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/cars/[id] - Get specific car
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const car = await prisma.car.findUnique({
      where: { id: params.id }
    })

    if (!car) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      )
    }

    // Transform to match frontend types
    const transformedCar = {
      id: car.id,
      name: car.name,
      model: car.model,
      type: car.type,
      hourlyRate: car.hourlyRate,
      dailyRate: car.dailyRate,
      image: car.image,
      description: car.description,
      createdAt: car.createdAt.getTime(),
      updatedAt: car.updatedAt.getTime(),
    }

    return NextResponse.json(transformedCar)
  } catch (error) {
    console.error("Error fetching car:", error)
    return NextResponse.json(
      { error: "Failed to fetch car" },
      { status: 500 }
    )
  }
}

// PUT /api/cars/[id] - Update car (admin only)
export async function PUT(
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

    // Check if car exists and is owned by current admin
    const existingCar = await prisma.car.findUnique({
      where: { id: params.id }
    })

    if (!existingCar) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      )
    }

    if (existingCar.adminId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only modify cars you created" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, model, type, hourlyRate, dailyRate, image, description } = body

    const car = await prisma.car.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(model && { model }),
        ...(type && { type }),
        ...(hourlyRate && { hourlyRate: parseFloat(hourlyRate) }),
        ...(dailyRate && { dailyRate: parseFloat(dailyRate) }),
        ...(image && { image }),
        ...(description && { description }),
      }
    })

    // Transform to match frontend types
    const transformedCar = {
      id: car.id,
      name: car.name,
      model: car.model,
      type: car.type,
      hourlyRate: car.hourlyRate,
      dailyRate: car.dailyRate,
      image: car.image,
      description: car.description,
      createdAt: car.createdAt.getTime(),
      updatedAt: car.updatedAt.getTime(),
    }

    return NextResponse.json(transformedCar)
  } catch (error) {
    console.error("Error updating car:", error)
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 }
    )
  }
}

// DELETE /api/cars/[id] - Delete car (admin only)
export async function DELETE(
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

    // Check if car exists and is owned by current admin
    const existingCar = await prisma.car.findUnique({
      where: { id: params.id }
    })

    if (!existingCar) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      )
    }

    if (existingCar.adminId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete cars you created" },
        { status: 403 }
      )
    }

    await prisma.car.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Car deleted successfully" })
  } catch (error) {
    console.error("Error deleting car:", error)
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    )
  }
}
