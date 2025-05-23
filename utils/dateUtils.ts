import type { Task } from "@/types/task"

// Get the week number for a given date
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

// Get the start and end dates of a week for a given date
export function getWeekRange(date: Date): { start: Date; end: Date } {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  const monday = new Date(date)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return { start: monday, end: sunday }
}

// Format a date range as a string
export function formatDateRange(start: Date, end: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
  return `${start.toLocaleDateString("sv-SE", options)} - ${end.toLocaleDateString("sv-SE", options)}`
}

// Group tasks by week
export function groupTasksByWeek(tasks: Task[]): Record<string, Task[]> {
  const weeks: Record<string, Task[]> = {}

  tasks.forEach((task) => {
    if (task.completed && (task.customCompletedAt || task.completedAt)) {
      const completionDate = new Date(task.customCompletedAt || task.completedAt!)
      const year = completionDate.getFullYear()
      const weekNum = getWeekNumber(completionDate)
      const weekKey = `${year}-${weekNum}`

      if (!weeks[weekKey]) {
        weeks[weekKey] = []
      }

      weeks[weekKey].push(task)
    }
  })

  return weeks
}

// Check if a date is today or in the past
export function isDateTodayOrPast(date: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date <= today
}

// Check if today is Sunday or Monday (to show weekly summary)
export function isSundayOrMonday(): boolean {
  const today = new Date()
  const day = today.getDay() // 0 is Sunday, 1 is Monday
  return day === 0 || day === 1
}

// Get the previous week's date range
export function getPreviousWeekRange(): { start: Date; end: Date } {
  const today = new Date()
  const lastSunday = new Date(today)

  // Go back to the most recent Sunday
  while (lastSunday.getDay() !== 0) {
    lastSunday.setDate(lastSunday.getDate() - 1)
  }

  const previousWeekStart = new Date(lastSunday)
  previousWeekStart.setDate(previousWeekStart.getDate() - 6)
  previousWeekStart.setHours(0, 0, 0, 0)

  const previousWeekEnd = new Date(lastSunday)
  previousWeekEnd.setHours(23, 59, 59, 999)

  return { start: previousWeekStart, end: previousWeekEnd }
}

// Filter tasks for the previous week
export function getTasksForPreviousWeek(tasks: Task[]): Task[] {
  const { start, end } = getPreviousWeekRange()

  return tasks.filter((task) => {
    if (!task.completed || (!task.customCompletedAt && !task.completedAt)) {
      return false
    }

    const completionDate = new Date(task.customCompletedAt || task.completedAt!)
    return completionDate >= start && completionDate <= end
  })
}
