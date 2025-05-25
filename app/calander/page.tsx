"use client"

import CustomCalendar from "@/components/CustomCalendar"
import Header from "@/components/Header"

export default function CalendarPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Kalender</h1>
        <CustomCalendar />
      </main>
    </div>
  )
}
