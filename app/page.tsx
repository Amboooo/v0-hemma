"use client"

import { useState } from "react"
import Header from "@/components/Header"
import TaskManager from "@/components/TaskManager"
import WelcomeAnimation from "@/components/WelcomeAnimation"
import AuthMiddleware from "./middleware"
import CustomCalendar from "../components/CustomCalendar";

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true)

  const handleAnimationComplete = () => {
    setShowAnimation(false)
  }
  
  return (
    <AuthMiddleware>
      {showAnimation && (
        <>
          <WelcomeAnimation onComplete={handleAnimationComplete} />
          <button
            onClick={handleAnimationComplete}
            className="fixed bottom-4 right-4 z-[60] px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded backdrop-blur-sm transition-colors"
          >
            Hoppa över
          </button>
        </>
      )}

      <Header />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icons/icon-192x192.png" />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Hemmasysslor</h1>
        <main className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Hemmasysslor</h1>

  <CustomCalendar />

  <TaskManager />
</main>

        <TaskManager />
      </main>
    </AuthMiddleware>
  )
}
