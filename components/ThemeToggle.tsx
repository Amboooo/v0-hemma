"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme, isDarkMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        aria-label="Ändra tema"
      >
        {isDarkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <button
            onClick={() => {
              setTheme("light")
              setIsOpen(false)
            }}
            className={`block w-full text-left px-4 py-2 text-sm ${
              theme === "light"
                ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Ljust tema
          </button>
          <button
            onClick={() => {
              setTheme("dark")
              setIsOpen(false)
            }}
            className={`block w-full text-left px-4 py-2 text-sm ${
              theme === "dark"
                ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Mörkt tema
          </button>
          <button
            onClick={() => {
              setTheme("system")
              setIsOpen(false)
            }}
            className={`block w-full text-left px-4 py-2 text-sm ${
              theme === "system"
                ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Systemets tema
          </button>
        </div>
      )}
    </div>
  )
}
