"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <motion.div
        className="rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 p-8 text-white"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-balance text-2xl font-semibold">Ready to book your ride?</h3>
            <p className="mt-1 text-white/90">Pick your car and hit the road in minutes.</p>
          </div>
          <Button asChild size="lg" variant="secondary" className="text-blue-700">
            <Link href="/cars">Get Started</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
