import { useState, useEffect } from 'react'
import { adminAPI } from '../../api/api'
import {
  Users, ShoppingBag, Trash2,
  CheckCircle, Clock, TrendingUp
} from 'lucide-react'

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white border border-green-300 rounded-xl p-5 flex items-center gap-4 shadow-md">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-black">{value ?? '—'}</p>
      <p className="text-gray-700 text-sm">{label}</p>
    </div>
  </div>
)

export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getStats()
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black">Admin Dashboard</h2>
          <p className="text-gray-700 text-sm">Platform overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Users" value={stats?.stats?.totalUsers} icon={<Users className="text-blue-400 text-xl" />} color="bg-blue-500/10" />
          <StatCard label="Active Users" value={stats?.stats?.activeUsers} icon={<CheckCircle className="text-green-600 text-xl" />} color="bg-green-500/10" />
          <StatCard label="Market Items" value={stats?.stats?.totalMarketItems} icon={<ShoppingBag className="text-purple-400 text-xl" />} color="bg-purple-500/10" />
          <StatCard label="Pending Recycling" value={stats?.stats?.pendingSubmissions} icon={<Clock className="text-yellow-400 text-xl" />} color="bg-yellow-500/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Users */}
          <div className="bg-white border border-green-300 rounded-xl p-5 shadow-md">
            <h3 className="text-black font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-600" /> Top Green Score Users
            </h3>
            {stats?.topUsers?.length > 0 ? (
              <div className="space-y-3">
                {stats.topUsers.map((u, i) => (
                  <div key={u._id} className="flex items-center gap-3">
                    <span className="text-gray-600 text-sm w-5">{i + 1}.</span>
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-black text-sm truncate">{u.name}</p>
                      <p className="text-gray-600 text-xs truncate">{u.email}</p>
                    </div>
                    <span className="text-green-600 text-sm font-medium">{u.greenScore} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No data yet</p>
            )}
          </div>

          {/* Waste by Type */}
          <div className="bg-white border border-green-300 rounded-xl p-5 shadow-md">
            <h3 className="text-black font-semibold mb-4 flex items-center gap-2">
              <Trash2 className="text-orange-600" /> Waste by Type
            </h3>
            {stats?.wasteByType?.length > 0 ? (
              <div className="space-y-2">
                {stats.wasteByType.map(w => (
                  <div key={w._id} className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm">{w._id}</span>
                    <span className="text-black text-sm font-medium">{w.total?.toFixed(1)} kg</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No waste logs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
