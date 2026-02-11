"use client"

import { useState } from "react"
import { useBookings } from "@/hooks/use-bookings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Phone, Mail, Calendar, Clock, User, Car, Copy } from "lucide-react"
import type { Booking } from "@/lib/types"

export function AdminBookingManagement() {
  const { bookings, isLoading, updateBookingStatus } = useBookings()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [actionType, setActionType] = useState<"accept" | "cancel" | null>(null)

  const handleStatusUpdate = async (bookingId: string, status: "Accepted" | "Cancelled") => {
    try {
      await updateBookingStatus(bookingId, status)
      toast({
        title: `Booking ${status.toLowerCase()}`,
        description: `The booking has been ${status.toLowerCase()} successfully.`,
      })
      setSelectedBooking(null)
      setActionType(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const copyContactNumber = (contactNumber: string) => {
    navigator.clipboard.writeText(contactNumber)
    toast({
      title: "Contact number copied",
      description: `${contactNumber} has been copied to clipboard.`,
    })
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "Accepted":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Booking Management</h3>
          <p className="text-sm text-slate-600">Manage all booking requests and their status</p>
        </div>
        <div className="text-sm text-slate-500">
          Total: {bookings.length} bookings
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings yet</h3>
            <p className="text-slate-600">When users book cars, they'll appear here for management.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">
                      {booking.carName} — {booking.carModel}
                    </CardTitle>
                    
                    {/* User Contact Information - Prominent Display */}
                    <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-700">User:</span>
                        <span className="text-slate-600">{booking.userEmail}</span>
                      </div>
                      
                      {booking.contactNumber ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-slate-700">Contact:</span>
                          <a 
                            href={`tel:${booking.contactNumber}`}
                            className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                          >
                            {booking.contactNumber}
                          </a>
                          <button
                            onClick={() => copyContactNumber(booking.contactNumber!)}
                            className="p-1 hover:bg-green-100 rounded transition-colors"
                            title="Copy contact number"
                          >
                            <Copy className="h-3 w-3 text-green-600" />
                          </button>
                          <span className="text-xs text-slate-500">(Click to call)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-red-500" />
                          <span className="text-red-600 font-medium">No contact number provided</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="font-medium">Start Time</div>
                      <div className="text-slate-600">
                        {format(new Date(booking.startTime), "dd MMM yyyy, HH:mm")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-slate-600">
                        {booking.quantity} {booking.unit}(s)
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 text-slate-500">₹</span>
                    <div>
                      <div className="font-medium">Total Amount</div>
                      <div className="text-slate-600">₹{booking.finalPrice}</div>
                    </div>
                  </div>
                </div>

                {booking.status === "Pending" && (
                  <div className="space-y-3 pt-2">
                    {/* Warning for missing contact number */}
                    {!booking.contactNumber && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm font-medium">Warning: No contact number provided</span>
                        </div>
                        <p className="text-xs text-yellow-700 mt-1">
                          Consider contacting the user via email before accepting the booking.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedBooking(booking)
                          setActionType("accept")
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Booking
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedBooking(booking)
                          setActionType("cancel")
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Booking
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedBooking && !!actionType} onOpenChange={() => {
        setSelectedBooking(null)
        setActionType(null)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" ? "Accept Booking" : "Cancel Booking"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept" 
                ? "Are you sure you want to accept this booking? The user will be notified."
                : "Are you sure you want to cancel this booking? This action cannot be undone."
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 py-4">
              {/* Contact Information - Prominent in Modal */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="font-medium text-slate-700">User:</span>
                    <span className="text-slate-600">{selectedBooking.userEmail}</span>
                  </div>
                  
                  {selectedBooking.contactNumber ? (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-slate-700">Phone:</span>
                      <a 
                        href={`tel:${selectedBooking.contactNumber}`}
                        className="text-green-600 hover:text-green-700 font-semibold hover:underline text-lg"
                      >
                        {selectedBooking.contactNumber}
                      </a>
                      <button
                        onClick={() => copyContactNumber(selectedBooking.contactNumber!)}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title="Copy contact number"
                      >
                        <Copy className="h-4 w-4 text-green-600" />
                      </button>
                      <span className="text-xs text-slate-500">(Click to call)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-red-500" />
                      <span className="text-red-600 font-medium">No contact number provided</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-slate-700">Car</div>
                  <div className="text-slate-600">{selectedBooking.carName} — {selectedBooking.carModel}</div>
                </div>
                <div>
                  <div className="font-medium text-slate-700">Start Time</div>
                  <div className="text-slate-600">
                    {format(new Date(selectedBooking.startTime), "dd MMM yyyy, HH:mm")}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-700">Duration</div>
                  <div className="text-slate-600">
                    {selectedBooking.quantity} {selectedBooking.unit}(s)
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-700">Amount</div>
                  <div className="text-slate-600 font-semibold">₹{selectedBooking.finalPrice}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBooking(null)
                setActionType(null)
              }}
            >
              Cancel
            </Button>
            <Button
              className={actionType === "accept" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              onClick={() => {
                if (selectedBooking && actionType) {
                  handleStatusUpdate(
                    selectedBooking.id, 
                    actionType === "accept" ? "Accepted" : "Cancelled"
                  )
                }
              }}
            >
              {actionType === "accept" ? "Accept Booking" : "Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
