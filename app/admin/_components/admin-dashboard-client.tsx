"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Toaster } from "sonner"
import Navbar from "./Navbar"
import StatsCards from "./StatsCards"
import PendingList from "./PendingList"

interface Admin {
  id: string
  email: string
  name: string
}

interface Stats {
  total_comparisons: number
  pending: number
  published: number
  rejected: number
}

export default function AdminDashboardClient() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth")
      const data = await response.json()

      if (data.authenticated) {
        setIsAuthenticated(true)
        setAdmin(data.admin)
        await loadStats()
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to load stats:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--text)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Toaster position="top-right" richColors />
      <Navbar admin={admin} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Dashboard</h1>
          <p className="text-[var(--text-secondary)]">Welcome back, {admin?.name}</p>
        </div>

        <div className="space-y-6">
          <StatsCards stats={stats} />
          <PendingList onRefresh={loadStats} />
        </div>
      </main>
    </div>
  )
}
