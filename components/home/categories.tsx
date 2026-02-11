"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Car } from "lucide-react"

type Category = {
  name: string
  imageQuery: string
  description: string
  features: string[]
}

const categories: Category[] = [
  { 
    name: "Hatchback", 
    imageQuery: "hatchback%20compact%20car%20studio",
    description: "Perfect for city driving and campus commutes",
    features: ["Fuel Efficient", "Easy Parking", "Compact Design"]
  },
  { 
    name: "Sedan", 
    imageQuery: "sedan%20modern%20car%20on%20road",
    description: "Comfortable and spacious for longer trips",
    features: ["Spacious", "Comfortable", "Premium Feel"]
  },
  { 
    name: "SUV", 
    imageQuery: "suv%20family%20car%20outdoors",
    description: "Ideal for group outings and adventures",
    features: ["High Ground Clearance", "Spacious", "Adventure Ready"]
  },
  { 
    name: "XUV", 
    imageQuery: "xuv%20sport%20utility%20vehicle",
    description: "Sporty and versatile for all occasions",
    features: ["Sporty Design", "Versatile", "Modern Tech"]
  },
]

export function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Car className="h-4 w-4" />
            Premium Fleet
          </div>
          <h2 className="text-balance text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Choose Your
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Ride
            </span>
          </h2>
          <p className="text-pretty text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            From compact hatchbacks for city runs to spacious SUVs for weekend getaways, 
            find the perfect car for every occasion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                <CardContent className="p-0 relative">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`/abstract-geometric-shapes.png?height=200&width=400&query=${cat.imageQuery}`}
                      alt={`${cat.name} example`}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-slate-900">
                        {cat.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{cat.name}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{cat.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Key Features</div>
                      <div className="flex flex-wrap gap-2">
                        {cat.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <Button 
                    asChild 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg transition-all duration-300"
                  >
                    <Link href={`/cars?category=${encodeURIComponent(cat.name)}`} className="flex items-center justify-center gap-2">
                      Explore {cat.name}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
