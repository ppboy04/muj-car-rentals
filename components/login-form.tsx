"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogIn, Mail, Lock, User } from "lucide-react"

type Props = { role: "user" | "admin" }

function isEmail(value: string) {
  const email = value.trim()
  // simple email check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
function isMujEmail(value: string) {
  const email = value.trim()
  return /^[^\s@]+@muj\.manipal\.edu$/i.test(email)
}

export function LoginForm({ role, onSwitchToRegister }: Props & { onSwitchToRegister?: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!isEmail(email)) {
        setError("Please enter a valid email address")
        return
      }

      if (password.length < 4) {
        setError("Password must be at least 4 characters")
        return
      }

      const result = await login(email, password)
      
      if (!result.success) {
        setError(result.message || "Invalid credentials")
        return
      }

      // Redirect based on role (will be determined by the backend)
      router.push("/cars")
    } catch (error) {
      setError("Login failed. Please try again.")
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <LogIn className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">
          {role === "admin" ? "Admin Login" : "Welcome Back"}
        </CardTitle>
        <CardDescription>
          {role === "admin" 
            ? "Sign in to manage the car rental system"
            : "Sign in to your MUJ Car Rentals account"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={role === "admin" ? "admin@example.com" : "student@jaipur.manipal.edu"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
              className="transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing In...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </div>
            )}
          </Button>

          {/* Switch to Register */}
          {onSwitchToRegister && (
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={onSwitchToRegister}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Don't have an account? Create one
              </Button>
            </div>
          )}
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <div className="space-y-1">
            {role === "admin" ? (
              <p><strong>Admin:</strong> admin@example.com / admin123</p>
            ) : (
              <p><strong>Student:</strong> student@jaipur.manipal.edu / user123</p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              {role === "admin" ? "Admin accounts can use any email address" : "Student accounts with @jaipur.manipal.edu get discount"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
