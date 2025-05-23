"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

export default function LoginPage() {
  const [householdWord, setHouseholdWord] = useState("")
  const [error, setError] = useState("")
  const { login, isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push("/")
    }
  }, [loading, isLoggedIn, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!householdWord.trim()) {
      setError("Ange ett hushållsord")
      return
    }
    login(householdWord)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <Image
                src="/images/animation-frame1.png"
                alt="Hemmasysslor"
                width={128}
                height={128}
                className="pixelated"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Välkommen till Hemmasysslor
          </h1>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Logga in med ert hushållsord för att komma igång. Om din partner använder samma ord kommer ni att dela
            uppgifter.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="householdWord" className="label">
                Hushållsord
              </label>
              <input
                type="text"
                id="householdWord"
                value={householdWord}
                onChange={(e) => setHouseholdWord(e.target.value)}
                className="input"
                placeholder="Ange ert hushållsord"
              />
              {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Logga in
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
            Alla i hushållet som använder samma ord kommer att dela uppgifter och statistik.
          </p>
        </div>
      </div>
    </div>
  )
}
