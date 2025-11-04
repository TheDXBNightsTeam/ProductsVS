"use client"

import { LayoutDashboard, LogOut, User } from "lucide-react"

interface NavbarProps {
  admin: { id: string; email: string; name: string } | null
  onLogout: () => void
}

export default function Navbar({ admin, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">
                  Products<span className="font-light">VS</span>
                </h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-black">{admin?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
