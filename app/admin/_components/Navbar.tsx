"use client"

import { LayoutDashboard, LogOut, User } from "lucide-react"

interface NavbarProps {
  admin: { id: string; email: string; name: string } | null
  onLogout: () => void
}

export default function Navbar({ admin, onLogout }: NavbarProps) {
  return (
    <nav className="bg-[var(--surface)] border-b-2 border-[var(--border)] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[var(--text)] rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-[var(--bg)]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text)]">
                  Products<span className="font-light">VS</span>
                </h1>
                <p className="text-xs text-[var(--text-secondary)]">Admin Panel</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg)] rounded-lg border border-[var(--border)]">
              <div className="w-8 h-8 bg-[var(--text)] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-[var(--bg)]" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[var(--text)]">{admin?.name || "Admin"}</p>
                <p className="text-xs text-[var(--text-secondary)]">{admin?.email}</p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)] rounded-lg transition-colors border border-[var(--border)]"
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
