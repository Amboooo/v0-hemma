"use client"

import { useState, useEffect } from "react"
import { TaskForm } from "./components/TaskForm"
import { TaskList } from "./components/TaskList"
import { TaskStats } from "./components/TaskStats"
import { getStoredTasks, storeTasks } from "./utils/storage"
import "./App.css"

function App() {
  const [tasks, setTasks] = useState([])
  const [activeTab, setActiveTab] = useState("tasks")

  useEffect(() => {
    const storedTasks = getStoredTasks()
    if (storedTasks.length) {
      setTasks(storedTasks)
    }
  }, [])

  useEffect(() => {
    storeTasks(tasks)
  }, [tasks])

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now(), completed: false, createdAt: new Date() }])
  }

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : null }
          : task,
      ),
    )
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  return (
    <div className="app-container">
      <header>
        <h1>Hemmasysslor</h1>
        <div className="tabs">
          <button className={activeTab === "tasks" ? "active" : ""} onClick={() => setActiveTab("tasks")}>
            Uppgifter
          </button>
          <button className={activeTab === "stats" ? "active" : ""} onClick={() => setActiveTab("stats")}>
            Statistik
          </button>
        </div>
      </header>

      <main>
        {activeTab === "tasks" ? (
          <>
            <TaskForm onAddTask={addTask} />
            <TaskList tasks={tasks} onToggleCompletion={toggleTaskCompletion} onDeleteTask={deleteTask} />
          </>
        ) : (
          <TaskStats tasks={tasks} />
        )}
      </main>
    </div>
  )
}

export default App
