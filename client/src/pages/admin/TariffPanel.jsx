import { useState, useEffect, useCallback } from 'react'
import {
  Zap, Plus, Pencil, Trash2, CheckCircle,
  XCircle, RefreshCw, TrendingUp, Layers
} from 'lucide-react'
import { energyAPI } from '../../api/api'
import TariffForm from '../../components/forms/TariffForm'

// Colour palette cycled per block
const BLOCK_COLOURS = [
  { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', bar: 'bg-green-500', dot: 'bg-green-400' },
  { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500', dot: 'bg-blue-400' },
  { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500', dot: 'bg-purple-400' },
  { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500', dot: 'bg-orange-400' },
  { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', bar: 'bg-pink-500', dot: 'bg-pink-400' },
]

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="text-red-500 w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-black">Delete Tariff Block</h3>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function TariffPanel() {
  const [tariffs, setTariffs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await energyAPI.getTariffs()
      setTariffs(res.data.tariffs || [])
    } catch {
      showToast('Failed to load tariffs.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async () => {
    try {
      await energyAPI.deleteTariff(deleteTarget._id)
      showToast(`"${deleteTarget.blockName}" deleted.`)
      setDeleteTarget(null)
      load()
    } catch {
      showToast('Delete failed.', 'error')
      setDeleteTarget(null)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditTarget(null)
    showToast(editTarget ? 'Tariff updated!' : 'Tariff block created!')
    load()
  }

  // Generate next block name e.g. "Block 3"
  const nextBlockName = `Block ${tariffs.length + 1}`

  // Summary stats
  const activeTariffs = tariffs.filter(t => t.isActive).length
  const maxRate = tariffs.length ? Math.max(...tariffs.map(t => t.unitRate)) : 0
  const totalBlocks = tariffs.length

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ─── Toast ─── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}>
          {toast.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <Zap className="text-yellow-500 w-6 h-6" /> Tariff Management
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Configure electricity pricing blocks for bill calculation</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-xl text-sm font-medium transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Block
          </button>
        </div>
      </div>

      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Blocks', value: totalBlocks, icon: <Layers className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50', txt: 'text-purple-700' },
          { label: 'Active Blocks', value: activeTariffs, icon: <CheckCircle className="w-5 h-5 text-green-500" />, bg: 'bg-green-50', txt: 'text-green-700' },
          { label: 'Max Rate', value: `Rs ${maxRate}/kWh`, icon: <TrendingUp className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50', txt: 'text-orange-700' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white shadow-sm`}>
            <div className="flex items-center gap-2 mb-1">{s.icon}</div>
            <p className={`text-xl font-bold ${s.txt}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ─── Tariff blocks ─── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tariffs.length === 0 ? (
        <div className="bg-white border border-dashed border-yellow-300 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="text-yellow-400 w-8 h-8" />
          </div>
          <h3 className="text-black font-semibold text-lg mb-1">No tariff blocks yet</h3>
          <p className="text-gray-500 text-sm mb-5">Add your first pricing block to enable bill estimation for users.</p>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true) }}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl text-sm font-medium"
          >
            + Add First Block
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Visual stair chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-2">
            <p className="text-xs text-gray-500 uppercase font-medium mb-3 tracking-wide">Rate Overview</p>
            <div className="space-y-2.5">
              {tariffs.map((t, i) => {
                const c = BLOCK_COLOURS[i % BLOCK_COLOURS.length]
                const pct = maxRate > 0 ? Math.round((t.unitRate / maxRate) * 100) : 0
                return (
                  <div key={t._id} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-14 shrink-0">{t.blockName}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className={`${c.bar} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-20 text-right shrink-0">Rs {t.unitRate}/kWh</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Block cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tariffs.map((t, i) => {
              const c = BLOCK_COLOURS[i % BLOCK_COLOURS.length]
              return (
                <div key={t._id} className={`${c.bg} border ${c.border} rounded-2xl p-5 shadow-sm relative overflow-hidden`}>
                  {/* Block number watermark */}
                  <div className="absolute -right-3 -top-3 text-7xl font-black text-black/5 select-none pointer-events-none">
                    {i + 1}
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${c.badge}`}>{t.blockName}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {t.isActive ? '● Active' : '○ Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs">
                        {t.minUnits} – {t.maxUnits != null ? t.maxUnits : '∞'} kWh
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => { setEditTarget(t); setShowForm(true) }}
                        className="p-2 rounded-xl bg-white/70 hover:bg-white border border-white/50 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
                        className="p-2 rounded-xl bg-white/70 hover:bg-white border border-white/50 text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-0.5">Unit Rate</p>
                      <p className="text-lg font-bold text-gray-800">Rs {t.unitRate}</p>
                      <p className="text-xs text-gray-400">per kWh</p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-0.5">Fixed Charge</p>
                      <p className="text-lg font-bold text-gray-800">Rs {t.fixedCharge}</p>
                      <p className="text-xs text-gray-400">monthly</p>
                    </div>
                  </div>

                  {/* Last updated */}
                  <p className="text-xs text-gray-400 mt-3">
                    Updated: {new Date(t.updatedAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── Modals ─── */}
      {showForm && (
        <TariffForm
          tariff={editTarget}
          nextBlock={nextBlockName}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteTarget.blockName}"? Users in this range will have no matching tariff.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
