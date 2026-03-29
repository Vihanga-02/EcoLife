import { useState, useEffect, useCallback } from 'react'
import {
  Zap, Plus, Pencil, Trash2, Power,
  RefreshCw, CheckCircle, XCircle,
  UtensilsCrossed, Sofa, BedDouble, Cpu,
  Activity, BarChart3, Clock, FlaskConical, LineChart,
  Radio, LayoutDashboard, Layers, ChevronRight
} from 'lucide-react'
import { energyAPI } from '../../api/api'
import ApplianceForm from '../../components/forms/ApplianceForm'
import BillingStats from './BillingStats'

// ─── Constants ───────────────────────────────────────────────────────────
const CATEGORY_META = {
  Kitchen: { icon: UtensilsCrossed, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-400' },
  Living: { icon: Sofa, color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-200', bar: 'bg-sky-400' },
  Bedroom: { icon: BedDouble, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200', bar: 'bg-violet-400' },
  Other: { icon: Cpu, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', bar: 'bg-slate-400' },
}

const fmt = (n, d = 2) => parseFloat(n || 0).toFixed(d)

const hms = (hrs) => {
  const s = Math.floor(hrs * 3600)
  const hh = Math.floor(s / 3600).toString().padStart(2, '0')
  const mm = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  const ss = (s % 60).toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

// ─── Toast ───────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium flex items-center gap-2.5 transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
      }`}>
      {toast.type === 'error'
        ? <XCircle className="w-4 h-4 shrink-0" />
        : <CheckCircle className="w-4 h-4 shrink-0" />}
      {toast.msg}
    </div>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────
function ConfirmDialog({ name, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="text-red-500 w-5 h-5" />
        </div>
        <h3 className="font-bold text-black text-center mb-1">Remove Appliance?</h3>
        <p className="text-sm text-gray-500 text-center mb-5">
          <span className="font-semibold text-gray-700">{name}</span> and all its usage history will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: OVERVIEW ────────────────────────────────────────────────────────

// Live Watt Meter
function LiveMeter({ appliances }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const running = appliances.filter(a => a.status === 'on')
  const totalWatts = running.reduce((s, a) => s + a.wattage, 0)
  const kw = totalWatts / 1000
  const intensity = Math.min(1, totalWatts / 4000)

  const sessionKwh = running.reduce((sum, a) => {
    if (!a.lastStartTime) return sum
    const hrs = (Date.now() - new Date(a.lastStartTime).getTime()) / 3_600_000
    return sum + (a.wattage / 1000) * hrs
  }, 0)

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      {/* Glow overlay */}
      {totalWatts > 0 && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(16,185,129,${intensity * 0.25}) 0%, transparent 65%)` }}
        />
      )}

      <div className="relative z-10 p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${totalWatts > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">Live Power Meter</span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${running.length > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'
            }`}>
            {running.length} running
          </span>
        </div>

        {/* Big watt display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-6xl font-black text-white tabular-nums leading-none">
              {totalWatts.toLocaleString()}
            </span>
            <span className="text-2xl font-bold text-emerald-400 mb-1">W</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{kw.toFixed(3)} kW</span>
            <span className="w-1 h-1 bg-slate-600 rounded-full" />
            <span>{sessionKwh.toFixed(4)} kWh this session</span>
          </div>
        </div>

        {/* Running appliances list */}
        {running.length > 0 ? (
          <div className="space-y-2 mt-4 border-t border-slate-700/50 pt-4">
            {running.map(a => {
              const hrs = a.lastStartTime ? (Date.now() - new Date(a.lastStartTime).getTime()) / 3_600_000 : 0
              const skwh = (a.wattage / 1000) * hrs
              const Icon = (CATEGORY_META[a.category] || CATEGORY_META.Other).icon
              return (
                <div key={a._id} className="flex items-center gap-3 bg-white/5 hover:bg-white/8 rounded-xl px-4 py-2.5 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-slate-200 text-sm flex-1 truncate font-medium">{a.name}</span>
                  <span className="text-slate-400 text-xs font-mono">{hms(hrs)}</span>
                  <span className="text-emerald-400 text-xs font-mono font-semibold">{a.wattage}W</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-4 border-t border-slate-700/50 pt-4 text-center">
            <p className="text-slate-500 text-sm">Turn on an appliance to start live tracking</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Bill cards
function BillSection({ realTimeBill, estimateBill, rtLoading, estLoading, onRefreshRt, onRefreshEst }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Real-Time Bill */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
        <div className="relative z-10 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-400/20 rounded-xl flex items-center justify-center">
                <Radio className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wide">Real-Time Bill</p>
                <p className="text-emerald-400 text-xs">Based on actual usage</p>
              </div>
            </div>
            <button
              onClick={onRefreshRt}
              disabled={rtLoading}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-300 ${rtLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="mb-3">
            <div className="flex items-end gap-1.5">
              <span className="text-emerald-300 text-base font-semibold">Rs</span>
              <span className="text-4xl font-black text-white tabular-nums leading-none">{fmt(realTimeBill?.realTimeBill)}</span>
            </div>
            <p className="text-emerald-300 text-xs mt-1">{fmt(realTimeBill?.totalKwh, 3)} kWh tracked</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              <p className="text-emerald-400 text-xs">Tariff block</p>
              <p className="text-white text-sm font-semibold">{realTimeBill?.tariffApplied || '—'}</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-400/20 px-2.5 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-300 text-xs font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Bill */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)' }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #fbbf24, transparent)' }} />
        <div className="relative z-10 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-400/20 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p className="text-amber-200 text-xs font-semibold uppercase tracking-wide">Estimated Bill</p>
                <p className="text-amber-400 text-xs">Based on usage schedule</p>
              </div>
            </div>
            <button
              onClick={onRefreshEst}
              disabled={estLoading}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${estLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="mb-3">
            <div className="flex items-end gap-1.5">
              <span className="text-amber-300 text-base font-semibold">Rs</span>
              <span className="text-4xl font-black text-white tabular-nums leading-none">{fmt(estimateBill?.totalEstimatedBill)}</span>
            </div>
            <p className="text-amber-300 text-xs mt-1">{fmt(estimateBill?.totalEstimatedKwh, 3)} kWh estimated</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              <p className="text-amber-400 text-xs">Tariff block</p>
              <p className="text-white text-sm font-semibold">{estimateBill?.tariffApplied || '—'}</p>
            </div>
            <div>
              <p className="text-amber-400 text-xs">Effective rate</p>
              <p className="text-white text-sm font-semibold">
                {estimateBill?.effectiveUnitRate ? `Rs ${estimateBill.effectiveUnitRate}/kWh` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Category usage breakdown
function CategoryBreakdown({ appliances }) {
  const totalKwh = appliances.reduce((s, a) => s + (a.totalKwhThisMonth || 0), 0)
  const cats = Object.entries(CATEGORY_META).filter(([cat]) => appliances.some(a => a.category === cat))

  if (cats.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-gray-400" /> Usage by Category
      </h3>
      <div className="space-y-3">
        {cats.map(([cat, m]) => {
          const Icon = m.icon
          const kwh = appliances.filter(a => a.category === cat).reduce((s, a) => s + (a.totalKwhThisMonth || 0), 0)
          const pct = totalKwh > 0 ? (kwh / totalKwh) * 100 : 0
          const count = appliances.filter(a => a.category === cat).length
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 ${m.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{cat}</span>
                  <span className="text-xs text-gray-400">{count} appliance{count !== 1 ? 's' : ''}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-800">{fmt(kwh, 3)}</span>
                  <span className="text-xs text-gray-400 ml-1">kWh</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-2 ${m.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Per-appliance estimated cost breakdown
function EstimateBreakdown({ estimateBill }) {
  const items = estimateBill?.appliances?.filter(a => a.estimatedKwhPerMonth > 0) || []
  if (items.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-amber-500" /> Per-Appliance Estimate
      </h3>
      <div className="space-y-2">
        {items.map(a => (
          <div key={a.applianceId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">{a.name}</p>
              <p className="text-xs text-gray-400">{a.noOfHoursForDay}h/day · {a.noOfDaysForMonth}d/mo · {a.estimatedKwhPerMonth} kWh</p>
            </div>
            <div className="ml-3 text-right shrink-0">
              <p className="text-sm font-bold text-amber-700">Rs {fmt(a.estimatedCostPerMonth)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Overview tab summary stats bar
function StatsBar({ appliances }) {
  const runningCount = appliances.filter(a => a.status === 'on').length
  const totalKwh = appliances.reduce((s, a) => s + (a.totalKwhThisMonth || 0), 0)
  const totalWatts = appliances.filter(a => a.status === 'on').reduce((s, a) => s + a.wattage, 0)

  const stats = [
    { label: 'Appliances', value: appliances.length, suffix: '', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Layers className="w-4 h-4 text-blue-400" /> },
    { label: 'Running Now', value: runningCount, suffix: '', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Power className="w-4 h-4 text-emerald-400" /> },
    { label: 'Live Load', value: `${totalWatts}`, suffix: 'W', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
    { label: 'Tracked kWh', value: fmt(totalKwh, 3), suffix: 'kWh', color: 'text-purple-600', bg: 'bg-purple-50', icon: <Activity className="w-4 h-4 text-purple-400" /> },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
          <div className="shrink-0">{s.icon}</div>
          <div className="min-w-0">
            <p className={`text-xl font-black ${s.color} leading-none`}>
              {s.value}<span className="text-xs font-normal opacity-60 ml-0.5">{s.suffix}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Tab: APPLIANCES ─────────────────────────────────────────────────────

function ApplianceCard({ appliance, onToggle, onEdit, onDelete, toggling, estimateData }) {
  const m = CATEGORY_META[appliance.category] || CATEGORY_META.Other
  const Icon = m.icon
  const isOn = appliance.status === 'on'

  const [liveHrs, setLiveHrs] = useState(
    isOn && appliance.lastStartTime
      ? (Date.now() - new Date(appliance.lastStartTime).getTime()) / 3_600_000
      : 0
  )

  useEffect(() => {
    if (!isOn || !appliance.lastStartTime) { setLiveHrs(0); return }
    const id = setInterval(() => {
      setLiveHrs((Date.now() - new Date(appliance.lastStartTime).getTime()) / 3_600_000)
    }, 1000)
    return () => clearInterval(id)
  }, [isOn, appliance.lastStartTime])

  const sessionKwh = isOn ? (appliance.wattage / 1000) * liveHrs : 0
  const appEst = estimateData?.appliances?.find(e => String(e.applianceId) === String(appliance._id))

  return (
    <div className={`group bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${isOn
        ? 'border-emerald-400 shadow-lg shadow-emerald-100'
        : `${m.border} shadow-sm hover:shadow-md`
      }`}>
      {/* Colour accent bar */}
      <div className={`h-1 w-full ${isOn ? 'bg-emerald-400' : m.bar}`} />

      <div className="p-5">
        {/* ── Top row: icon + name + actions ── */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${isOn ? 'bg-emerald-100' : m.bg}`}>
              <Icon className={`w-5 h-5 ${isOn ? 'text-emerald-600' : m.color}`} />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-sm leading-tight">{appliance.name}</h3>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${m.bg} ${m.color}`}>
                {appliance.category}
              </span>
            </div>
          </div>

          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(appliance)}
              className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 border border-gray-200 flex items-center justify-center transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(appliance)}
              className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-200 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Wattage</p>
            <p className="text-lg font-black text-gray-800 leading-none">
              {appliance.wattage}<span className="text-xs font-normal text-gray-400 ml-0.5">W</span>
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Real kWh</p>
            <p className="text-lg font-black text-gray-800 leading-none">
              {fmt(appliance.totalKwhThisMonth, 3)}<span className="text-xs font-normal text-gray-400 ml-0.5">kWh</span>
            </p>
          </div>
        </div>

        {/* ── Estimated cost badge ── */}
        {appEst && appEst.estimatedKwhPerMonth > 0 && (
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
            <div className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-xs text-amber-700">
                {appEst.noOfHoursForDay}h × {appEst.noOfDaysForMonth}d = {appEst.estimatedKwhPerMonth} kWh
              </span>
            </div>
            <span className="text-xs font-bold text-amber-700 shrink-0 ml-2">
              Rs {fmt(appEst.estimatedCostPerMonth)}
            </span>
          </div>
        )}

        {/* ── Live session timer when ON ── */}
        {isOn && (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-xs font-mono text-emerald-700">{hms(liveHrs)}</span>
            </div>
            <span className="text-xs font-bold text-emerald-700">{sessionKwh.toFixed(4)} kWh</span>
          </div>
        )}

        {/* ── Toggle button ── */}
        <button
          onClick={() => onToggle(appliance._id)}
          disabled={toggling === appliance._id}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${isOn
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
            }`}
        >
          <Power className="w-4 h-4" />
          {toggling === appliance._id ? 'Updating…' : isOn ? 'Turn Off' : 'Turn On'}
        </button>
      </div>
    </div>
  )
}

// ─── Main EnergyPage ──────────────────────────────────────────────────────
export default function EnergyPage() {
  const [tab, setTab] = useState('overview')   // 'overview' | 'appliances'
  const [appliances, setAppliances] = useState([])
  const [realTimeBill, setRealTimeBill] = useState(null)
  const [estimateBill, setEstimateBill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rtLoading, setRtLoading] = useState(false)
  const [estLoading, setEstLoading] = useState(false)
  const [toggling, setToggling] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  const loadAppliances = useCallback(async () => {
    setLoading(true)
    try {
      const res = await energyAPI.getAppliances()
      setAppliances(res.data.appliances || [])
    } catch { showToast('Failed to load appliances.', 'error') }
    finally { setLoading(false) }
  }, [])

  const loadRt = useCallback(async () => {
    setRtLoading(true)
    try { setRealTimeBill((await energyAPI.realTimeBill()).data) } catch { /* silent */ }
    finally { setRtLoading(false) }
  }, [])

  const loadEst = useCallback(async () => {
    setEstLoading(true)
    try { setEstimateBill((await energyAPI.estimateBill()).data) } catch { /* silent */ }
    finally { setEstLoading(false) }
  }, [])

  useEffect(() => {
    loadAppliances()
    loadRt()
    loadEst()
  }, [loadAppliances, loadRt, loadEst])

  const handleToggle = async (id) => {
    setToggling(id)
    try {
      const res = await energyAPI.toggleAppliance(id)
      setAppliances(prev => prev.map(a => a._id === id ? res.data.appliance : a))
      loadRt()
    } catch { showToast('Toggle failed.', 'error') }
    finally { setToggling(null) }
  }

  const handleDelete = async () => {
    try {
      await energyAPI.deleteAppliance(deleteTarget._id)
      showToast(`"${deleteTarget.name}" removed.`)
      setDeleteTarget(null)
      loadAppliances(); loadRt(); loadEst()
    } catch {
      showToast('Delete failed.', 'error')
      setDeleteTarget(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false); setEditTarget(null)
    showToast(editTarget ? 'Appliance updated!' : 'Appliance added!')
    loadAppliances(); loadRt(); loadEst()
  }

  const categories = ['All', ...Object.keys(CATEGORY_META)]
  const filtered = activeCategory === 'All' ? appliances : appliances.filter(a => a.category === activeCategory)
  const runningCount = appliances.filter(a => a.status === 'on').length

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Toast toast={toast} />

      {/* ── Page hero header ── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 pt-6 pb-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
                <Zap className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">Energy Monitor</h1>
                <p className="text-gray-400 text-xs">Track usage · Monitor bills · Control appliances</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { loadAppliances(); loadRt(); loadEst() }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-sm transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
              <button
                onClick={() => { setEditTarget(null); setShowForm(true); setTab('appliances') }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl text-sm font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Add Appliance
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-0 border-b border-gray-100">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              {
                id: 'appliances', label: `Appliances${appliances.length > 0 ? ` (${appliances.length})` : ''}`, icon: Layers,
                badge: runningCount > 0 ? runningCount : null
              },
              { id: 'billing', label: 'Billing Stats', icon: LineChart },
            ].map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all -mb-px ${tab === t.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {t.badge && (
                    <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                      {t.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">

        {/* ═══════════ OVERVIEW TAB ═══════════ */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Stats bar */}
            <StatsBar appliances={appliances} />

            {/* Bills + Meter side-by-side on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Bills column */}
              <div className="lg:col-span-3 space-y-4">
                <BillSection
                  realTimeBill={realTimeBill}
                  estimateBill={estimateBill}
                  rtLoading={rtLoading}
                  estLoading={estLoading}
                  onRefreshRt={loadRt}
                  onRefreshEst={loadEst}
                />
                <EstimateBreakdown estimateBill={estimateBill} />
              </div>

              {/* Live meter column */}
              <div className="lg:col-span-2 space-y-4">
                <LiveMeter appliances={appliances} />
                <CategoryBreakdown appliances={appliances} />
              </div>
            </div>

            {/* CTA to go to appliances */}
            <button
              onClick={() => setTab('appliances')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-600 text-sm font-medium transition-all"
            >
              View All Appliances <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ═══════════ APPLIANCES TAB ═══════════ */}
        {tab === 'appliances' && (
          <div className="space-y-5">
            {/* Category filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {categories.map(cat => {
                const m = cat === 'All' ? null : CATEGORY_META[cat]
                const Icon = m?.icon
                const cnt = cat === 'All' ? appliances.length : appliances.filter(a => a.category === cat).length
                if (cnt === 0 && cat !== 'All') return null
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${activeCategory === cat
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-100'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
                      }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {cat}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeCategory === cat ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {cnt}
                    </span>
                  </button>
                )
              })}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Loading appliances…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-emerald-300" />
                </div>
                <h3 className="text-gray-800 font-bold text-lg mb-1">
                  {activeCategory === 'All' ? 'No appliances added yet' : `No ${activeCategory} appliances`}
                </h3>
                <p className="text-gray-400 text-sm mb-6 max-w-xs text-center">
                  Add your home appliances to start tracking energy usage and getting bill estimates.
                </p>
                <button
                  onClick={() => { setEditTarget(null); setShowForm(true) }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-bold shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add First Appliance
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(a => (
                  <ApplianceCard
                    key={a._id}
                    appliance={a}
                    onToggle={handleToggle}
                    onEdit={(ap) => { setEditTarget(ap); setShowForm(true) }}
                    onDelete={setDeleteTarget}
                    toggling={toggling}
                    estimateData={estimateBill}
                  />
                ))}

                {/* Add card at the end */}
                <button
                  onClick={() => { setEditTarget(null); setShowForm(true) }}
                  className="bg-white border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-emerald-600 transition-all min-h-[200px] group"
                >
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold">Add Appliance</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ BILLING STATS TAB ═══════════ */}
        {tab === 'billing' && (
          <div className="space-y-6">
            <BillingStats onFinalizeSuccess={() => {
              loadAppliances();
              loadRt();
              loadEst();
            }} />
          </div>
        )}
      </div>

      {/* ─── Modals ─── */}
      {showForm && (
        <ApplianceForm
          appliance={editTarget}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
