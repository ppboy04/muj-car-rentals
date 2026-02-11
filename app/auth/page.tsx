"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, LogIn, Users, Shield } from "lucide-react"

function AuthContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") === "admin" ? "admin" : "user"
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <section className="container mx-auto max-w-md px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">
            MUJ Car Rentals
          </h1>
          <p className="text-slate-600">
            {mode === "login" ? "Welcome back!" : "Join our community"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-6">
          <Card className="p-1">
            <div className="grid grid-cols-2 gap-1">
              <Button
                variant={mode === "login" ? "default" : "ghost"}
                onClick={() => setMode("login")}
                className="flex items-center gap-2 transition-all"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
              <Button
                variant={mode === "register" ? "default" : "ghost"}
                onClick={() => setMode("register")}
                className="flex items-center gap-2 transition-all"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </Button>
            </div>
          </Card>
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

          {/* User Authentication */}
          <TabsContent value="user" className="mt-0">
            {mode === "login" ? (
              <LoginForm 
                role="user" 
                onSwitchToRegister={() => setMode("register")}
              />
            ) : (
              <RegisterForm 
                role="user" 
                onSwitchToLogin={() => setMode("login")}
              />
            )}
          </TabsContent>

          {/* Admin Authentication */}
          <TabsContent value="admin" className="mt-0">
            {mode === "login" ? (
              <LoginForm 
                role="admin" 
                onSwitchToRegister={() => setMode("register")}
              />
            ) : (
              <RegisterForm 
                role="admin" 
                onSwitchToLogin={() => setMode("login")}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Features Highlight */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-slate-900">For Students</h3>
              <p className="text-xs text-slate-600">
                Book cars with student discounts using your MUJ email
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Shield className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-slate-900">For Admins</h3>
              <p className="text-xs text-slate-600">
                Manage fleet, bookings, and system configuration
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

export default function AuthPage() {
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
      <AuthContent />
    </Suspense>
  )
}
