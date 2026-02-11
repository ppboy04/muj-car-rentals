import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/cars - Get cars owned by current admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const cars = await prisma.car.findMany({
      where: { adminId: session.user.id },
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
      isAvailable: car.isAvailable,
      adminId: car.adminId,
      createdAt: car.createdAt.getTime(),
      updatedAt: car.updatedAt.getTime(),
    }))

    return NextResponse.json(transformedCars)
  } catch (error) {
    console.error("Error fetching admin cars:", error)
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    )
  }
}
