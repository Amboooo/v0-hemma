import React from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import type { Task } from "@/types/task"

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  return (
    <div className="rounded-2xl shadow-lg p-4 bg-white dark:bg-gray-800">
      <Calendar
        tileContent={({ date }) => {
          const dayTasks = tasks.filter(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate).toDateString() === date.toDateString()
          )

          if (dayTasks.length === 0) return null

          return (
            <ul className="mt-1 text-xs">
              {dayTasks.slice(0, 2).map((task) => (
                <li
                  key={task.id}
                  className={`${
                    task.completed ? "text-green-500" : "text-red-500"
                  }`}
                >
                  • {task.title}
                </li>
              ))}
              {dayTasks.length > 2 && (
                <li className="text-gray-400">+ {dayTasks.length - 2} fler</li>
              )}
            </ul>
          )
        }}
      />
    </div>
  )
}
