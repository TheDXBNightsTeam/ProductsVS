"use client"

import { LayoutDashboard, LogOut, User } from "lucide-react"

interface NavbarProps {
  admin: { id: string; email: string; name: string } | null
  onLogout: () => void
}

export default function Navbar({ admin, onLogout }: NavbarProps) {

  return (
    <nav className="bg-[var(--surface)] border-b-2 border-[var(--border)] sticky top-0 z-50 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8 animate-slide-in-left">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-[var(--text)] rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <LayoutDashboard className="w-5 h-5 text-[var(--bg)] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text)] transition-colors duration-200">
                  Products<span className="font-light">VS</span>
                </h1>
                <p className="text-xs text-[var(--text-secondary)] transition-colors duration-200 group-hover:text-[var(--text)]">Admin Panel</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 animate-slide-in-right">
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg)] rounded-lg border border-[var(--border)] transition-all duration-200 hover:border-[var(--text)] hover:shadow-md group">
              <div className="w-8 h-8 bg-[var(--text)] rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <User className="w-4 h-4 text-[var(--bg)]" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-[var(--text)]">{admin?.name || "Admin"}</p>
                <p className="text-xs text-[var(--text-secondary)] transition-colors duration-200 group-hover:text-[var(--text)]">{admin?.email}</p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg)] hover:text-[var(--text)] rounded-lg transition-all duration-200 border border-[var(--border)] hover:border-[var(--text)] hover:shadow-md hover:scale-105 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-1rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(1rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </nav>
  )
}
