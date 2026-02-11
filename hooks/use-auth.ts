// Authentication using NextAuth.js

"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import type { AuthState, Role } from "@/lib/types"

export function useAuth() {
  const { data: session, status } = useSession()

  const auth: AuthState = {
    isAuthenticated: !!session,
    role: session?.user?.role || null,
    email: session?.user?.email,
    mujId: session?.user?.mujId,
    officialEmail: session?.user?.officialEmail,
    isOfficial: session?.user?.isOfficial,
  }

  async function login(email: string, password: string) {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return { success: false, message: "Invalid credentials" }
      }

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: "Login failed" }
    }
  }

  async function register(email: string, password: string, mujId?: string, role: Role = "user") {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, mujId, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.error }
      }

      return { success: true, message: "Registration successful" }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: "Registration failed" }
    }
  }

  async function logout() {
    await signOut({ redirect: false })
  }

  return { 
    auth, 
    login, 
    logout, 
    register,
    isLoading: status === 'loading'
  }
}
