"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Review = {
  name: string
  role: string
  text: string
  stars: number
}

const reviews: Review[] = [
  {
    name: "Aarav",
    role: "Student, MUJ",
    text: "Great experience! Booking was fast and easy.",
    stars: 5,
  },
  {
    name: "Ishita",
    role: "Student, MUJ",
    text: "Affordable and convenient for weekend trips.",
    stars: 5,
  },
  {
    name: "Rahul",
    role: "Local",
    text: "Clean cars and friendly support. Highly recommended.",
    stars: 4,
  },
  {
    name: "Meera",
    role: "Student, MUJ",
    text: "Smooth pickup and return. Will book again!",
    stars: 5,
  },
]

export function ReviewsCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  const current = reviews[index]

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight">What Customers Say</h2>
        <p className="mt-2 text-slate-600">Real feedback from MUJ students and locals.</p>
      </div>

      <div className="relative mx-auto mt-8 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{current.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{current.name}</p>
                    <p className="text-sm text-slate-600">{current.role}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: current.stars }).map((_, i) => (
                      <span key={i} aria-hidden>
                        ★
                      </span>
                    ))}
                    {Array.from({ length: 5 - current.stars }).map((_, i) => (
                      <span key={i} className="text-slate-300" aria-hidden>
                        ★
                      </span>
                    ))}
                    <span className="sr-only">{current.stars} out of 5 stars</span>
                  </div>
                  <p className="mt-2 text-pretty leading-relaxed text-slate-700">“{current.text}”</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
