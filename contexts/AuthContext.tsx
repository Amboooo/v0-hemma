"use client"

import type React from "react"

import { createContext, useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"

type AuthContextType = {
  isLoggedIn: boolean
  householdName: string | null
  login: (householdWord: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  householdName: null,
  login: () => {},
  logout: () => {},
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [householdName, setHouseholdName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const storedHousehold = localStorage.getItem("hemmasysslor-household")
    if (storedHousehold) {
      setIsLoggedIn(true)
      setHouseholdName(storedHousehold)
    }
    setLoading(false)
  }, [])

  const login = (householdWord: string) => {
    if (householdWord.trim()) {
      localStorage.setItem("hemmasysslor-household", householdWord)
      setIsLoggedIn(true)
      setHouseholdName(householdWord)
      router.push("/")
    }
  }

  const logout = () => {
    localStorage.removeItem("hemmasysslor-household")
    setIsLoggedIn(false)
    setHouseholdName(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, householdName, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
