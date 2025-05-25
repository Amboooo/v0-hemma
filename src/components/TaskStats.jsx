import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Pie, Bar } from "react-chartjs-2"
import "./TaskStats.css"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export function TaskStats({ tasks }) {
  // Calculate completion rate
  const completedTasks = tasks.filter((task) => task.completed)
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0

  // Group tasks by category
  const categoryCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1
    return acc
  }, {})

  // Group tasks by priority
  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {})

  // Prepare data for pie chart (categories)
  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          "#4f46e5", // Indigo
          "#10b981", // Emerald
          "#f59e0b", // Amber
          "#ef4444", // Red
          "#8b5cf6", // Purple
          "#6b7280", // Gray
        ],
        borderWidth: 1,
      },
    ],
  }

  // Prepare data for bar chart (priority)
  const priorityData = {
    labels: ["Låg", "Medium", "Hög"],
    datasets: [
      {
        label: "Antal uppgifter",
        data: [priorityCounts.low || 0, priorityCounts.medium || 0, priorityCounts.high || 0],
        backgroundColor: [
          "#0ea5e9", // Sky
          "#f59e0b", // Amber
          "#ef4444", // Red
        ],
      },
    ],
  }

  // Chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Uppgifter per prioritet",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-stats">
        <p>Inga uppgifter att visa statistik för. Lägg till några uppgifter först!</p>
      </div>
    )
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <div className="stat-card">
          <h3>Totalt antal uppgifter</h3>
          <p className="stat-value">{tasks.length}</p>
        </div>

        <div className="stat-card">
          <h3>Avklarade uppgifter</h3>
          <p className="stat-value">{completedTasks.length}</p>
        </div>

        <div className="stat-card">
          <h3>Avklaringsgrad</h3>
          <p className="stat-value">{completionRate.toFixed(0)}%</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-wrapper">
          <h3>Uppgifter per kategori</h3>
          <div className="chart">
            <Pie data={categoryData} options={pieOptions} />
          </div>
        </div>

        <div className="chart-wrapper">
          <h3>Uppgifter per prioritet</h3>
          <div className="chart">
            <Bar data={priorityData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
const visibleTasks = tasks.filter(task => !task.done);
