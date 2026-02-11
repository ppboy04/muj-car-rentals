// SWR hook for bookings

"use client"

import useSWR from "swr"
import type { Booking } from "@/lib/types"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch bookings')
  }
  return response.json()
}

export function useBookings() {
  const { data, error, isLoading, mutate } = useSWR<Booking[]>("/api/bookings", fetcher)

  async function addBooking(partial: Omit<Booking, "id" | "createdAt">) {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partial),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const newBooking = await response.json()
      await mutate()
      return newBooking
    } catch (error) {
      console.error('Error adding booking:', error)
      throw error
    }
  }

  async function updateBookingStatus(bookingId: string, status: "Accepted" | "Cancelled") {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update booking status')
      }

      await mutate()
      return await response.json()
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw error
    }
  }

  return {
    bookings: data || [],
    isLoading,
    error,
    addBooking,
    updateBookingStatus,
  }
}
