import { useAuth } from '../../context/AuthContext'
import { Leaf, BarChart2 } from 'lucide-react'

export default function OverviewPage() {
  const { user } = useAuth()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">My Dashboard</h2>
        <p className="text-gray-700 text-sm">Your sustainability overview</p>
      </div>

      {/* Green score hero */}
      <div className="bg-white border border-green-300 rounded-xl p-6 mb-4 flex items-center gap-6 bg-gradient-to-r from-green-100 to-white shadow-md">
        <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center shrink-0">
          <Leaf className="text-green-700 text-2xl" />
        </div>
        <div>
          <p className="text-gray-700 text-sm">Your Green Score</p>
          <p className="text-4xl font-bold text-green-600">{user?.greenScore || 0}</p>
          <p className="text-gray-600 text-xs mt-0.5">Keep earning by logging waste, listing items &amp; recycling</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Transactions', value: user?.totalTransactions || 0, color: 'text-blue-600' },
          { label: 'Waste Logs', value: '—', color: 'text-orange-600' },
          { label: 'Recycled (kg)', value: '—', color: 'text-green-600' },
          { label: 'Carbon Saved', value: '—', color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-green-300 rounded-xl p-4 text-center shadow-md">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-700 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-green-300 rounded-xl p-6 flex items-center justify-center min-h-[160px] text-gray-600 shadow-md">
        <div className="text-center">
          <BarChart2 className="text-3xl mx-auto mb-2 text-green-500" />
          <p>Activity charts will appear here</p>
        </div>
      </div>
    </div>
  )
}
