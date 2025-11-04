"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react"

export default function AdminLoginClient() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/admin")
        router.refresh()
      } else {
        setError(data.error || "Invalid email or password")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-50"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white opacity-[0.02] rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md p-8 mx-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold mb-2 text-black">
              Products<span className="font-normal">VS</span>
            </h1>
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-sm text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="admin@productsvs.com"
                  className="w-full pl-11 pr-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 font-medium text-sm text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-2 border-gray-300 text-black focus:ring-2 focus:ring-black focus:ring-offset-0 transition-all"
                disabled={loading}
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 select-none cursor-pointer">
                Remember me for 7 days
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 flex-1">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 active:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400">
              Secure admin access for Products<span className="font-semibold">VS</span> platform
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
