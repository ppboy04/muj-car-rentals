"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegisterForm } from "@/components/register-form"
import { Users, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function RegisterContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") === "admin" ? "admin" : "user"

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <section className="container mx-auto max-w-md px-4 py-8">
        {/* Back to Login */}
        <div className="mb-6">
          <Link href="/auth">
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            Join MUJ Car Rentals
          </h1>
          <p className="text-slate-600">
            Create your account to start booking vehicles
          </p>
        </div>

        {/* Role Tabs */}
        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Student/User
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* User Registration */}
          <TabsContent value="user" className="mt-0">
            <RegisterForm role="user" />
          </TabsContent>

          {/* Admin Registration */}
          <TabsContent value="admin" className="mt-0">
            <RegisterForm role="admin" />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <section className="container mx-auto max-w-md px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="text-slate-600">Loading...</div>
          </div>
        </section>
      </main>
    }>
      <RegisterContent />
    </Suspense>
  )
}
