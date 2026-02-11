// Types for MUJ Car Rentals

export type CarCategory = "Sedan" | "SUV" | "XUV" | "Hatchback"

export type Car = {
  id: string
  name: string
  model: string
  type: CarCategory
  hourlyRate: number
  dailyRate: number
  image: string
  description: string
  isAvailable?: boolean
  adminId?: string
  createdAt: number
  updatedAt: number
}

export type BookingUnit = "hourly" | "daily"

export type BookingStatus = "Pending" | "Accepted" | "Cancelled"

export type Booking = {
  id: string
  carId: string
  carName: string
  carModel: string
  startTime: string // ISO
  endTime?: string // ISO
  unit: BookingUnit
  quantity: number
  priceBeforeDiscount: number
  discountApplied: number
  finalPrice: number
  userEmail: string
  mujId?: string
  contactNumber?: string
  status?: BookingStatus
  createdAt: number
}

export type Role = "user" | "admin"

export type AuthState = {
  isAuthenticated: boolean
  role: Role | null
  email?: string
  mujId?: string
  officialEmail?: string
  isOfficial?: boolean
}
