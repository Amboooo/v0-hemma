"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthPageClient() {
  const router = useRouter()
  const { householdName, loading } = useAuth()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables.")
    return null
  }

  // Redirect if already logged in (based on householdName)
  if (!loading && householdName) {
    router.push("/")
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Välkommen! Logga in för att fortsätta.</h1>
    </div>
  )
}
