"use client"

import type React from "react"

import { useState, useEffect } from "react"
import BackgroundModal from "@/components/BackgroundModal"
import { generateBackgroundImage, getFallbackGradient } from "@/utils/backgroundGenerator"

interface BackgroundProviderProps {
  children: React.ReactNode
}

interface Background {
  url: string
  isGradient: boolean
}

export default function BackgroundProvider({ children }: BackgroundProviderProps) {
  const [backgroundModal, setBackgroundModal] = useState(false)
  const [background, setBackground] = useState<Background | null>(null)
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false)
  const [lastPrompt, setLastPrompt] = useState<string>("")
  const [loadAttempts, setLoadAttempts] = useState(0)

  // Load saved background from localStorage on component mount
  useEffect(() => {
    try {
      const savedBackground = localStorage.getItem("hemmasysslor-background")
      if (savedBackground) {
        setBackground(JSON.parse(savedBackground))
      }
    } catch (error) {
      console.error("Error loading background from localStorage:", error)
      // If there's an error parsing the saved background, clear it
      localStorage.removeItem("hemmasysslor-background")
    }
  }, [])

  // Save background to localStorage whenever it changes
  useEffect(() => {
    if (background) {
      try {
        localStorage.setItem("hemmasysslor-background", JSON.stringify(background))
      } catch (error) {
        console.error("Error saving background to localStorage:", error)
      }
    }
  }, [background])

  const handleGenerateBackground = (prompt: string) => {
    setIsBackgroundLoading(true)
    setLastPrompt(prompt)
    setLoadAttempts(0)

    // First try to get an image
    const imageBackground = generateBackgroundImage(prompt)

    if (imageBackground.isGradient) {
      // If we got a gradient directly, use it
      setBackground(imageBackground)
      setIsBackgroundLoading(false)
      setBackgroundModal(false)
      return
    }

    // Otherwise, try to load the image
    const img = new Image()

    img.onload = () => {
      setBackground(imageBackground)
      setIsBackgroundLoading(false)
    }

    img.onerror = () => {
      console.error("Failed to load background image, using gradient fallback")
      // Use a gradient fallback if the image fails to load
      const gradientBackground = getFallbackGradient(prompt)
      setBackground(gradientBackground)
      setIsBackgroundLoading(false)
    }

    img.src = imageBackground.url

    // Set a timeout in case the image takes too long to load
    setTimeout(() => {
      if (isBackgroundLoading) {
        console.warn("Background image load timeout, using gradient fallback")
        const gradientBackground = getFallbackGradient(prompt)
        setBackground(gradientBackground)
        setIsBackgroundLoading(false)
      }
    }, 5000)

    setBackgroundModal(false)
  }

  // Function to retry loading the image
  const handleRetryBackground = () => {
    // Increment load attempts to ensure we get a different image
    setLoadAttempts(loadAttempts + 1)
    handleGenerateBackground(`${lastPrompt} attempt:${loadAttempts + 1}`)
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        ...(background
          ? background.isGradient
            ? { background: background.url }
            : {
                backgroundImage: `url(${background.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }
          : { background: "none" }),
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

      {/* Loading indicator */}
      {isBackgroundLoading && (
        <div className="fixed bottom-16 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-20 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-primary-500 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
      )}

      {/* Retry button - shows when using a fallback gradient */}
      {background?.isGradient && (
        <div className="fixed bottom-16 left-4 z-20">
          <button
            onClick={handleRetryBackground}
            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg flex items-center gap-2"
            title="Försök igen med bild"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-xs text-gray-700 dark:text-gray-300 hidden sm:inline">Försök igen med bild</span>
          </button>
        </div>
      )}

      {/* Background selection modal */}
      <BackgroundModal
        isOpen={backgroundModal}
        onClose={() => setBackgroundModal(false)}
        onGenerate={handleGenerateBackground}
      />
    </div>
  )
}
