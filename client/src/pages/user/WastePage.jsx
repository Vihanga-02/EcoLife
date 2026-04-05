import { useState, useEffect, useCallback } from 'react'
import {
  Trash2, Plus, RefreshCw, CheckCircle, XCircle,
  Recycle, Leaf, FlaskConical,
  Package, BarChart3, Pencil
} from 'lucide-react'
import { wasteAPI } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import WasteLogForm from '../../components/forms/WasteLogForm'
import WasteBreakdownChart from '../../components/WasteBreakdownChart'

// ─── Constants ────────────────────────────────────────────────────────────
const WASTE_TYPES = ['Plastic', 'Paper', 'Glass', 'Organic', 'E-waste']

const TYPE_META = {
  Plastic: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-400', emoji: '🧴' },
  Paper: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', bar: 'bg-yellow-400', emoji: '📄' },
  Glass: { color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', bar: 'bg-cyan-400', emoji: '🍶' },
  Organic: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', bar: 'bg-green-400', emoji: '🌿' },
  'E-waste': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-400', emoji: '🔌' },
}

const fmt = (n, d = 2) => parseFloat(n || 0).toFixed(d)

// ─── Confirm Delete ───────────────────────────────────────────────────────
function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="text-red-500 w-5 h-5" />
        </div>
        <h3 className="font-bold text-black text-center mb-1">Delete Waste Log?</h3>
        <p className="text-sm text-gray-500 text-center mb-5">
          This log and its carbon data will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main WastePage ───────────────────────────────────────────────────────
export default function WastePage() {
  const { refreshUser } = useAuth()

  const [logs, setLogs] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [monthlyData, setMonthlyData] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [activeType, setActiveType] = useState('All')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [logsRes, analyticsRes, monthlyRes] = await Promise.allSettled([
        wasteAPI.getLogs(),
        wasteAPI.getAnalytics(),
        wasteAPI.getMonthlyBreakdown(),
      ])

      if (logsRes.status === 'fulfilled') {
        setLogs(logsRes.value.data.logs || [])
      }

      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data)
      }

      if (monthlyRes.status === 'fulfilled') {
        setMonthlyData(monthlyRes.value.data.data || [])
      }
    } catch (err) {
      console.error(err)
      showToast('Failed to load waste data.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async () => {
    try {
      await wasteAPI.deleteLog(deleteTarget._id)
      showToast('Log deleted.')
      setDeleteTarget(null)
      load()
    } catch {
      showToast('Delete failed.', 'error')
      setDeleteTarget(null)
    }
  }

  const handleFormSuccess = async () => {
    const wasNew = !editTarget

    setShowForm(false)
    setEditTarget(null)

    await load()
    showToast(wasNew ? 'Waste logged! +2 Green pts 🌿' : 'Log updated!')

    if (wasNew) refreshUser()
  }

  const types = ['All', ...WASTE_TYPES]
  const filtered = activeType === 'All' ? logs : logs.filter(l => l.wasteType === activeType)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium flex items-center gap-2 ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
          }`}
        >
          {toast.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center shadow-sm">
              <img src="../../src/assets/bin.png" alt="Bin" className="w-20 h-20 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Waste Tracker</h1>
              <p className="text-gray-400 text-xs">Log waste · Track carbon · Earn green points</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={load}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>

            <button
              onClick={() => {
                setEditTarget(null)
                setShowForm(true)
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Log Waste
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Analytics cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Logs',
              value: analytics?.totalLogs || 0,
              icon: <Package className="w-4 h-4 text-blue-400" />,
              bg: 'bg-blue-50',
              txt: 'text-blue-700',
            },
            {
              label: 'Carbon Equiv.',
              value: `${fmt(analytics?.totalCarbonEquivalent, 1)} kg`,
              icon: <FlaskConical className="w-4 h-4 text-purple-400" />,
              bg: 'bg-purple-50',
              txt: 'text-purple-700',
            },
            {
              label: 'Recyclable Logs',
              value: analytics?.recyclableItems || 0,
              icon: <Recycle className="w-4 h-4 text-green-400" />,
              bg: 'bg-green-50',
              txt: 'text-green-700',
            },
            {
              label: 'Biodegradable',
              value: analytics?.biodegradableItems || 0,
              icon: <Leaf className="w-4 h-4 text-teal-400" />,
              bg: 'bg-teal-50',
              txt: 'text-teal-700',
            },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
              <div className="shrink-0">{s.icon}</div>
              <div className="min-w-0">
                <p className={`text-xl font-black ${s.txt} leading-none truncate`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts in one row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WasteBreakdownChart data={monthlyData} />

          {analytics?.totalByType && Object.keys(analytics.totalByType).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-gray-400" /> Waste Quantity by Type
              </h3>
              <p className="text-xs text-gray-500 mb-4">Quantity recorded under each waste type.</p>

              <div className="space-y-4">
                {Object.entries(analytics.totalByType)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, qty]) => {
                    const m = TYPE_META[type] || TYPE_META.Plastic
                    const max = Math.max(...Object.values(analytics.totalByType))
                    const pct = max > 0 ? (qty / max) * 100 : 0

                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{m.emoji}</span>
                            <span className="text-sm font-medium text-gray-700">{type}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-800">{fmt(qty, 2)}</span>
                        </div>

                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-2.5 ${m.bar} rounded-full transition-all duration-700`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Filter tabs + Logs list */}
        <div>
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            {types.map(t => {
              const m = t === 'All' ? null : TYPE_META[t]
              const cnt = t === 'All' ? logs.length : logs.filter(l => l.wasteType === t).length
              if (cnt === 0 && t !== 'All') return null

              return (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    activeType === t
                      ? 'bg-green-600 text-white border-green-600 shadow-sm'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-green-300'
                  }`}
                >
                  {m?.emoji} {t}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      activeType === t ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cnt}
                  </span>
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-gray-800 font-bold text-lg mb-1">No waste logs yet</h3>
              <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
                Start logging your waste to track your environmental impact and earn green points.
              </p>
              <button
                onClick={() => {
                  setEditTarget(null)
                  setShowForm(true)
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold shadow-md mx-auto"
              >
                <Plus className="w-4 h-4" /> Log First Waste
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(log => {
                const m = TYPE_META[log.wasteType] || TYPE_META.Plastic

                return (
                  <div
                    key={log._id}
                    className={`bg-white rounded-2xl border-2 ${m.border} p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group`}
                  >
                    <div className={`w-12 h-12 ${m.bg} rounded-2xl flex items-center justify-center text-2xl shrink-0`}>
                      {m.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${m.color}`}>{log.wasteType}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {log.quantity} {log.unit}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.date).toLocaleDateString('en-LK', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FlaskConical className="w-3 h-3" /> {fmt(log.carbonEquivalent, 2)} kg CO₂e
                        </span>

                        {log.isRecyclable && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Recycle className="w-3 h-3" /> Recyclable
                          </span>
                        )}

                        {log.isBiodegradable && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Leaf className="w-3 h-3" /> Biodegradable
                          </span>
                        )}
                      </div>

                      {log.notes && <p className="text-xs text-gray-400 mt-1 truncate">{log.notes}</p>}
                    </div>

                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => {
                          setEditTarget(log)
                          setShowForm(true)
                        }}
                        className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 border border-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(log)}
                        className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <WasteLogForm
          log={editTarget}
          onSuccess={handleFormSuccess}
          onClose={() => {
            setShowForm(false)
            setEditTarget(null)
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}