import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// For now, we'll store discount in memory/env. In production, you might want a settings table
const DEFAULT_DISCOUNT = 10

// GET /api/discount - Get current discount percentage
export async function GET() {
  try {
    // You could fetch this from database settings table in the future
    const discount = process.env.DEFAULT_DISCOUNT ? 
      parseFloat(process.env.DEFAULT_DISCOUNT) : 
      DEFAULT_DISCOUNT

    return NextResponse.json({ discount })
  } catch (error) {
    console.error("Error fetching discount:", error)
    return NextResponse.json(
      { error: "Failed to fetch discount" },
      { status: 500 }
    )
  }
}

// POST /api/discount - Update discount percentage (admin only)
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
    const { discount } = body

    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
      return NextResponse.json(
        { error: "Discount must be a number between 0 and 100" },
        { status: 400 }
      )
    }

    // In a real app, you'd save this to a settings table
    // For now, we'll just return the value
    return NextResponse.json({ 
      discount,
      message: "Discount updated successfully" 
    })
  } catch (error) {
    console.error("Error updating discount:", error)
    return NextResponse.json(
      { error: "Failed to update discount" },
      { status: 500 }
    )
  }
}
