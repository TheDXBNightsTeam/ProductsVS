"use client"

import { useState } from "react"
import { LayoutDashboard, Clock, CheckCircle, XCircle, LogOut, User, Menu, X, Settings, BarChart3, FileText, Shield } from "lucide-react"

interface SidebarProps {
  admin: { id: string; email: string; name: string } | null
  onLogout: () => void
}

export default function Sidebar({ admin, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
    { icon: Clock, label: "Pending Reviews", href: "/admin", active: false },
    { icon: BarChart3, label: "Analytics", href: "/admin", active: false },
    { icon: FileText, label: "All Comparisons", href: "/admin", active: false },
    { icon: Settings, label: "Settings", href: "/admin", active: false },
  ]

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl border border-white/10 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">
                Products<span className="font-normal">VS</span>
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{admin?.name || "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
