"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClient } from "@supabase/supabase-js"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthPageClient() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabase =
    typeof window !== "undefined" && supabaseUrl && supabaseAnonKey
      ? createClient(supabaseUrl, supabaseAnonKey)
      : null

  useEffect(() => {
    if (!loading && user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading || !supabase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Hemmasysslor</h1>
      <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
        Logga in eller skapa ett konto för att hålla koll på familjens sysslor
      </p>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="auto"
        providers={[]}
        redirectTo={`${window.location.origin}/`}
      />
    </div>
  )
}
