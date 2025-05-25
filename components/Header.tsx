"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import ThemeToggle from "./ThemeToggle"

export default function Header() {
  const { isLoggedIn, householdName, logout } = useAuth()
  const router = useRouter()

  return (
    <header className="shadow-sm bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
          Hemmasysslor
        </Link>
        

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hushåll: {householdName}</span>
              </div>

              <div className="relative group">
                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label="User menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logga ut
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Logga in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
