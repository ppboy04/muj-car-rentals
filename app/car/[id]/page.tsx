"use client"

import Image from "next/image"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useCarById } from "@/hooks/use-cars"
import { Badge } from "@/components/ui/badge"
import { BookingForm } from "@/components/booking-form"

export default function CarDetailPage() {
  const params = useParams<{ id: string }>()
  const { car } = useCarById(params?.id)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-8">
        {!car ? (
          <p className="text-slate-600">Car not found.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={car.image || "/placeholder.svg?height=300&width=600&query=car%20photo"}
                  alt={`${car.name} ${car.model}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 hover:bg-blue-700">Hourly: ₹{car.hourlyRate}</Badge>
                <Badge variant="secondary" className="text-slate-700">
                  Daily: ₹{car.dailyRate}
                </Badge>
                <Badge variant="outline">{car.type}</Badge>
              </div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {car.name} — {car.model}
              </h1>
              <p className="text-slate-600">{car.description}</p>
            </div>
            <div>
              <BookingForm car={car} />
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
