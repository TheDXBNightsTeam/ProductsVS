"use client"

import { useState } from "react"
import { LayoutDashboard, Clock, CheckCircle, XCircle, LogOut, User, Menu, X } from "lucide-react"

interface SidebarProps {
  admin: { id: string; email: string; name: string } | null
  onLogout: () => void
}

export default function Sidebar({ admin, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
  ]

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-black text-white rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-extrabold text-white">
            Products<span className="font-normal">VS</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  item.active ? "bg-white text-black font-semibold" : "text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left text-sm">{item.label}</span>
              </div>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{admin?.name || "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
