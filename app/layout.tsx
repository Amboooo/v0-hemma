import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/AuthContext"
import { TaskProvider } from "@/contexts/TaskContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import BackgroundProvider from "@/components/BackgroundProvider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hemmasysslor - Household Task Manager",
  description: "Manage your household tasks efficiently",
    generator: 'v0.dev'
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <TaskProvider>
              <BackgroundProvider>{children}</BackgroundProvider>
            </TaskProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
