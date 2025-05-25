"use client"
import "./TaskList.css"

export function TaskList({ tasks, onToggleCompletion, onDeleteTask }) {
  // Sortera först
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  // Filtrera bort klara uppgifter från synlig lista
  const visibleTasks = sortedTasks.filter(task => !task.completed)

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>Inga uppgifter än. Lägg till din första uppgift ovan!</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      <h2>Dina uppgifter</h2>
      <ul>
        {visibleTasks.map(task => (
          <li key={task.id}>
            <div className="task-content">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleCompletion(task.id)}
                />
                <span className="checkmark"></span>
              </label>

              <div className="task-details">
                <h3>{task.title}</h3>
                <div className="task-meta">
                  <span className="task-category">{task.category}</span>
                  <span className={`task-priority priority-${task.priority}`}>
                    {task.priority === "high"
                      ? "Hög"
                      : task.priority === "medium"
                      ? "Medium"
                      : "Låg"}
                  </span>
                </div>
              </div>
            </div>

            <button
              className="delete-btn"
              onClick={() => onDeleteTask(task.id)}
              aria-label="Ta bort uppgift"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
