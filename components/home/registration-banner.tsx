"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { UserPlus, LogIn, Sparkles, Users, Shield } from "lucide-react"
import { motion } from "framer-motion"

export function RegistrationBanner() {
  const { auth } = useAuth()

  // Don't show banner if user is already authenticated
  if (auth.isAuthenticated) return null

  return (
    <motion.section 
      className="mx-auto max-w-6xl px-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              Join MUJ Car Rentals Today!
            </h2>
            <p className="mb-6 text-slate-600 max-w-2xl mx-auto">
              Create your account to book vehicles, enjoy exclusive student discounts, 
              and experience hassle-free campus transportation.
            </p>

            {/* Benefits */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <span>Student Discounts</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <span>Secure Bookings</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                </div>
                <span>Instant Confirmation</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Account
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="border-blue-200">
                  <LogIn className="mr-2 h-5 w-5" />
                  Already have an account? Sign In
                </Button>
              </Link>
            </div>

            {/* Special offer for MUJ students */}
            <div className="mt-6">
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 px-4 py-2">
                ✨ MUJ Students get 10% discount with official email
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
