"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => null,
  isDarkMode: false,
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("hemmasysslor-theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("hemmasysslor-theme", theme)
  }, [theme])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      setIsDarkMode(systemTheme === "dark")
    } else {
      root.classList.add(theme)
      setIsDarkMode(theme === "dark")
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      const newTheme = mediaQuery.matches ? "dark" : "light"
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(newTheme)
      setIsDarkMode(newTheme === "dark")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>{children}</ThemeContext.Provider>
}
