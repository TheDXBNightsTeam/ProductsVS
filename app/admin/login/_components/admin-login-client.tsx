"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Loader2, AlertCircle } from "lucide-react"

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
      console.error("Login error:", err)
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-[var(--surface)] rounded-lg border-2 border-[var(--border)] p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--text)] rounded-lg mb-4 transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <Shield className="w-8 h-8 text-[var(--bg)]" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-1 transition-all duration-300">
              Products<span className="font-light">VS</span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wide">ADMIN DASHBOARD</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-[var(--text)] mb-2 transition-colors duration-200">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[var(--border)] bg-[var(--bg)] text-[var(--text)] rounded-lg focus:border-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--text)]/20 transition-all duration-200 hover:border-[var(--text-secondary)]"
                placeholder="admin@productsvs.com"
              />
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-[var(--text)] mb-2 transition-colors duration-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[var(--border)] bg-[var(--bg)] text-[var(--text)] rounded-lg focus:border-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--text)]/20 transition-all duration-200 hover:border-[var(--text-secondary)]"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center group">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 border-2 border-[var(--border)] rounded focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all duration-200 hover:border-[var(--text)]"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-[var(--text-secondary)] cursor-pointer transition-colors duration-200 group-hover:text-[var(--text)]">
                Remember me for 7 days
              </label>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 animate-shake">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--text)] text-[var(--bg)] py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transform"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[var(--text-secondary)]">
            Protected admin access only
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
