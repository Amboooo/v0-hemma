"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import type { AvatarType } from "@/types/task"

export default function ProfilePage() {
  const { householdName, loading, logout } = useAuth()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [preferredAvatar, setPreferredAvatar] = useState<AvatarType>("none")
  const [profileLoaded, setProfileLoaded] = useState(false)

  useEffect(() => {
    if (!loading && !householdName) {
      router.push("/auth")
    } else if (householdName) {
      // Simulera laddning av profil (från localStorage eller dummydata)
      setFullName(householdName)
      setPreferredAvatar("none")
      setProfileLoaded(true)
    }
  }, [householdName, loading, router])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Här kan du spara till localStorage eller annan enkel lagring om du vill
    console.log("Sparar profil:", { fullName, preferredAvatar })
    router.push("/")
  }

  if (loading || !profileLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Din profil</h1>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div>
          <label htmlFor="householdName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hushållsnamn
          </label>
          <input
            type="text"
            id="householdName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ditt namn"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Välj din favoritavatar
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                preferredAvatar === "superman"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setPreferredAvatar("superman")}
            >
              <div className="w-16 h-16 relative mb-2">
                <Image src="/images/superman.png" alt="Superman" width={64} height={64} className="object-contain" />
              </div>
              <span className="font-medium">Superman</span>
            </div>
            <div
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                preferredAvatar === "belle"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setPreferredAvatar("belle")}
            >
              <div className="w-16 h-16 relative mb-2">
                <Image src="/images/belle.png" alt="Belle" width={64} height={64} className="object-contain" />
              </div>
              <span className="font-medium">Belle</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button type="submit" className="btn btn-primary">
            Spara profil
          </button>

          <button type="button" onClick={() => logout()} className="btn btn-secondary">
            Logga ut
          </button>
        </div>
      </form>
    </div>
  )
}
