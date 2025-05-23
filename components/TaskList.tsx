"use client"

import Image from "next/image"
import type { Task } from "@/types/task"

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
}

export default function TaskList({ tasks, onToggleCompletion, onDeleteTask }: TaskListProps) {
  // Sort tasks: incomplete first, then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const getAvatarImage = (avatarType: string | undefined) => {
    switch (avatarType) {
      case "superman":
        return "/images/superman.png"
      case "belle":
        return "/images/belle.png"
      default:
        return null
    }
  }

  const getHelperImage = (helperType: string | undefined) => {
    switch (helperType) {
      case "beast":
        return "/images/beast.png"
      case "psykkatt":
        return "/images/Devilbeast_64x64.png"
      default:
        return null
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Inga uppgifter än. Lägg till din första uppgift ovan!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dina uppgifter</h2>
      <ul className="space-y-3">
        {sortedTasks.map((task) => (
          <li
            key={task.id}
            className={`p-4 rounded-lg border ${
              task.completed
                ? "bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
                : "bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700"
            } backdrop-blur-sm`}
          >
            <div className="flex items-start gap-3">
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleCompletion(task.id)}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3
                    className={`text-lg font-medium ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {task.title}
                  </h3>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}
                  >
                    {task.priority === "high" ? "Hög" : task.priority === "medium" ? "Medium" : "Låg"}
                  </span>

                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {task.category}
                  </span>
                </div>

                {task.description && (
                  <p
                    className={`text-sm ${
                      task.completed ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {task.description}
                  </p>
                )}

                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Skapad: {new Date(task.createdAt).toLocaleDateString("sv-SE")}
                  {task.completed && (task.customCompletedAt || task.completedAt) && (
                    <span className="ml-3">
                      Avklarad:{" "}
                      {task.customCompletedAt
                        ? new Date(task.customCompletedAt).toLocaleDateString("sv-SE") +
                          " " +
                          new Date(task.customCompletedAt).toLocaleTimeString("sv-SE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : new Date(task.completedAt!).toLocaleDateString("sv-SE")}
                    </span>
                  )}
                </div>

                {task.completed && (
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    {task.completedByName && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Avklarad av:</span>
                        <div className="flex items-center gap-1">
                          {task.completedBy && task.completedBy !== "none" && (
                            <div className="w-6 h-6 relative">
                              <Image
                                src={getAvatarImage(task.completedBy) || ""}
                                alt={task.completedBy}
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </div>
                          )}
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {task.completedByName}
                          </span>
                        </div>
                      </div>
                    )}

                    {task.helper && task.helper !== "none" && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Med hjälp av:</span>
                        <div className="w-6 h-6 relative">
                          <Image
                            src={getHelperImage(task.helper) || ""}
                            alt={task.helper}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                aria-label="Ta bort uppgift"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
