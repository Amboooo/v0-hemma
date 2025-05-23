"use client"

import type React from "react"

import { useState } from "react"
import { useTasks } from "@/contexts/TaskContext"
import { type TaskCategory, type TaskPriority, TASK_CATEGORIES } from "@/types/task"

export default function TaskForm() {
  const { addTask } = useTasks()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<TaskCategory>("Städning")
  const [priority, setPriority] = useState<TaskPriority>("medium")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    await addTask(title, category, priority, description || undefined)

    // Reset form
    setTitle("")
    setDescription("")
    setCategory("Städning")
    setPriority("medium")
  }

  return (
    <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Lägg till ny uppgift</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="label">
            Uppgift *
          </label>
          <input
            type="text"
            id="title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Vad behöver göras?"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="label">
              Kategori
            </label>
            <select
              id="category"
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
            >
              {TASK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="label">
              Prioritet
            </label>
            <select
              id="priority"
              className="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
            >
              <option value="low">Låg</option>
              <option value="medium">Medium</option>
              <option value="high">Hög</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="label">
            Beskrivning
          </label>
          <textarea
            id="description"
            className="input min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Lägg till mer detaljer om uppgiften..."
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Lägg till
        </button>
      </form>
    </div>
  )
}
