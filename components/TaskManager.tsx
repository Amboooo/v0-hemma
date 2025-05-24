"use client"

import { useState } from "react"
import { useTasks } from "@/contexts/TaskContext"
import TaskForm from "./TaskForm"
import TaskList from "./TaskList"
import TaskStats from "./TaskStats"
import TaskCompletionModal from "./TaskCompletionModal"

export default function TaskManager() {
  const {
    tasks,
    loading,
    toggleTaskCompletion,
    deleteTask,
    showCompletionModal,
    setShowCompletionModal,
    currentTaskToComplete,
    completeTaskWithDetails,
  } = useTasks()

  const [activeTab, setActiveTab] = useState<"tasks" | "stats">("tasks")

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeTab === "tasks"
                ? "bg-primary-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Uppgifter
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeTab === "stats"
                ? "bg-primary-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            Statistik
          </button>
        </div>
      </div>

      <div className="card p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        {activeTab === "tasks" ? (
          <>
            <TaskForm />
            <TaskList 
              tasks={tasks.filter(task => !task.completed)} 
              onToggleCompletion={toggleTaskCompletion} 
              onDeleteTask={deleteTask} 
              />

          </>
        ) : (
          <TaskStats tasks={tasks} />
        )}
      </div>

      {currentTaskToComplete && (
        <TaskCompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          onConfirm={(completedBy, helper, completedByName, customCompletedAt) =>
            completeTaskWithDetails(currentTaskToComplete.id, completedBy, helper, completedByName, customCompletedAt)
          }
          taskTitle={currentTaskToComplete.title}
        />
      )}
    </div>
  )
}
