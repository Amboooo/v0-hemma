import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import type { Task } from '@/types/task'

type CalendarViewProps = {
  tasks: Task[]
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  return (
    <div>
      <Calendar
        tileContent={({ date }) => {
          const hasTask = tasks.some(
            (task) =>
              task.dueDate &&
              new Date(task.dueDate).toDateString() === date.toDateString()
          )
          return hasTask ? <span style={{ color: 'red' }}>●</span> : null
        }}
      />
    </div>
  )
}
