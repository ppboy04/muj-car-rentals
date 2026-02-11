"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { User, Shield, LogOut, Car, Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const links = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/admin", label: "Admin" },
  { href: "/auth", label: "Sign In" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { auth, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const filtered = links.filter((l) => {
    if (l.href === "/bookings") return auth.isAuthenticated && auth.role === "user"
    if (l.href === "/admin") return auth.isAuthenticated && auth.role === "admin"
    if (l.href === "/auth") return !auth.isAuthenticated
    return true
  })

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700 hover:text-blue-800 transition-colors">
          <Car className="h-6 w-6" />
          <span>MUJ Car Rentals</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {filtered.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "relative text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors",
                pathname === l.href && "text-slate-900"
              )}
            >
              {l.label}
              {pathname === l.href && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop User Section */}
        {auth.isAuthenticated && (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                {auth.role === "admin" ? (
                  <Shield className="h-4 w-4 text-blue-600" />
                ) : (
                  <User className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-900">
                  {auth.email}
                </span>
                <div className="flex items-center gap-1">
                  <Badge 
                    variant={auth.role === "admin" ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {auth.role === "admin" ? "Admin" : "User"}
                  </Badge>
                  {auth.isOfficial && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                      MUJ Student
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50"
              onClick={() => {
                logout()
                router.push("/")
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-white"
          >
            <div className="px-4 py-4 space-y-4">
              {filtered.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors",
                    pathname === l.href && "text-slate-900"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              
              {auth.isAuthenticated && (
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      {auth.role === "admin" ? (
                        <Shield className="h-4 w-4 text-blue-600" />
                      ) : (
                        <User className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        {auth.email}
                      </span>
                      <div className="flex items-center gap-1">
                        <Badge 
                          variant={auth.role === "admin" ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {auth.role === "admin" ? "Admin" : "User"}
                        </Badge>
                        {auth.isOfficial && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                            MUJ Student
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-300 text-slate-700 bg-transparent"
                    onClick={() => {
                      logout()
                      router.push("/")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
