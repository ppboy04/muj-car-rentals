"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Play, CheckCircle, XCircle } from "lucide-react"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function runSetup() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.details || data.error || 'Setup failed')
        return
      }

      setResult(data)
    } catch (error) {
      setError('Failed to connect to setup API')
      console.error('Setup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Database Setup</h1>
          <p className="text-slate-600">Initialize your database with sample data and test accounts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Initialization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>{result.message}</p>
                    <div className="text-sm">
                      <p>• Users created: {result.data.users}</p>
                      <p>• Cars added: {result.data.cars}</p>
                      <p>• Sample bookings: {result.data.bookings}</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {!result && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  This will create sample data including:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Admin account: admin@jaipur.manipal.edu</li>
                  <li>• Student account: student@jaipur.manipal.edu</li>
                  <li>• 5 sample cars (Swift, City, Creta, etc.)</li>
                  <li>• 1 sample booking</li>
                </ul>
              </div>
            )}

            <Button 
              onClick={runSetup}
              disabled={loading || result}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Setting up database...
                </div>
              ) : result ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Setup Complete
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Initialize Database
                </div>
              )}
            </Button>

            {result && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Test Credentials:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Admin:</strong> {result.data.credentials.admin.email} / {result.data.credentials.admin.password}</p>
                  <p><strong>Student:</strong> {result.data.credentials.student.email} / {result.data.credentials.student.password}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
