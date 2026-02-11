// Price calculation utilities

import type { BookingUnit, Car } from "./types"

export function calculatePrice(car: Car, unit: BookingUnit, quantity: number) {
  const base = unit === "hourly" ? car.hourlyRate : car.dailyRate
  return base * Math.max(1, quantity)
}

export function applyDiscount(price: number, discountPercent: number) {
  const discount = Math.max(0, Math.min(discountPercent, 100))
  const discountAmount = Math.round((price * discount) / 100)
  return {
    discountApplied: discountAmount,
    finalPrice: Math.max(0, price - discountAmount),
  }
}
