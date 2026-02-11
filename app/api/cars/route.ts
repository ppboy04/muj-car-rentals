import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/cars - Get all available cars
export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to match frontend types
    const transformedCars = cars.map(car => ({
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
    }))

    return NextResponse.json(transformedCars)
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    )
  }
}

// POST /api/cars - Create a new car (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, model, type, hourlyRate, dailyRate, image, description } = body

    if (!name || !model || !type || !hourlyRate || !dailyRate || !image || !description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const car = await prisma.car.create({
      data: {
        name,
        model,
        type,
        hourlyRate: parseFloat(hourlyRate),
        dailyRate: parseFloat(dailyRate),
        image,
        description,
        isAvailable: true,
        adminId: session.user.id,
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

    return NextResponse.json(transformedCar, { status: 201 })
  } catch (error) {
    console.error("Error creating car:", error)
    return NextResponse.json(
      { error: "Failed to create car" },
      { status: 500 }
    )
  }
}
