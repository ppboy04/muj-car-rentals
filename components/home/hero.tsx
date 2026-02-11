"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Star, Users, Clock } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with parallax effect */}
      <div 
        aria-hidden 
        className="absolute inset-0 bg-[url('/car-fleet-parking-lot-background.png')] bg-cover bg-center bg-fixed" 
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" aria-hidden />

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:py-32 text-white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/30">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">Premium Car Rental Service</span>
              </div>
              
              <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Rent Your
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Dream Ride
                </span>
                at MUJ
              </h1>

              <p className="max-w-2xl text-pretty text-xl leading-relaxed text-white/90">
                Experience premium car rentals with flexible hourly & daily options. 
                Exclusive student discounts and hassle-free booking process.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              className="grid grid-cols-3 gap-6"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">50+</div>
                <div className="text-sm text-white/70">Premium Cars</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">1000+</div>
                <div className="text-sm text-white/70">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">24/7</div>
                <div className="text-sm text-white/70">Support</div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Link href="/cars" className="flex items-center gap-2">
                  Browse Cars
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm"
              >
                <Link href="/auth">Sign In</Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="grid gap-4">
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Flexible Timing</h3>
                    <p className="text-sm text-white/70">Rent by hour or day as per your convenience</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Student Discounts</h3>
                    <p className="text-sm text-white/70">Exclusive rates for MUJ students</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}
