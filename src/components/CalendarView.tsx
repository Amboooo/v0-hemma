import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Task } from '@/types/task'

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  return (
    <div>
      <Calendar
        tileContent={({ date }) => {
          const hasTask = tasks.some(
            (task) => task.dueDate && new Date(task.dueDate).toDateString() === date.toDateString()
          )
          return hasTask ? <span style={{ color: 'red' }}>●</span> : null
        }}
      />
    </div>
  )
}
