"use client"

import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { useAdminCars } from "@/hooks/use-cars"
import { AdminCarForm } from "@/components/admin-car-form"
import { AdminUserManagement } from "@/components/admin-user-management"
import { AdminBookingManagement } from "@/components/admin-booking-management"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDiscount } from "@/hooks/use-discount"
import type { Car } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"
import { Car as CarIcon, Users, Settings, Calendar } from "lucide-react"

export const dynamic = "force-static"

export default function AdminPage() {
  const { auth } = useAuth()
  const { cars, addCar, updateCar, deleteCar } = useAdminCars()
  const { discount, setDiscount } = useDiscount()
  const [editOpenId, setEditOpenId] = useState<string | null>(null)

  if (!auth.isAuthenticated || auth.role !== "admin") {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <section className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="mb-2 text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Please login as Admin to access this page.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">Manage cars, users, and system settings.</p>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Booking Management
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center gap-2">
              <CarIcon className="h-4 w-4" />
              Car Management
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Booking Management Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <AdminBookingManagement />
          </TabsContent>

          {/* Car Management Tab */}
          <TabsContent value="cars" className="space-y-6">
            {/* Add Car */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Car</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminCarForm
                  submitLabel="Add Car"
                  onSubmit={async (partial: any) => {
                    const clean: Omit<Car, "id" | "createdAt" | "updatedAt"> = {
                      name: partial.name,
                      model: partial.model,
                      type: partial.type,
                      hourlyRate: Number(partial.hourlyRate),
                      dailyRate: Number(partial.dailyRate),
                      image: partial.image,
                      description: partial.description,
                    }
                    await addCar(clean)
                    toast({ title: "Car added successfully" })
                  }}
                />
              </CardContent>
            </Card>

            {/* Cars List */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {cars.map((car) => (
                <Card key={car.id}>
                  <CardHeader>
                    <CardTitle className="text-pretty">
                      {car.name} — {car.model}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600">
                    <p>Type: {car.type}</p>
                    <p>
                      Hourly: ₹{car.hourlyRate} / Daily: ₹{car.dailyRate}
                    </p>
                    <p className={`font-medium ${car.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {car.isAvailable ? 'Available' : 'Booked'}
                    </p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Dialog open={editOpenId === car.id} onOpenChange={(open) => setEditOpenId(open ? car.id : null)}>
                      <Button variant="outline" onClick={() => setEditOpenId(car.id)}>
                        Edit
                      </Button>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Car</DialogTitle>
                        </DialogHeader>
                        <AdminCarForm
                          submitLabel="Update Car"
                          initial={car}
                          onSubmit={async (partial: any) => {
                            await updateCar(car.id, {
                              name: partial.name,
                              model: partial.model,
                              type: partial.type,
                              hourlyRate: Number(partial.hourlyRate),
                              dailyRate: Number(partial.dailyRate),
                              image: partial.image,
                              description: partial.description,
                            })
                            setEditOpenId(null)
                            toast({ title: "Car updated successfully" })
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" onClick={() => deleteCar(car.id)}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users">
            <AdminUserManagement />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Discount Control */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">MUJ Student Discount</Label>
                  <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
                    <div className="col-span-2">
                      <p className="text-slate-700">Current discount for MUJ students</p>
                      <p className="text-3xl font-semibold text-amber-600">{discount}%</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Set Discount (%)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          defaultValue={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                        />
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast({ title: "Discount updated successfully" })}>
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
