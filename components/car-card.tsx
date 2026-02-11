"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import type { Car } from "@/lib/types"
import { LogIn, UserPlus, ArrowRight, Star, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"

export function CarCard({ car }: { car: Car }) {
  const { auth } = useAuth()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-pretty text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {car.name} — {car.model}
            </CardTitle>
            <Badge variant="outline" className="text-xs font-medium">
              {car.type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-100 group-hover:rounded-2xl transition-all duration-500">
            <Image
              src={car.image || "/placeholder.svg?height=300&width=600&query=car%20photo"}
              alt={`${car.name} ${car.model}`}
              fill
              unoptimized
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Rating overlay */}
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-slate-900">4.8</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                <Clock className="h-3 w-3 mr-1" />
                ₹{car.hourlyRate}/hr
              </Badge>
              <Badge variant="secondary" className="text-slate-700 font-medium">
                <Users className="h-3 w-3 mr-1" />
                ₹{car.dailyRate}/day
              </Badge>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {car.description}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          {auth.isAuthenticated ? (
            <div className="w-full space-y-3">
              <Link href={`/car/${car.id}`} className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn">
                  Book Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link 
                href={`/car/${car.id}`} 
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View Details
              </Link>
            </div>
          ) : (
            <div className="w-full space-y-3">
              <Link href="/register" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register to Book
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link 
                href="/auth" 
                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Already have an account? Sign In
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
