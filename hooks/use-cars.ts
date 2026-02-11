// SWR hooks for cars CRUD

"use client"

import useSWR from "swr"
import type { Car } from "@/lib/types"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch cars')
  }
  return response.json()
}

export function useCars() {
  const { data, error, isLoading, mutate } = useSWR<Car[]>("/api/cars", fetcher)

  async function addCar(partial: Omit<Car, "id" | "createdAt" | "updatedAt">) {
    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partial),
      })

      if (!response.ok) {
        throw new Error('Failed to create car')
      }

      const newCar = await response.json()
      await mutate()
      return newCar
    } catch (error) {
      console.error('Error adding car:', error)
      throw error
    }
  }

  async function updateCar(id: string, updates: Partial<Car>) {
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update car')
      }

      await mutate()
    } catch (error) {
      console.error('Error updating car:', error)
      throw error
    }
  }

  async function deleteCar(id: string) {
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete car')
      }

      await mutate()
    } catch (error) {
      console.error('Error deleting car:', error)
      throw error
    }
  }

  return {
    cars: data || [],
    isLoading,
    error,
    addCar,
    updateCar,
    deleteCar,
    mutate,
  }
}

export function useCarById(id?: string) {
  const { cars, ...rest } = useCars()
  const car = cars.find((c) => c.id === id)
  return { car, ...rest }
}

// Hook for admin to manage their own cars
export function useAdminCars() {
  const { data, error, isLoading, mutate } = useSWR<Car[]>("/api/admin/cars", fetcher)

  async function addCar(partial: Omit<Car, "id" | "createdAt" | "updatedAt" | "isAvailable" | "adminId">) {
    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partial),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create car')
      }

      const newCar = await response.json()
      await mutate()
      return newCar
    } catch (error) {
      console.error('Error adding car:', error)
      throw error
    }
  }

  async function updateCar(id: string, updates: Partial<Car>) {
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update car')
      }

      await mutate()
    } catch (error) {
      console.error('Error updating car:', error)
      throw error
    }
  }

  async function deleteCar(id: string) {
    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete car')
      }

      await mutate()
    } catch (error) {
      console.error('Error deleting car:', error)
      throw error
    }
  }

  return {
    cars: data || [],
    isLoading,
    error,
    addCar,
    updateCar,
    deleteCar,
    mutate,
  }
}
