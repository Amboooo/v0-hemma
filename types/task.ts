export type TaskPriority = "low" | "medium" | "high"

export type TaskCategory = "Städning" | "Matlagning" | "Tvätt" | "Trädgård" | "Reparation" | "Övrigt"

export type AvatarType = "superman" | "belle" | "none"

export type HelperType = "beast" | "psykkatt" | "none"

export interface Task {
  id: string
  title: string
  description?: string
  category: TaskCategory
  priority: TaskPriority
  completed: boolean
  createdAt: string
  completedAt?: string
  customCompletedAt?: string
  completedBy?: AvatarType
  helper?: HelperType
  completedByName?: string
}

export const TASK_CATEGORIES: TaskCategory[] = ["Städning", "Matlagning", "Tvätt", "Trädgård", "Reparation", "Övrigt"]
