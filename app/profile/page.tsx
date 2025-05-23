"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import type { AvatarType } from "@/types/task"

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [preferredAvatar, setPreferredAvatar] = useState<AvatarType>("none")
  const [saving, setSaving] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error && error.code !== "PGRST116") {
          console.error("Error loading profile:", error)
          return
        }

        if (data) {
          setFullName(data.full_name || "")
          setPreferredAvatar(data.preferred_avatar || "none")
        }

        setProfileLoaded(true)
      } catch (error) {
        console.error("Error loading profile:", error)
      }
    }

    if (user) {
      loadProfile()
    }
  }, [user])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    setSaving(true)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        preferred_avatar: preferredAvatar,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        throw error
      }

      router.push("/")
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            E-postadress
          </label>
          <input
            type="email"
            id="email"
            value={user?.email || ""}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                      bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 opacity-75"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Namn
          </label>
          <input
            type="text"
            id="fullName"
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
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Sparar..." : "Spara profil"}
          </button>

          <button type="button" onClick={() => signOut()} className="btn btn-secondary">
            Logga ut
          </button>
        </div>
      </form>
    </div>
  )
}
