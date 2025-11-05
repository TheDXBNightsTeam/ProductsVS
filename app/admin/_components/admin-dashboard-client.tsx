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
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[var(--border)] border-t-[var(--text)] rounded-full animate-spin mx-auto mb-4"></div>
            <Loader2 className="w-8 h-8 text-[var(--text)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-2" />
          </div>
          <p className="text-[var(--text-secondary)] animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Toaster position="top-right" richColors />
      <Navbar admin={admin} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2 transition-all duration-300 hover:scale-105 inline-block">
            Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--text)]">
            Welcome back, <span className="font-semibold">{admin?.name}</span>
          </p>
        </div>

        <div className="space-y-6">
          <StatsCards stats={stats} />
          <PendingList onRefresh={loadStats} />
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
