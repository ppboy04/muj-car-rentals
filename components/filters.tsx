"use client"

import type { CarCategory } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  category: CarCategory | "All"
  setCategory: (c: CarCategory | "All") => void
  rentalType: "hourly" | "daily" | "All"
  setRentalType: (t: "hourly" | "daily" | "All") => void
}

export function Filters({ category, setCategory, rentalType, setRentalType }: Props) {
  return (
    <div className="grid gap-4 rounded-md border p-4 md:grid-cols-2">
      <div className="grid gap-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="XUV">XUV</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Rental Type</Label>
        <Select value={rentalType} onValueChange={(v) => setRentalType(v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
