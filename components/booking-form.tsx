"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Car, BookingUnit } from "@/lib/types"
import { calculatePrice, applyDiscount } from "@/lib/pricing"
import { useDiscount } from "@/hooks/use-discount"
import { useBookings } from "@/hooks/use-bookings"
import { useAuth } from "@/hooks/use-auth"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { Clock, Calendar, Receipt, CheckCircle } from "lucide-react"

type Props = {
  car: Car
}

export function BookingForm({ car }: Props) {
  const [unit, setUnit] = useState<BookingUnit>("hourly")
  const [qty, setQty] = useState(1)
  const [start, setStart] = useState<string>(new Date().toISOString().slice(0, 16))
  const [contactNumber, setContactNumber] = useState("")
  const { discount } = useDiscount()
  const { addBooking } = useBookings()
  const { auth } = useAuth()

  const price = calculatePrice(car, unit, qty)
  const discountPercent = auth.isAuthenticated && auth.mujId ? discount : 0
  const { discountApplied, finalPrice } = applyDiscount(price, discountPercent)

  async function handleBook() {
    if (!auth.isAuthenticated || auth.role !== "user") {
      toast({
        title: "Login required",
        description: "Please login as User to place a booking.",
      })
      return
    }

    if (!contactNumber.trim()) {
      toast({
        title: "Contact number required",
        description: "Please provide your contact number to complete the booking.",
        variant: "destructive"
      })
      return
    }

    // Basic phone number validation
    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(contactNumber.replace(/\s/g, ''))) {
      toast({
        title: "Invalid contact number",
        description: "Please enter a valid 10-digit Indian mobile number.",
        variant: "destructive"
      })
      return
    }

    await addBooking({
      carId: car.id,
      carName: car.name,
      carModel: car.model,
      startTime: new Date(start).toISOString(),
      unit,
      quantity: qty,
      priceBeforeDiscount: price,
      discountApplied,
      finalPrice,
      userEmail: auth.email!,
      mujId: auth.mujId,
      contactNumber: contactNumber.trim(),
      status: "Pending"
    })
    
    // Reset form
    setContactNumber("")
    setQty(1)
    setStart(new Date().toISOString().slice(0, 16))
    
    toast({
      title: "Booking submitted",
      description: `Your booking for ${car.name} has been submitted. You'll be contacted soon!`,
    })
  }

  return (
    <div className="space-y-6 rounded-2xl border-0 shadow-xl bg-white p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Book Your Ride</h3>
        <p className="text-slate-600">Choose your rental preferences and confirm your booking</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">Rental Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={unit === "hourly" ? "default" : "outline"}
              className={`h-12 transition-all duration-200 ${
                unit === "hourly" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                  : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
              onClick={() => setUnit("hourly")}
            >
              <Clock className="h-4 w-4 mr-2" />
              Hourly
            </Button>
            <Button
              type="button"
              variant={unit === "daily" ? "default" : "outline"}
              className={`h-12 transition-all duration-200 ${
                unit === "daily" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                  : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
              onClick={() => setUnit("daily")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Daily
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">
            {unit === "hourly" ? "Hours" : "Days"}
          </Label>
          <Input 
            type="number" 
            min={1} 
            value={qty} 
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            className="h-12 text-center text-lg font-semibold border-slate-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">Start Time</Label>
          <Input 
            type="datetime-local" 
            value={start} 
            onChange={(e) => setStart(e.target.value)}
            className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">Contact Number *</Label>
          <Input 
            type="tel" 
            placeholder="9876543210"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            maxLength={10}
          />
          <p className="text-xs text-slate-500">10-digit Indian mobile number</p>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 p-6 space-y-4">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
          <Receipt className="h-4 w-4" />
          Pricing Breakdown
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Base Price</span>
            <span className="font-semibold text-slate-900">₹{price}</span>
          </div>
          
          {discountPercent > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                MUJ Student Discount ({discountPercent}%)
              </span>
              <span className="font-semibold text-green-600">-₹{discountApplied}</span>
            </div>
          )}
          
          <div className="border-t border-slate-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total Amount</span>
              <span className="text-xl font-bold text-blue-600">₹{finalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleBook} 
        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        Confirm Booking
      </Button>
    </div>
  )
}
