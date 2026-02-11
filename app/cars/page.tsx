"use client"

import { useMemo, useState } from "react"
import { Navbar } from "@/components/navbar"
import { useCars } from "@/hooks/use-cars"
import { useAuth } from "@/hooks/use-auth"
import { CarCard } from "@/components/car-card"
import { Filters } from "@/components/filters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CarCategory } from "@/lib/types"
import Link from "next/link"
import { UserPlus, LogIn, Sparkles, Car } from "lucide-react"
import { motion } from "framer-motion"

export default function CarsPage() {
  const { cars, isLoading } = useCars()
  const { auth } = useAuth()
  const [category, setCategory] = useState<CarCategory | "All">("All")
  const [rentalType, setRentalType] = useState<"hourly" | "daily" | "All">("All")

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      const byCat = category === "All" ? true : c.type === category
      const byType = rentalType === "All" ? true : ["hourly", "daily"].includes(rentalType)
      return byCat && byType
    })
  }, [cars, category, rentalType])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Our Premium
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Car Fleet
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Choose from our carefully curated collection of premium vehicles, 
              perfect for every occasion and budget.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Registration CTA for non-authenticated users */}
        {!auth.isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 shadow-lg">
                      <Sparkles className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Book Your Ride?</h3>
                      <p className="text-slate-600">
                        Create an account to book cars and get exclusive MUJ student discounts up to 20%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href="/auth">
                      <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <Filters category={category} setCategory={setCategory} rentalType={rentalType} setRentalType={setRentalType} />
        
        {/* Results count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filtered.length}</span> cars
            {category !== "All" && (
              <span> in <span className="font-semibold text-blue-600">{category}</span></span>
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-white shadow-lg">
                  <div className="h-48 bg-slate-200 rounded-t-2xl" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              ))
            : filtered.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))}
        </div>
        
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Car className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No cars found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your filters to see more results.
            </p>
            <Button 
              onClick={() => {
                setCategory("All")
                setRentalType("All")
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}
