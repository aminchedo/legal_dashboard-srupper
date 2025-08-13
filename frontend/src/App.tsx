import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Loader2 } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface StatsData {
  totalItems: number
  recentItems: number
  categories: Record<string, number>
  avgRating: number
  todayStats: { success_rate: number }
  weeklyTrend: { day: string; success: number }[]
  monthlyGrowth: number
}

interface ActivityItem {
  id: string
  title: string
  domain: string
  status: string
}

interface ActivityData {
  items: ActivityItem[]
}

const App: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [activity, setActivity] = useState<ActivityData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
        const [statsRes, activityRes] = await Promise.all([
          fetch(`${apiBase}/dashboard/statistics`),
          fetch(`${apiBase}/dashboard/activity`),
        ])

        if (!statsRes.ok || !activityRes.ok) {
          throw new Error('Failed fetching data')
        }

        setStats(await statsRes.json())
        setActivity(await activityRes.json())
      } catch (err) {
        setError((err as Error).message)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        Error loading data: {error}
      </div>
    )
  }

  if (!stats || !activity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    )
  }

  const barData = {
    labels: stats.weeklyTrend.map((d) => d.day),
    datasets: [
      {
        label: 'Successful Items',
        data: stats.weeklyTrend.map((d) => d.success),
        backgroundColor: '#4f46e5',
      },
    ],
  }

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={stats.totalItems.toLocaleString()} />
        <StatCard title="Recent Items" value={stats.recentItems.toLocaleString()} />
        <StatCard title="Avg. Rating" value={stats.avgRating.toFixed(2)} />
        <StatCard title="Monthly Growth (%)" value={stats.monthlyGrowth.toFixed(1)} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Weekly Success Trend</h2>
        <Bar data={barData} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
        <ul className="space-y-2">
          {activity.items.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.domain}</p>
              </div>
              <StatusBadge status={item.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const color =
    status === 'completed'
      ? 'bg-emerald-500'
      : status === 'processing'
      ? 'bg-amber-500'
      : 'bg-rose-500'
  return (
    <span
      className={`${color} text-white text-xs font-medium px-2 py-1 rounded-full capitalize`}
    >
      {status}
    </span>
  )
}

const StatCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="p-4 bg-white rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="mt-1 text-2xl font-semibold">{value}</p>
  </div>
)

export default App