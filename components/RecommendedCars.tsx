"use client"

import { useEffect, useState } from "react"
import { getRecommendations, type CarRecommendation } from "@/lib/recommendations"
import { useCars } from "@/hooks/use-cars"
import { CarCard } from "@/components/car-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, History, Flame, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RecommendedCarsProps {
  userId: string
  carId?: string
  topN?: number
}

export function RecommendedCars({ userId, carId, topN = 5 }: RecommendedCarsProps) {
  const [recommendations, setRecommendations] = useState<CarRecommendation[]>([])
  const [strategy, setStrategy] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const { cars } = useCars()

  useEffect(() => {
    async function fetchRecs() {
      setLoading(true)
      const data = await getRecommendations({ user_id: userId, car_id: carId, top_n: topN })
      setRecommendations(data.recommendations)
      setStrategy(data.strategy)
      setLoading(false)
    }

    if (userId) {
      fetchRecs()
    }
  }, [userId, carId, topN])

  // Filter actual car objects from the car_ids returned by API
  const recommendedCars = recommendations
    .map(rec => cars.find(c => c.id === rec.car_id))
    .filter((c): c is Exclude<typeof c, undefined> => c !== undefined)

  if (!loading && recommendedCars.length === 0) return null

  const getStrategyInfo = () => {
    switch (strategy) {
      case "hybrid":
        return { label: "For You", icon: <Sparkles className="h-3 w-3 mr-1" />, color: "bg-purple-500" }
      case "content_based":
        return { label: "Similar Cars", icon: <History className="h-3 w-3 mr-1" />, color: "bg-blue-500" }
      case "popularity":
        return { label: "Popular", icon: <Flame className="h-3 w-3 mr-1" />, color: "bg-orange-500" }
      default:
        return { label: "Recommended", icon: <Info className="h-3 w-3 mr-1" />, color: "bg-slate-500" }
    }
  }

  const info = getStrategyInfo()

  return (
    <div className="space-y-6 my-12">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Recommended for You</h2>
            <Badge className={`${info.color} text-white border-none py-1`}>
              {info.icon}
              {info.label}
            </Badge>
          </div>
          <p className="text-slate-500 text-sm">Based on your activity and preferences</p>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-6 gap-6 px-2 scrollbar-hide snap-x">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="min-w-[320px] max-w-[320px] h-[400px]">
              <Skeleton className="w-full h-full rounded-2xl" />
            </div>
          ))
        ) : (
          recommendedCars.map((car) => (
            <div key={car.id} className="min-w-[320px] max-w-[320px] snap-center">
              <CarCard car={car} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
