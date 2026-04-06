import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  Leaf, BarChart2, Zap, Power,
  FlaskConical, Radio, ChevronRight, Layers
} from 'lucide-react'
import { energyAPI } from '../../api/api'

export default function OverviewPage() {
  const { user, refreshUser } = useAuth()

  // ─── Energy summary state ───────────────────────────────────────────────
  const [appliances, setAppliances] = useState([])
  const [realTimeBill, setRealTimeBill] = useState(null)
  const [estimateBill, setEstimateBill] = useState(null)
  const [energyLoading, setEnergyLoading] = useState(true)

  useEffect(() => {
    // Silently sync green score & profile on every dashboard visit
    refreshUser()
    const fetchEnergy = async () => {
      setEnergyLoading(true)
      try {
        const [appRes, rtRes, estRes] = await Promise.allSettled([
          energyAPI.getAppliances(),
          energyAPI.realTimeBill(),
          energyAPI.estimateBill(),
        ])
        if (appRes.status === 'fulfilled') setAppliances(appRes.value.data.appliances || [])
        if (rtRes.status === 'fulfilled') setRealTimeBill(rtRes.value.data)
        if (estRes.status === 'fulfilled') setEstimateBill(estRes.value.data)
      } catch { /* silent */ }
      finally { setEnergyLoading(false) }
    }
    fetchEnergy()
  }, [])

  const runningCount = appliances.filter(a => a.status === 'on').length
  const totalKwh = appliances.reduce((s, a) => s + (a.totalKwhThisMonth || 0), 0)
  const fmt = (n, d = 2) => parseFloat(n || 0).toFixed(d)

  return (
    <div className="p-5 md:p-6 max-w-4xl mx-auto space-y-5">

      {/* ── Page title ── */}
      <div>
        <h2 className="text-xl font-bold text-black">My Dashboard</h2>
        <p className="text-gray-500 text-sm">Your sustainability overview</p>
      </div>

      {/* ── Green Score hero ── */}
      <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-6 overflow-hidden shadow-lg">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute right-8 bottom-2 w-16 h-16 bg-white/5 rounded-full" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Leaf className="text-white w-8 h-8" />
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium">Your Green Score</p>
            <p className="text-5xl font-black text-white leading-none mt-0.5">{user?.greenScore || 0}</p>
            <p className="text-green-200 text-xs mt-1.5">Earn by logging waste, listing items &amp; recycling</p>
          </div>
        </div>
      </div>

      {/* ── General stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Transactions', value: user?.totalTransactions || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Waste Logs', value: '—', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Recycled (kg)', value: '—', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Carbon Saved', value: '—', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Energy Summary Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Energy Summary</p>
              <p className="text-xs text-gray-400">This month's overview</p>
            </div>
          </div>
          <Link
            to="/dashboard/energy"
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View Details <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {energyLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* 4 mini-stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-50">
              {[
                {
                  label: 'Appliances',
                  value: appliances.length,
                  suffix: '',
                  icon: <Layers className="w-4 h-4 text-blue-400" />,
                  color: 'text-blue-600',
                },
                {
                  label: 'Running Now',
                  value: runningCount,
                  suffix: '',
                  icon: <Power className="w-4 h-4 text-emerald-400" />,
                  color: 'text-emerald-600',
                },
                {
                  label: 'Tracked kWh',
                  value: fmt(totalKwh, 2),
                  suffix: 'kWh',
                  icon: <BarChart2 className="w-4 h-4 text-purple-400" />,
                  color: 'text-purple-600',
                },
                {
                  label: 'Real-Time Bill',
                  value: `Rs ${fmt(realTimeBill?.realTimeBill)}`,
                  suffix: '',
                  icon: <Radio className="w-4 h-4 text-rose-400" />,
                  color: 'text-rose-600',
                },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center justify-center py-5 px-3 gap-1.5">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center mb-0.5">
                    {s.icon}
                  </div>
                  <p className={`text-lg font-black ${s.color} leading-none`}>
                    {s.value}
                    {s.suffix && <span className="text-xs font-normal text-gray-400 ml-0.5">{s.suffix}</span>}
                  </p>
                  <p className="text-xs text-gray-400 text-center">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Estimated bill footer bar */}
            <div className="flex items-center justify-between bg-amber-50 border-t border-amber-100 px-5 py-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs text-amber-700 font-medium">
                  Estimated monthly bill based on your usage schedule
                </span>
              </div>
              <span className="text-sm font-black text-amber-700 shrink-0 ml-3">
                Rs {fmt(estimateBill?.totalEstimatedBill)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Activity placeholder ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-center min-h-[140px] text-gray-400 shadow-sm">
        <div className="text-center">
          <BarChart2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Activity charts will appear here</p>
        </div>
      </div>
    </div>
  )
}
