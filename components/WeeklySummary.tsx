"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import type { Task } from "@/types/task"
import { formatDateRange, getPreviousWeekRange, isSundayOrMonday } from "@/utils/dateUtils"

interface WeeklySummaryProps {
  tasks: Task[]
}

export default function WeeklySummary({ tasks }: WeeklySummaryProps) {
  const [showSummary, setShowSummary] = useState(false)
  const [previousWeekTasks, setPreviousWeekTasks] = useState<Task[]>([])
  const [dateRange, setDateRange] = useState("")

  useEffect(() => {
    // Only show the summary on Sunday or Monday
    const shouldShowSummary = isSundayOrMonday()
    setShowSummary(shouldShowSummary)

    if (shouldShowSummary) {
      // Get the previous week's date range
      const { start, end } = getPreviousWeekRange()
      setDateRange(formatDateRange(start, end))

      // Filter tasks for the previous week
      const filteredTasks = tasks.filter((task) => {
        if (!task.completed || (!task.customCompletedAt && !task.completedAt)) {
          return false
        }

        const completionDate = new Date(task.customCompletedAt || task.completedAt!)
        return completionDate >= start && completionDate <= end
      })

      setPreviousWeekTasks(filteredTasks)
    }
  }, [tasks])

  if (!showSummary || previousWeekTasks.length === 0) {
    return null
  }

  // Count tasks by avatar
  const avatarCounts = previousWeekTasks.reduce(
    (acc, task) => {
      const avatar = task.completedBy || "none"
      acc[avatar] = (acc[avatar] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Count tasks by helper
  const helperCounts = previousWeekTasks.reduce(
    (acc, task) => {
      const helper = task.helper || "none"
      acc[helper] = (acc[helper] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate total tasks
  const totalTasks = previousWeekTasks.length

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-lg shadow backdrop-blur-sm mb-8">
      <h3 className="text-xl font-semibold mb-4 text-center">Veckans sammanfattning</h3>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{dateRange}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Avatar summary */}
        <div>
          <h4 className="text-lg font-medium mb-4 text-center">Avklarade uppgifter</h4>
          <div className="flex justify-center items-end space-x-8">
            {Object.entries(avatarCounts)
              .filter(([avatar]) => avatar !== "none")
              .map(([avatar, count]) => (
                <div key={avatar} className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <div className="w-16 h-16 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-full">
                      <Image
                        src={avatar === "superman" ? "/images/superman.png" : "/images/belle.png"}
                        alt={avatar}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {count}
                    </div>
                  </div>
                  <div className="h-24 w-8 bg-gray-200 dark:bg-gray-700 rounded-t-lg relative">
                    <div
                      className="absolute bottom-0 w-full bg-primary-500 rounded-t-lg"
                      style={{
                        height: `${(count / totalTasks) * 100}%`,
                        minHeight: "10%",
                      }}
                    ></div>
                  </div>
                  <span className="mt-2 text-sm font-medium">{avatar === "superman" ? "Superman" : "Belle"}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Helper summary */}
        <div>
          <h4 className="text-lg font-medium mb-4 text-center">Hjälpredor</h4>
          <div className="flex justify-center items-end space-x-8">
            {Object.entries(helperCounts)
              .filter(([helper]) => helper !== "none")
              .map(([helper, count]) => (
                <div key={helper} className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <div className="w-16 h-16 flex items-center justify-center bg-secondary-100 dark:bg-secondary-900/30 rounded-full">
                      <Image
                        src={helper === "beast" ? "/images/beast.png" : "/images/devilbeast.png"}
                        alt={helper}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-secondary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {count}
                    </div>
                  </div>
                  <div className="h-24 w-8 bg-gray-200 dark:bg-gray-700 rounded-t-lg relative">
                    <div
                      className="absolute bottom-0 w-full bg-secondary-500 rounded-t-lg"
                      style={{
                        height: `${(count / totalTasks) * 100}%`,
                        minHeight: "10%",
                      }}
                    ></div>
                  </div>
                  <span className="mt-2 text-sm font-medium">{helper === "beast" ? "Beast" : "Psykkatt"}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        <p>
          Totalt avklarade uppgifter denna vecka: <span className="font-bold">{totalTasks}</span>
        </p>
      </div>
    </div>
  )
}
