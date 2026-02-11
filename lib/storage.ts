// LocalStorage-backed placeholder store (swap with real APIs later)

import type { Car, Booking } from "./types"
import { defaultCars } from "./seed-data"

const CARS_KEY = "muj_cars"
const DISCOUNT_KEY = "muj_discount"
const BOOKINGS_KEY = "muj_bookings"

const isBrowser = typeof window !== "undefined"

export function loadCars(): Car[] {
  if (!isBrowser) return defaultCars
  const raw = window.localStorage.getItem(CARS_KEY)
  if (!raw) {
    window.localStorage.setItem(CARS_KEY, JSON.stringify(defaultCars))
    return defaultCars
  }
  try {
    return JSON.parse(raw) as Car[]
  } catch {
    return defaultCars
  }
}

export function saveCars(cars: Car[]) {
  if (!isBrowser) return
  window.localStorage.setItem(CARS_KEY, JSON.stringify(cars))
}

export function loadDiscount(): number {
  if (!isBrowser) return 10
  const raw = window.localStorage.getItem(DISCOUNT_KEY)
  if (!raw) {
    window.localStorage.setItem(DISCOUNT_KEY, JSON.stringify(10))
    return 10
  }
  try {
    return JSON.parse(raw) as number
  } catch {
    return 10
  }
}

export function saveDiscount(percent: number) {
  if (!isBrowser) return
  window.localStorage.setItem(DISCOUNT_KEY, JSON.stringify(percent))
}

export function loadBookings(): Booking[] {
  if (!isBrowser) return []
  const raw = window.localStorage.getItem(BOOKINGS_KEY)
  if (!raw) {
    window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]))
    return []
  }
  try {
    return JSON.parse(raw) as Booking[]
  } catch {
    return []
  }
}

export function saveBookings(bookings: Booking[]) {
  if (!isBrowser) return
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
}

export function generateId(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 8)
  const time = Date.now().toString(36)
  return `${prefix}-${time}-${rand}`
}
