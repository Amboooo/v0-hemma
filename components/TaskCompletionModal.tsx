"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import type { AvatarType, HelperType } from "@/types/task"

interface TaskCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (completedBy: AvatarType, helper: HelperType, completedByName: string, customCompletedAt?: string) => void
  taskTitle: string
}

export default function TaskCompletionModal({ isOpen, onClose, onConfirm, taskTitle }: TaskCompletionModalProps) {
  const { householdName } = useAuth()
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>("none")
  const [selectedHelper, setSelectedHelper] = useState<HelperType>("none")
  const [completedByName, setCompletedByName] = useState("")
  const [useCustomDate, setUseCustomDate] = useState(false)
  const [customDate, setCustomDate] = useState("")
  const [customTime, setCustomTime] = useState("")

  // Load saved name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("hemmasysslor-user-name")
    if (savedName) {
      setCompletedByName(savedName)
    }
  }, [])

  // Set default date and time when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date()
      setCustomDate(now.toISOString().split("T")[0])
      setCustomTime(now.toTimeString().slice(0, 5))
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!completedByName.trim()) {
      alert("Ange ditt namn")
      return
    }

    // Save name to localStorage for next time
    localStorage.setItem("hemmasysslor-user-name", completedByName)

    let customCompletedAt: string | undefined = undefined

    if (useCustomDate && customDate && customTime) {
      // Combine date and time into ISO string
      customCompletedAt = new Date(`${customDate}T${customTime}`).toISOString()
    }

    onConfirm(selectedAvatar, selectedHelper, completedByName, customCompletedAt)

    // Reset state
    setSelectedAvatar("none")
    setSelectedHelper("none")
    setUseCustomDate(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Uppgift avklarad!</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Bra jobbat med att slutföra uppgiften: <span className="font-medium">{taskTitle}</span>
        </p>

        {householdName && (
          <div className="mb-4 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-md">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              Du är inloggad i hushållet: <span className="font-medium">{householdName}</span>
            </p>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="completedByName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ditt namn
          </label>
          <input
            type="text"
            id="completedByName"
            className="input"
            value={completedByName}
            onChange={(e) => setCompletedByName(e.target.value)}
            placeholder="Ange ditt namn"
            required
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Vem slutförde uppgiften?</h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                selectedAvatar === "superman"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setSelectedAvatar("superman")}
            >
              <div className="w-16 h-16 relative mb-2">
                <Image src="/images/superman.png" alt="Superman" width={64} height={64} className="object-contain" />
              </div>
              <span className="font-medium">Superman</span>
            </div>
            <div
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                selectedAvatar === "belle"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setSelectedAvatar("belle")}
            >
              <div className="w-16 h-16 relative mb-2">
                <Image src="/images/belle.png" alt="Belle" width={64} height={64} className="object-contain" />
              </div>
              <span className="font-medium">Belle</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Fick du hjälp?</h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                selectedHelper === "beast"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setSelectedHelper("beast")}
            >
              <div className="w-16 h-16 relative mb-2">
                <Image src="/images/beast.png" alt="Beast" width={64} height={64} className="object-contain" />
              </div>
              <span className="font-medium">Beast</span>
            </div>
            <div
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center ${
                selectedHelper === "psykkatt"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setSelectedHelper("psykkatt")}
            >
              <div className="w-16 h-16 relative mb-2">
                <Image src="/images/Devilbeast_64x64.png" alt="Psykkatt" width={64} height={64} className="object-contain" />
              </div>
              <span className="font-medium">Psykkatt</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="useCustomDate"
              checked={useCustomDate}
              onChange={(e) => setUseCustomDate(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 mr-2"
            />
            <label htmlFor="useCustomDate" className="text-lg font-medium">
              Ange datum och tid för avklarad uppgift
            </label>
          </div>

          {useCustomDate && (
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label htmlFor="customDate" className="label">
                  Datum
                </label>
                <input
                  type="date"
                  id="customDate"
                  className="input"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  required={useCustomDate}
                />
              </div>
              <div>
                <label htmlFor="customTime" className="label">
                  Tid
                </label>
                <input
                  type="time"
                  id="customTime"
                  className="input"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  required={useCustomDate}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onClose()
            }}
          >
            Avbryt
          </button>
          <button type="button" className="btn btn-primary" onClick={handleConfirm}>
            Bekräfta
          </button>
        </div>
      </div>
    </div>
  )
}
