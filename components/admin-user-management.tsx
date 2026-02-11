"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Search, Shield, User, Mail, IdCard, Calendar } from "lucide-react"

type User = {
  id: string
  email: string
  role: "user" | "admin"
  mujId?: string
  officialEmail?: string
  isOfficial: boolean
  createdAt: string
  _count?: {
    bookings: number
  }
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }
  return response.json()
}

export function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: users, error, isLoading, mutate } = useSWR<User[]>("/api/admin/users", fetcher)

  const filteredUsers = users?.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mujId?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load users. Make sure you have admin permissions.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>
          View and manage registered users in the system
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search by email or MUJ ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchTerm ? "No users found matching your search" : "No users registered yet"}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-slate-50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        {user.role === "admin" ? (
                          <Shield className="h-5 w-5 text-blue-600" />
                        ) : (
                          <User className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{user.email}</h4>
                          <Badge
                            variant={user.role === "admin" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {user.role === "admin" ? "Admin" : "User"}
                          </Badge>
                          {user.isOfficial && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                              MUJ Student
                            </Badge>
                          )}
                        </div>
                        
                        {user.mujId && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <IdCard className="h-3 w-3" />
                            {user.mujId}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        
                        {user._count && (
                          <div className="text-xs text-slate-500">
                            {user._count.bookings} booking(s)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {users && (
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <h4 className="font-medium text-slate-900 mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Total Users:</span>
                <span className="ml-2 font-medium">{users.length}</span>
              </div>
              <div>
                <span className="text-slate-600">MUJ Students:</span>
                <span className="ml-2 font-medium">
                  {users.filter(u => u.isOfficial).length}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Admins:</span>
                <span className="ml-2 font-medium">
                  {users.filter(u => u.role === "admin").length}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Regular Users:</span>
                <span className="ml-2 font-medium">
                  {users.filter(u => u.role === "user").length}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
