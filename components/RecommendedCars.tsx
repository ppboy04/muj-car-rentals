"use client"

import { useEffect, useState } from "react"
import { getRecommendations, type CarRecommendation } from "@/lib/recommendations"
import { useCars } from "@/hooks/use-cars"
import { CarCard } from "@/components/car-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, History, Flame, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

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
        return { label: "AI Pick", icon: <Sparkles className="h-3 w-3 mr-1" />, color: "bg-gradient-to-r from-purple-600 to-blue-600" }
      case "content_based":
        return { label: "Similar", icon: <History className="h-3 w-3 mr-1" />, color: "bg-blue-500" }
      case "popularity":
        return { label: "Trending", icon: <Flame className="h-3 w-3 mr-1" />, color: "bg-orange-500" }
      default:
        return { label: "Recommended", icon: <Info className="h-3 w-3 mr-1" />, color: "bg-slate-500" }
    }
  }

  const info = getStrategyInfo()
  const hasHistory = strategy === "hybrid" || strategy === "content_based"

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-1 md:p-1 my-16 group transition-all duration-500 hover:shadow-2xl">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      <div className="absolute top-0 right-0 -m-12 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-600/30 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 -m-12 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-600/30 transition-all duration-700" />

      <div className="relative bg-white/95 backdrop-blur-xl rounded-[2.4rem] p-8 md:p-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-4xl font-black tracking-tight text-slate-900">
                {hasHistory ? "Picked Just for You" : "Trending at Manipal"}
              </h2>
              <Badge className={`${info.color} text-white border-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg animate-in fade-in zoom-in duration-500`}>
                {info.icon}
                {info.label}
              </Badge>
            </div>
            <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed">
              {hasHistory 
                ? "Our AI engine analyzed your previous rentals and driving patterns to find these perfect matches." 
                : "The most sought-after premium vehicles in the university circuit right now."}
            </p>
          </div>
          
          <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
              Live AI Model
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <span>V2.1 Optimized</span>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-8 gap-8 px-2 scrollbar-none snap-x cursor-grab active:cursor-grabbing">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="min-w-[360px] max-w-[360px] h-[500px]">
                <Skeleton className="w-full h-full rounded-[2rem] bg-slate-100 shadow-inner" />
              </div>
            ))
          ) : (
            recommendedCars.map((car, index) => {
              const recInfo = recommendations.find(r => r.car_id === car.id)
              return (
                <motion.div 
                  key={car.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="min-w-[360px] max-w-[360px] snap-center"
                >
                  <CarCard 
                    car={car} 
                    recommendation={recInfo ? { score: recInfo.score, reason: recInfo.reason } : undefined} 
                  />
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
