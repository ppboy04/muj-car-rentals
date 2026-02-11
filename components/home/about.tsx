"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Car, Wallet, ShieldCheck, Clock, Users, Award } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Car,
    title: "Convenient",
    text: "Pick a car that fits your plan — quick hourly trips or full-day getaways.",
    color: "blue",
  },
  {
    icon: Wallet,
    title: "Affordable",
    text: "Transparent hourly and daily pricing with student-friendly rates.",
    color: "green",
  },
  {
    icon: ShieldCheck,
    title: "Reliable",
    text: "Well-maintained cars and responsive support for peace of mind.",
    color: "purple",
  },
]

const stats = [
  { icon: Clock, value: "24/7", label: "Availability" },
  { icon: Users, value: "1000+", label: "Happy Customers" },
  { icon: Award, value: "4.9/5", label: "Rating" },
]

export function About() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Award className="h-4 w-4" />
            Trusted by MUJ Students
          </div>
          <h2 className="text-balance text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Why Choose
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MUJ Car Rentals?
            </span>
          </h2>
          <p className="text-pretty text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            We make transportation simple and affordable for students and locals. 
            Experience premium car rentals with flexible booking options and exclusive student discounts.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-4">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="flex h-full flex-col gap-4 p-8">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${
                    f.color === 'blue' ? 'bg-blue-100' : 
                    f.color === 'green' ? 'bg-green-100' : 'bg-purple-100'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className={`h-7 w-7 ${
                      f.color === 'blue' ? 'text-blue-600' : 
                      f.color === 'green' ? 'text-green-600' : 'text-purple-600'
                    }`} aria-hidden />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed flex-grow">{f.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
