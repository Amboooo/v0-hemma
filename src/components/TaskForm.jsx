"use client"

import { useState } from "react"
import "./TaskForm.css"

const CATEGORIES = ["Städning", "Matlagning", "Tvätt", "Trädgård", "Reparation", "Övrigt"]

export function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [priority, setPriority] = useState("medium")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim()) return

    onAddTask({
      title,
      category,
      priority,
    })

    // Reset form
    setTitle("")
    setCategory(CATEGORIES[0])
    setPriority("medium")
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Lägg till ny uppgift</h2>

      <div className="form-group">
        <label htmlFor="title">Uppgift</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Vad behöver göras?"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Kategori</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Prioritet</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Låg</option>
            <option value="medium">Medium</option>
            <option value="high">Hög</option>
          </select>
        </div>
      </div>

      <button type="submit">Lägg till</button>
    </form>
  )
}
