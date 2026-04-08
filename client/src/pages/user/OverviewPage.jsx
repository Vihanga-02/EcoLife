import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  Leaf, BarChart2, Zap, Power,
  FlaskConical, Radio, ChevronRight, Layers, Trash2, Recycle, ShoppingBag
} from 'lucide-react'
import { energyAPI, wasteAPI, recyclingAPI, marketplaceAPI } from '../../api/api'

export default function OverviewPage() {
  const { user, refreshUser } = useAuth()

  // ─── Energy summary state ───────────────────────────────────────────────
  const [appliances, setAppliances] = useState([])
  const [realTimeBill, setRealTimeBill] = useState(null)
  const [estimateBill, setEstimateBill] = useState(null)
  const [energyLoading, setEnergyLoading] = useState(true)

  // ─── Other summaries ────────────────────────────────────────────────────
  const [wasteAnalytics, setWasteAnalytics] = useState(null)
  const [recyclingSubmissions, setRecyclingSubmissions] = useState([])
  const [marketItems, setMarketItems] = useState([])
  const [marketTxns, setMarketTxns] = useState([])
  const [otherLoading, setOtherLoading] = useState(true)

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

    const fetchOther = async () => {
      setOtherLoading(true)
      try {
        const [wasteRes, recRes, itemsRes, txRes] = await Promise.allSettled([
          wasteAPI.getAnalytics(),
          recyclingAPI.getMySubmissions(),
          marketplaceAPI.getMyItems(),
          marketplaceAPI.getMyTransactions(),
        ])

        if (wasteRes.status === 'fulfilled') setWasteAnalytics(wasteRes.value.data)
        if (recRes.status === 'fulfilled') setRecyclingSubmissions(recRes.value.data.submissions || [])
        if (itemsRes.status === 'fulfilled') setMarketItems(itemsRes.value.data.items || [])
        if (txRes.status === 'fulfilled') setMarketTxns(txRes.value.data.transactions || [])
      } catch {
        // silent
      } finally {
        setOtherLoading(false)
      }
    }

    fetchOther()
  }, [])

  const runningCount = appliances.filter(a => a.status === 'on').length
  const totalKwh = appliances.reduce((s, a) => s + (a.totalKwhThisMonth || 0), 0)
  const fmt = (n, d = 2) => parseFloat(n || 0).toFixed(d)

  const approvedSubs = recyclingSubmissions.filter(s => s.status === 'approved')
  const recycledKg = approvedSubs.reduce((acc, s) => acc + (Number(s.estimatedWeight) || 0), 0)
  const carbonSavedKg = wasteAnalytics?.totalCarbonEquivalent || 0

  const marketAvailable = marketItems.filter(i => i.status === 'available').length
  const marketReserved = marketItems.filter(i => i.status === 'reserved').length
  const marketCompleted = marketItems.filter(i => i.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-5 md:p-6 max-w-4xl mx-auto space-y-5">

      {/* ── Page title ── */}
      <div>
        <h2 className="text-xl font-bold text-black">My Dashboard</h2>
        <p className="text-gray-500 text-sm">Your sustainability overview</p>
      </div>

      {/* ── Green Score hero ── */}
      <div className="relative bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-6 overflow-hidden shadow-lg">
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
          { label: 'Waste Logs', value: otherLoading ? '—' : (wasteAnalytics?.totalLogs || 0), color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Recycled (kg)', value: otherLoading ? '—' : fmt(recycledKg, 1), color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Carbon Saved', value: otherLoading ? '—' : `${fmt(carbonSavedKg, 1)} kg`, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Summaries grid (2×2 on desktop) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Waste Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Waste Summary</p>
                <p className="text-xs text-gray-400">Your logged waste impact</p>
              </div>
            </div>
            <Link
              to="/dashboard/waste"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {otherLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-50">
              {[
                {
                  label: 'Total Logs',
                  value: wasteAnalytics?.totalLogs || 0,
                  icon: <BarChart2 className="w-4 h-4 text-blue-400" />,
                  color: 'text-blue-600',
                },
                {
                  label: 'Recyclable',
                  value: wasteAnalytics?.recyclableItems || 0,
                  icon: <Recycle className="w-4 h-4 text-emerald-400" />,
                  color: 'text-emerald-600',
                },
                {
                  label: 'Biodegradable',
                  value: wasteAnalytics?.biodegradableItems || 0,
                  icon: <Leaf className="w-4 h-4 text-teal-400" />,
                  color: 'text-teal-600',
                },
                {
                  label: 'Carbon Saved',
                  value: `${fmt(wasteAnalytics?.totalCarbonEquivalent, 1)} kg`,
                  icon: <FlaskConical className="w-4 h-4 text-purple-400" />,
                  color: 'text-purple-600',
                },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center justify-center py-5 px-3 gap-1.5">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center mb-0.5">
                    {s.icon}
                  </div>
                  <p className={`text-lg font-black ${s.color} leading-none`}>{s.value}</p>
                  <p className="text-xs text-gray-400 text-center">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recycling Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                <Recycle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Recycling Summary</p>
                <p className="text-xs text-gray-400">Drop-off requests overview</p>
              </div>
            </div>
            <Link
              to="/dashboard/recycling"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {otherLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-50">
              {[
                {
                  label: 'Approved',
                  value: approvedSubs.length,
                  icon: <Recycle className="w-4 h-4 text-emerald-400" />,
                  color: 'text-emerald-600',
                },
                {
                  label: 'Pending',
                  value: recyclingSubmissions.filter(s => s.status === 'pending').length,
                  icon: <Radio className="w-4 h-4 text-amber-400" />,
                  color: 'text-amber-600',
                },
                {
                  label: 'Recycled',
                  value: `${fmt(recycledKg, 1)} kg`,
                  icon: <Layers className="w-4 h-4 text-green-400" />,
                  color: 'text-green-700',
                },
                {
                  label: 'Points (approx)',
                  value: `${Math.round(recycledKg * 3)} pts`,
                  icon: <Leaf className="w-4 h-4 text-teal-400" />,
                  color: 'text-teal-600',
                },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center justify-center py-5 px-3 gap-1.5">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center mb-0.5">
                    {s.icon}
                  </div>
                  <p className={`text-lg font-black ${s.color} leading-none`}>{s.value}</p>
                  <p className="text-xs text-gray-400 text-center">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Marketplace Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Marketplace Summary</p>
                <p className="text-xs text-gray-400">Your listings &amp; requests</p>
              </div>
            </div>
            <Link
              to="/dashboard/market"
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {otherLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-50">
              {[
                {
                  label: 'Listings',
                  value: marketItems.length,
                  icon: <Layers className="w-4 h-4 text-sky-400" />,
                  color: 'text-sky-600',
                },
                {
                  label: 'Available',
                  value: marketAvailable,
                  icon: <Leaf className="w-4 h-4 text-emerald-400" />,
                  color: 'text-emerald-600',
                },
                {
                  label: 'Reserved',
                  value: marketReserved,
                  icon: <Radio className="w-4 h-4 text-amber-400" />,
                  color: 'text-amber-600',
                },
                {
                  label: 'Requests',
                  value: marketTxns.filter(t => t.status === 'pending').length,
                  icon: <BarChart2 className="w-4 h-4 text-violet-400" />,
                  color: 'text-violet-600',
                },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center justify-center py-5 px-3 gap-1.5">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center mb-0.5">
                    {s.icon}
                  </div>
                  <p className={`text-lg font-black ${s.color} leading-none`}>{s.value}</p>
                  <p className="text-xs text-gray-400 text-center">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Energy Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
      </div>
      </div>
    </div>
  )
}
