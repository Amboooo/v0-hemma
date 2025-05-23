"use client"

import type React from "react"
import { useState } from "react"

interface BackgroundModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (prompt: string) => void
}

export default function BackgroundModal({ isOpen, onClose, onGenerate }: BackgroundModalProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    onGenerate(prompt)
    setPrompt("")
    // Reset loading after a short delay
    setTimeout(() => setIsLoading(false), 500)
  }

  const handleRandomImage = () => {
    setIsLoading(true)
    onGenerate("")
    setPrompt("")
    // Reset loading after a short delay
    setTimeout(() => setIsLoading(false), 500)
  }

  // Suggested prompt categories
  const suggestedPrompts = [
    { name: "Städning", prompt: "clean organized home" },
    { name: "Matlagning", prompt: "cooking kitchen food" },
    { name: "Trädgård", prompt: "garden plants flowers" },
    { name: "Vardagsrum", prompt: "cozy living room" },
    { name: "Kontor", prompt: "organized workspace" },
    { name: "Natur", prompt: "peaceful nature landscape" },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Välj bakgrund</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Beskriv bakgrunden du vill ha, eller lämna tomt för en slumpmässig bild.
        </p>

        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Prova med nyckelord som "clean", "organized", "kitchen", "garden", "workspace" för bästa resultat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="prompt" className="label">
              Beskrivning
            </label>
            <textarea
              id="prompt"
              className="input min-h-[100px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="T.ex. 'clean organized home' eller 'peaceful nature landscape'"
            />
          </div>

          {/* Suggested prompts */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Förslag:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => setPrompt(item.prompt)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
              Avbryt
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleRandomImage} disabled={isLoading}>
              {isLoading ? "Laddar..." : "Slumpmässig"}
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Genererar..." : "Generera"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
