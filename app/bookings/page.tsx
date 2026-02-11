"use client"

import { Navbar } from "@/components/navbar"
import { useBookings } from "@/hooks/use-bookings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function BookingsPage() {
  const { bookings, isLoading } = useBookings()

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-semibold text-slate-900">My Bookings</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-lg bg-slate-100" />
              ))
            : bookings.map((b) => (
                <Card key={b.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-pretty">
                        {b.carName} — {b.carModel}
                      </CardTitle>
                      <Badge 
                        className={
                          b.status === "Accepted" 
                            ? "bg-green-100 text-green-800 border-green-200"
                            : b.status === "Cancelled"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {b.status || "Pending"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="font-medium text-slate-900">Start Time</p>
                        <p>{format(new Date(b.startTime), "dd MMM yyyy, HH:mm")}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Duration</p>
                        <p>{b.quantity} {b.unit}(s)</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Base Price</p>
                        <p>₹{b.priceBeforeDiscount}</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Total Amount</p>
                        <p className="text-lg font-semibold text-blue-600">₹{b.finalPrice}</p>
                      </div>
                    </div>
                    {b.discountApplied > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-green-600 font-medium">
                          MUJ Student Discount: -₹{b.discountApplied}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          {!isLoading && bookings.length === 0 && (
            <p className="text-slate-600">No bookings yet. Book a car to see it here.</p>
          )}
        </div>
      </section>
    </main>
  )
}
