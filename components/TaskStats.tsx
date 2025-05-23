"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Task } from "@/types/task"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"
import WeeklySummary from "./WeeklySummary"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface TaskStatsProps {
  tasks: Task[]
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const [isClient, setIsClient] = useState(false)

  // This ensures the component only renders charts on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate completion rate
  const completedTasks = tasks.filter((task) => task.completed)
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0

  // Group tasks by category
  const categoryCounts = tasks.reduce(
    (acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Group tasks by priority
  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Group completed tasks by avatar
  const avatarCounts = completedTasks.reduce(
    (acc, task) => {
      const avatar = task.completedBy || "none"
      acc[avatar] = (acc[avatar] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Group completed tasks by helper
  const helperCounts = completedTasks.reduce(
    (acc, task) => {
      const helper = task.helper || "none"
      acc[helper] = (acc[helper] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Prepare data for pie chart (categories)
  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#0ea5e9", // sky-500
          "#10b981", // emerald-500
          "#f59e0b", // amber-500
          "#ef4444", // red-500
          "#8b5cf6", // violet-500
          "#6b7280", // gray-500
        ],
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for bar chart (priority)
  const priorityData = {
    labels: ["Låg", "Medium", "Hög"],
    datasets: [
      {
        label: "Antal uppgifter",
        data: [priorityCounts.low || 0, priorityCounts.medium || 0, priorityCounts.high || 0],
        backgroundColor: [
          "#0ea5e9", // sky-500
          "#f59e0b", // amber-500
          "#ef4444", // red-500
        ],
      },
    ],
  }

  // Prepare data for avatar chart
  const avatarData = {
    labels: Object.keys(avatarCounts).map((key) =>
      key === "superman" ? "Superman" : key === "belle" ? "Belle" : "Ingen vald",
    ),
    datasets: [
      {
        data: Object.values(avatarCounts),
        backgroundColor: [
          "#0ea5e9", // sky-500
          "#f59e0b", // amber-500
          "#6b7280", // gray-500
        ],
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for helper chart
  const helperData = {
    labels: Object.keys(helperCounts).map((key) =>
      key === "beast" ? "Beast" : key === "psykkatt" ? "Psykkatt" : "Ingen hjälp",
    ),
    datasets: [
      {
        data: Object.values(helperCounts),
        backgroundColor: [
          "#10b981", // emerald-500
          "#8b5cf6", // violet-500
          "#6b7280", // gray-500
        ],
        borderWidth: 1,
      },
    ],
  }

  // Chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Uppgifter per prioritet",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Inga uppgifter att visa statistik för. Lägg till några uppgifter först!</p>
      </div>
    )
  }

  if (!isClient) {
    return <div>Laddar statistik...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Statistik</h2>

      {/* Weekly Summary */}
      <WeeklySummary tasks={tasks} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow backdrop-blur-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Totalt antal uppgifter</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow backdrop-blur-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avklarade uppgifter</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</p>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow backdrop-blur-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avklaringsgrad</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{completionRate.toFixed(0)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow backdrop-blur-sm">
          <h3 className="text-lg font-medium mb-4 text-center">Uppgifter per kategori</h3>
          <div className="h-64">
            <Pie data={categoryData} options={pieOptions} />
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow backdrop-blur-sm">
          <h3 className="text-lg font-medium mb-4 text-center">Uppgifter per prioritet</h3>
          <div className="h-64">
            <Bar data={priorityData} options={barOptions} />
          </div>
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-4 text-center">Vem slutförde uppgifterna?</h3>
            <div className="h-64">
              <Pie data={avatarData} options={pieOptions} />
            </div>
            <div className="flex justify-center mt-4 gap-4">
              {Object.keys(avatarCounts)
                .filter((avatar) => avatar !== "none")
                .map((avatar) => (
                  <div key={avatar} className="flex flex-col items-center">
                    <div className="w-8 h-8 relative">
                      <Image
                        src={avatar === "superman" ? "/images/superman.png" : "/images/belle.png"}
                        alt={avatar}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs mt-1">{avatarCounts[avatar]} st</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-lg shadow backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-4 text-center">Hjälpredor</h3>
            <div className="h-64">
              <Pie data={helperData} options={pieOptions} />
            </div>
            <div className="flex justify-center mt-4 gap-4">
              {Object.keys(helperCounts)
                .filter((helper) => helper !== "none")
                .map((helper) => (
                  <div key={helper} className="flex flex-col items-center">
                    <div className="w-8 h-8 relative">
                      <Image
                        src={helper === "beast" ? "/images/beast.png" : "/images/Devilbeast_64x64.png"}
                        alt={helper}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs mt-1">{helperCounts[helper]} st</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
