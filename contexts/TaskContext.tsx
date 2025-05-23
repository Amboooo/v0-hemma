"use client"

import type React from "react"

import { createContext, useState, useEffect, useContext } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { v4 as uuidv4 } from "uuid"
import type { Task, TaskCategory, TaskPriority, AvatarType, HelperType } from "@/types/task"

type TaskContextType = {
  tasks: Task[]
  loading: boolean
  addTask: (title: string, category: TaskCategory, priority: TaskPriority, description?: string) => void
  toggleTaskCompletion: (taskId: string) => void
  completeTaskWithDetails: (
    taskId: string,
    completedBy: AvatarType,
    helper: HelperType,
    completedByName: string,
    customCompletedAt?: string,
  ) => void
  deleteTask: (taskId: string) => void
  showCompletionModal: boolean
  setShowCompletionModal: (show: boolean) => void
  currentTaskToComplete: { id: string; title: string } | null
  setCurrentTaskToComplete: (task: { id: string; title: string } | null) => void
  userProfiles: any[]
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: true,
  addTask: () => {},
  toggleTaskCompletion: () => {},
  completeTaskWithDetails: () => {},
  deleteTask: () => {},
  showCompletionModal: false,
  setShowCompletionModal: () => {},
  currentTaskToComplete: null,
  setCurrentTaskToComplete: () => {},
  userProfiles: [],
})

export const useTasks = () => useContext(TaskContext)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { householdName } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [currentTaskToComplete, setCurrentTaskToComplete] = useState<{ id: string; title: string } | null>(null)
  const [userProfiles, setUserProfiles] = useState<any[]>([])

  // Load tasks from localStorage when household changes
  useEffect(() => {
    if (householdName) {
      loadTasks()
    } else {
      setTasks([])
    }
    setLoading(false)
  }, [householdName])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (householdName && tasks.length > 0) {
      saveTasks()
    }
  }, [tasks, householdName])

  const getStorageKey = () => {
    return `hemmasysslor-tasks-${householdName}`
  }

  const loadTasks = () => {
    try {
      const tasksJson = localStorage.getItem(getStorageKey())
      if (tasksJson) {
        setTasks(JSON.parse(tasksJson))
      }
    } catch (error) {
      console.error("Error loading tasks:", error)
    }
  }

  const saveTasks = () => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks:", error)
    }
  }

  const addTask = (title: string, category: TaskCategory, priority: TaskPriority, description?: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks([newTask, ...tasks])
  }

  const toggleTaskCompletion = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)

    if (!task) return

    if (!task.completed) {
      // If task is being marked as completed, show the modal
      setCurrentTaskToComplete({ id: taskId, title: task.title })
      setShowCompletionModal(true)
    } else {
      // If task is being marked as incomplete, just update it
      updateTaskCompletion(taskId, false)
    }
  }

  const updateTaskCompletion = (
    taskId: string,
    completed: boolean,
    completedBy?: AvatarType,
    helper?: HelperType,
    completedByName?: string,
    customCompletedAt?: string,
  ) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
            completedBy: completed ? completedBy : undefined,
            helper: completed ? helper : undefined,
            completedByName: completed ? completedByName : undefined,
            customCompletedAt: completed ? customCompletedAt : undefined,
          }
        }
        return task
      }),
    )
  }

  const completeTaskWithDetails = (
    taskId: string,
    completedBy: AvatarType,
    helper: HelperType,
    completedByName: string,
    customCompletedAt?: string,
  ) => {
    updateTaskCompletion(taskId, true, completedBy, helper, completedByName, customCompletedAt)
    setShowCompletionModal(false)
    setCurrentTaskToComplete(null)
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        toggleTaskCompletion,
        completeTaskWithDetails,
        deleteTask,
        showCompletionModal,
        setShowCompletionModal,
        currentTaskToComplete,
        setCurrentTaskToComplete,
        userProfiles,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
