const STORAGE_KEY = "hemmasysslor-tasks"

export function getStoredTasks() {
  try {
    const tasksJson = localStorage.getItem(STORAGE_KEY)
    if (!tasksJson) return []

    const tasks = JSON.parse(tasksJson)

    // Convert date strings back to Date objects
    return tasks.map((task) => ({
      ...task,
      createdAt: task.createdAt ? new Date(task.createdAt) : null,
      completedAt: task.completedAt ? new Date(task.completedAt) : null,
    }))
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error)
    return []
  }
}

export function storeTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error)
  }
}
