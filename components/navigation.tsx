"use client"

import Link from "next/link"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { useKeyboardNavigation } from "@/lib/hooks/use-keyboard-navigation"

interface NavigationProps {
  currentPath?: string
  locale?: "en" | "ar"
}

export default function Navigation({ currentPath = "/", locale = "en" }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useKeyboardNavigation(mobileMenuRef, {
    onEscape: () => setIsMenuOpen(false),
    trapFocus: isMenuOpen,
  })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      closeMenu()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "/") {
        e.preventDefault()
        const searchInput = document.querySelector(".search-input") as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".navbar")) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMenuOpen])

  const isActive = (path: string) => currentPath === path

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <Link href="/" className="nav-logo" aria-label="Products VS Home">
          Products<span>VS</span>
        </Link>

        <form onSubmit={handleSearch} className="search-form" role="search" aria-label="Search products">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} aria-hidden="true" />
            <input
              type="text"
              placeholder="Search products... (Alt + /)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search products"
            />
          </div>
        </form>

        <button
          className="nav-toggle"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={toggleMenu}
        >
          <span className="hamburger"></span>
        </button>

        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`nav-links ${isMenuOpen ? "active" : ""}`}
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <form onSubmit={handleSearch} className="mobile-search-form" role="search">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={18} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search products"
              />
            </div>
          </form>

          <Link
            href="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={closeMenu}
            aria-current={isActive("/") ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/en"
            className={`nav-link ${isActive("/en") ? "active" : ""}`}
            onClick={closeMenu}
            aria-current={isActive("/en") ? "page" : undefined}
          >
            Comparisons
          </Link>
          <Link
            href="/category/technology"
            className={`nav-link ${currentPath.startsWith("/category") ? "active" : ""}`}
            onClick={closeMenu}
            title="Browse by category"
          >
            Categories
          </Link>
          <Link
            href="/ai-battle"
            className={`nav-link ${isActive("/ai-battle") ? "active" : ""}`}
            onClick={closeMenu}
            aria-current={isActive("/ai-battle") ? "page" : undefined}
          >
            AI Battle
          </Link>
          <Link
            href="/favorites"
            className={`nav-link ${isActive("/favorites") ? "active" : ""}`}
            onClick={closeMenu}
            aria-current={isActive("/favorites") ? "page" : undefined}
          >
            Favorites
          </Link>
          <Link
            href="/about"
            className={`nav-link ${isActive("/about") ? "active" : ""}`}
            onClick={closeMenu}
            aria-current={isActive("/about") ? "page" : undefined}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`nav-link ${isActive("/contact") ? "active" : ""}`}
            onClick={closeMenu}
            aria-current={isActive("/contact") ? "page" : undefined}
          >
            Contact
          </Link>

          <div className="language-switcher">
            <Link
              href={locale === "en" ? "/ar" : "/en"}
              className="lang-btn"
              onClick={closeMenu}
              aria-label={`Switch to ${locale === "en" ? "Arabic" : "English"}`}
            >
              {locale === "en" ? "العربية" : "English"}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .nav-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .nav-logo {
          font-size: var(--font-xl);
          font-weight: 600;
          color: var(--text);
          text-decoration: none;
          letter-spacing: -0.03em;
          border: none;
          transition: opacity var(--transition);
          flex-shrink: 0;
        }

        .nav-logo:hover {
          opacity: 0.7;
        }

        .nav-logo span {
          font-weight: 400;
        }

        .search-form {
          flex: 1;
          max-width: 400px;
        }

        .mobile-search-form {
          display: none;
        }

        .search-input-wrapper {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 40px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          font-size: var(--font-sm);
          transition: all var(--transition);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--text);
        }

        .search-input::placeholder {
          color: var(--text-secondary);
        }

        .nav-links {
          display: flex;
          gap: var(--spacing-xl);
          align-items: center;
        }

        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: var(--font-sm);
          font-weight: 500;
          transition: color var(--transition);
          border: none;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          white-space: nowrap;
        }

        .nav-link:hover,
        .nav-link.active {
          color: var(--text);
        }

        .lang-btn {
          padding: var(--spacing-xs) var(--spacing-md);
          background: var(--text);
          color: var(--bg);
          border: 1px solid var(--text);
          font-weight: 500;
          font-size: var(--font-sm);
          cursor: pointer;
          transition: all var(--transition);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: inline-block;
          white-space: nowrap;
        }

        .lang-btn:hover {
          background: var(--bg);
          color: var(--text);
        }

        .nav-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 12px;
          margin: -12px;
          position: relative;
          z-index: 1001;
        }

        .hamburger {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--text);
          position: relative;
          transition: background 0.2s ease-out;
        }

        .hamburger::before,
        .hamburger::after {
          content: '';
          display: block;
          width: 100%;
          height: 2px;
          background: var(--text);
          position: absolute;
          transition: transform 0.2s ease-out;
        }

        .hamburger::before {
          top: -8px;
        }

        .hamburger::after {
          bottom: -8px;
        }

        @media (max-width: 968px) {
          .nav-container {
            padding: 1rem;
          }

          .search-form {
            display: none;
          }

          .mobile-search-form {
            display: block;
            width: 100%;
            margin-bottom: 1rem;
          }

          .nav-logo {
            font-size: 1.25rem;
          }

          .nav-toggle {
            display: block;
          }

          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg);
            border-bottom: 1px solid var(--border);
            flex-direction: column;
            align-items: stretch;
            padding: 1.5rem 1rem;
            gap: 0;
            z-index: 1000;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            max-height: calc(100vh - 60px);
            overflow-y: auto;
          }

          .nav-links.active {
            display: flex;
          }

          .nav-link {
            padding: 1rem 0;
            border-bottom: 1px solid var(--border);
            text-align: left;
            font-size: 0.95rem;
          }

          .nav-link:last-of-type {
            border-bottom: 1px solid var(--border);
          }

          .language-switcher {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 2px solid var(--border);
            text-align: center;
          }

          .lang-btn {
            display: block;
            width: 100%;
            padding: 0.75rem 1rem;
            text-align: center;
          }
        }
      `}</style>
    </nav>
  )
}
