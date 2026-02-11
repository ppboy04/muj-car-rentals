"use client"

import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") === "admin" ? "admin" : "user"
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto max-w-md px-4 py-8">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">Login</h1>
        <Tabs defaultValue={tab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="user" className="mt-4">
            <LoginForm role="user" />
          </TabsContent>
          <TabsContent value="admin" className="mt-4">
            <LoginForm role="admin" />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
