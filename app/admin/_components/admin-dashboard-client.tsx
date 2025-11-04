"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import Sidebar from "./Sidebar"
import StatsCards from "./StatsCards"
import PendingList from "./PendingList"
import ActivityLog from "./ActivityLog"

interface Admin {
  id: string
  email: string
  name: string
}

interface Stats {
  totalComparisons: number
  pendingReviews: number
  approvedToday: number
  rejectedToday: number
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
      console.error("[v0] Auth check error:", error)
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
      console.error("[v0] Failed to load stats:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const refreshData = () => {
    loadStats()
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <Sidebar admin={admin} onLogout={handleLogout} />

      <main className="lg:ml-64 min-h-screen">
        <div className="px-4 py-20 lg:px-8 lg:py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-2">Dashboard Overview</h2>
            <p className="text-gray-400">Monitor and manage AI-generated comparisons</p>
          </div>

          <StatsCards stats={stats} />

          <div className="mt-8">
            <PendingList onUpdate={refreshData} />
          </div>

          <div className="mt-8">
            <ActivityLog />
          </div>
        </div>
      </main>
    </div>
  )
}
