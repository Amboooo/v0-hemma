import React from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "./CalendarStyles.css" // <- skapar vi strax
import type { Task } from "@/types/task"

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  return (
    <div className="rounded-2xl shadow-lg p-4 bg-white dark:bg-gray-800">
      <Calendar
        tileContent={({ date }) => {
          const hasTask = tasks.some(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate).toDateString() === date.toDateString()
          )
          const isCompleted = tasks.some(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate).toDateString() === date.toDateString() &&
              task.completed
          )
          return hasTask ? (
            <span
              style={{
                color: isCompleted ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              ●
            </span>
          ) : null
        }}
      />
    </div>
  )
}
