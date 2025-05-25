"use client"

import React from "react"
import type { Task } from "@/types/task"
import CustomCalendar from "@/components/CustomCalendar"

interface CalendarViewProps {
  tasks: Task[]
}

export default function CalendarView({ tasks }: CalendarViewProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Kalender</h2>
      <CustomCalendar />
      {/* Om du vill använda tasks här kan du lägga till logik */}
    </div>
  )
}
