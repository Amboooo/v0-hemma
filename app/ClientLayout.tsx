"use client"

import type React from "react"

import { Inter } from "next/font/google"
import { useState, useEffect } from "react"
import BackgroundModal from "@/components/BackgroundModal"
import { generateBackgroundImage } from "@/utils/backgroundGenerator"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [backgroundModal, setBackgroundModal] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)

  // Load saved background from localStorage on component mount
  useEffect(() => {
    const savedBackground = localStorage.getItem("hemmasysslor-background")
    if (savedBackground) {
      setBackgroundImage(savedBackground)
    }
  }, [])

  // Save background to localStorage whenever it changes
  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem("hemmasysslor-background", backgroundImage)
    }
  }, [backgroundImage])

  const handleGenerateBackground = (prompt: string) => {
    const imageUrl = generateBackgroundImage(prompt)
    setBackgroundImage(imageUrl)
    setBackgroundModal(false)
  }

  return (
    <html lang="sv">
      <body className={inter.className}>
        <div
          className="min-h-screen relative"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          {/* Semi-transparent overlay for better readability */}
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80" />

          {/* Content container */}
          <div className="relative z-10 min-h-screen">{children}</div>

          {/* Background selection button */}
          <button
            onClick={() => setBackgroundModal(true)}
            className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-20"
            aria-label="Välj bakgrund"
            title="Välj bakgrund"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {/* Background selection modal */}
          <BackgroundModal
            isOpen={backgroundModal}
            onClose={() => setBackgroundModal(false)}
            onGenerate={handleGenerateBackground}
          />
        </div>
      </body>
    </html>
  )
}
