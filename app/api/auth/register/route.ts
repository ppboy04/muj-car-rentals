import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createFallbackUser } from "@/lib/auth-fallback"

export async function POST(request: NextRequest) {
  let email: string, password: string, mujId: string | undefined, role: string = "user"
  
  try {
    const body = await request.json()
    const parsed = body
    email = parsed.email
    password = parsed.password
    mujId = parsed.mujId
    role = parsed.role || "user"

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Enforce @jaipur.manipal.edu email domain only for regular users
    if (role === 'user' && !email.endsWith('@jaipur.manipal.edu')) {
      return NextResponse.json(
        { error: "Regular users must use @jaipur.manipal.edu emails" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      )
    }

    // Check if MUJ ID already exists (if provided)
    if (mujId) {
      const existingMujUser = await prisma.user.findUnique({
        where: { mujId }
      })

      if (existingMujUser) {
        return NextResponse.json(
          { error: "MUJ ID already registered" },
          { status: 409 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Determine if user is official based on email domain
    const isOfficial = email.endsWith("@jaipur.manipal.edu")
    const officialEmail = isOfficial ? email : undefined
    
    // For users with MUJ email, MUJ ID is required for student benefits
    if (role === "user" && isOfficial && !mujId) {
      return NextResponse.json(
        { error: "MUJ ID is required for student accounts" },
        { status: 400 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as "user" | "admin",
        mujId,
        officialEmail,
        isOfficial,
      },
      select: {
        id: true,
        email: true,
        role: true,
        mujId: true,
        officialEmail: true,
        isOfficial: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    
    // Fallback to localStorage in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Using fallback authentication...')
      const fallbackResult = await createFallbackUser(email, password, mujId, role)
      
      if (fallbackResult.success) {
        return NextResponse.json(
          { message: "User created successfully (fallback)", user: fallbackResult.user },
          { status: 201 }
        )
      } else {
        return NextResponse.json(
          { error: fallbackResult.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
