// SWR hook for MUJ discount

"use client"

import useSWR from "swr"

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch discount')
  }
  const data = await response.json()
  return data.discount
}

export function useDiscount() {
  const { data, error, isLoading, mutate } = useSWR<number>("/api/discount", fetcher)

  async function setDiscount(percent: number) {
    try {
      const v = Math.max(0, Math.min(100, Math.round(percent)))
      
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discount: v }),
      })

      if (!response.ok) {
        throw new Error('Failed to update discount')
      }

      await mutate(v, false)
    } catch (error) {
      console.error('Error updating discount:', error)
      throw error
    }
  }

  return {
    discount: data ?? 10,
    isLoading,
    error,
    setDiscount,
  }
}
