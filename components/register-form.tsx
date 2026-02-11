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
import { User, UserPlus, Mail, Lock, IdCard, Shield } from "lucide-react"

type Props = { 
  role: "user" | "admin"
  onSwitchToLogin?: () => void
}

function isEmail(value: string) {
  const email = value.trim()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isMujEmail(value: string) {
  const email = value.trim()
  return /^[^\s@]+@jaipur\.manipal\.edu$/i.test(email)
}

export function RegisterForm({ role, onSwitchToLogin }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [mujId, setMujId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const router = useRouter()
  const { register, login } = useAuth()

  const isOfficialEmail = isMujEmail(email)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // Validation
      if (!isEmail(email)) {
        setError("Please enter a valid email address")
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      // Only enforce MUJ email for regular users, not admins
      if (role === "user" && !email.endsWith("@jaipur.manipal.edu")) {
        setError("Regular users must use @jaipur.manipal.edu emails")
        return
      }

      // MUJ ID is only required for users with official emails, not for admins
      if (role === "user" && isOfficialEmail && !mujId) {
        setError("MUJ ID is required for MUJ student accounts")
        return
      }

      if (mujId && !mujId.match(/^[A-Z0-9]+$/)) {
        setError("MUJ ID should contain only uppercase letters and numbers")
        return
      }

      // Register user
      const result = await register(email, password, mujId || undefined, role)

      if (!result.success) {
        setError(result.message)
        return
      }

      setSuccess("Account created successfully! Logging you in...")

      // Auto login after successful registration
      setTimeout(async () => {
        const loginResult = await login(email, password)
        if (loginResult.success) {
          router.push(role === "admin" ? "/admin" : "/cars")
        }
      }, 1500)

    } catch (error) {
      setError("Registration failed. Please try again.")
      console.error("Registration error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          {role === "admin" ? (
            <Shield className="h-6 w-6 text-blue-600" />
          ) : (
            <UserPlus className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <CardTitle className="text-2xl">
          Create {role === "admin" ? "Admin" : "User"} Account
        </CardTitle>
        <CardDescription>
          {role === "admin" 
            ? "Register as an administrator to manage the car rental system"
            : "Join MUJ Car Rentals to book vehicles for your campus needs"
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

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
              {role === "user" && (
                <Badge variant="secondary" className="text-xs">
                  Must be @jaipur.manipal.edu
                </Badge>
              )}
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
            {isOfficialEmail && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                  ✓ Official MUJ Email - Eligible for student discount
                </Badge>
              </div>
            )}
          </div>

          {/* MUJ ID Field - Only show for users with MUJ emails */}
          {role === "user" && isOfficialEmail && (
            <div className="space-y-2">
              <Label htmlFor="mujId" className="flex items-center gap-2">
                <IdCard className="h-4 w-4" />
                MUJ Student ID
                <Badge variant="secondary" className="text-xs">
                  Required for student discount
                </Badge>
              </Label>
              <Input
                id="mujId"
                type="text"
                placeholder="e.g., 230962001"
                value={mujId}
                onChange={(e) => setMujId(e.target.value.toUpperCase())}
                required
                className="transition-all focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500">
                This will enable your student discount on all bookings
              </p>
            </div>
          )}

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
              minLength={6}
              className="transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Requirements */}
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            <p className="font-medium">Password Requirements:</p>
            <ul className="mt-1 space-y-1 text-xs">
              <li className={password.length >= 6 ? "text-green-600" : "text-slate-500"}>
                ✓ At least 6 characters
              </li>
              <li className={password === confirmPassword && password ? "text-green-600" : "text-slate-500"}>
                ✓ Passwords match
              </li>
            </ul>
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
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create {role === "admin" ? "Admin" : ""} Account
              </div>
            )}
          </Button>

          {/* Switch to Login */}
          {onSwitchToLogin && (
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={onSwitchToLogin}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Already have an account? Sign in
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
