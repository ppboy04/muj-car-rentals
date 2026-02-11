"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Car, CarCategory } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  onSubmit: (car: Omit<Car, "id" | "createdAt" | "updatedAt">) => Promise<void> | void
  initial?: Partial<Car>
  submitLabel?: string
}

export function AdminCarForm({ onSubmit, initial = {}, submitLabel = "Save Car" }: Props) {
  const [name, setName] = useState(initial.name ?? "")
  const [model, setModel] = useState(initial.model ?? "")
  const normalizedInitialType =
    initial.type === "Mini" || initial.type === "Small"
      ? ("Hatchback" as CarCategory)
      : ((initial.type as CarCategory) ?? ("Sedan" as CarCategory))
  const [type, setType] = useState<CarCategory>(normalizedInitialType)
  const [hourlyRate, setHourlyRate] = useState<number>(Number(initial.hourlyRate ?? 200))
  const [dailyRate, setDailyRate] = useState<number>(Number(initial.dailyRate ?? 1500))
  const [image, setImage] = useState(initial.image ?? "/classic-red-convertible.png")
  const [description, setDescription] = useState(initial.description ?? "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({
      name,
      model,
      type,
      hourlyRate: Math.max(0, Number(hourlyRate)),
      dailyRate: Math.max(0, Number(dailyRate)),
      image,
      description,
    } as any)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label>Car Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Model</Label>
        <Input value={model} onChange={(e) => setModel(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as CarCategory)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="XUV">XUV</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Hourly Rate (₹)</Label>
          <Input
            type="number"
            min={0}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Daily Rate (₹)</Label>
          <Input
            type="number"
            min={0}
            value={dailyRate}
            onChange={(e) => setDailyRate(Number(e.target.value))}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Image URL</Label>
        <Input value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
        {submitLabel}
      </Button>
    </form>
  )
}
