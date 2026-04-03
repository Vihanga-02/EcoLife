import { useState, useEffect } from 'react'
import {
  X, Trash2, Loader2, FlaskConical, ChevronDown
} from 'lucide-react'
import { wasteAPI } from '../../api/api'

const WASTE_TYPES = ['Plastic', 'Paper', 'Glass', 'Organic', 'E-waste']
const UNITS = ['kg', 'count']

const TYPE_META = {
  Plastic: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', emoji: '🧴' },
  Paper: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', emoji: '📄' },
  Glass: { color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', emoji: '🍶' },
  Organic: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', emoji: '🌿' },
  'E-waste': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', emoji: '🔌' },
}

const CARBON_FACTORS = { Plastic: 2.0, Paper: 1.0, Glass: 0.5, Organic: 0.3, 'E-waste': 20.0 }
const fmt = (n, d = 2) => parseFloat(n || 0).toFixed(d)

export default function WasteLogForm({ log = null, onSuccess, onClose }) {
  const isEdit = Boolean(log)

  const [form, setForm] = useState({
    wasteType: log?.wasteType || 'Plastic',
    quantity: log?.quantity || '',
    unit: log?.unit || 'kg',
    notes: log?.notes || '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.quantity || Number(form.quantity) <= 0) {
      setError('Quantity must be greater than 0.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const payload = {
        wasteType: form.wasteType,
        quantity: Number(form.quantity),
        unit: form.unit,
        notes: form.notes,
      }

      isEdit
        ? await wasteAPI.updateLog(log._id, payload)
        : await wasteAPI.logWaste(payload)

      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save log.')
    } finally {
      setLoading(false)
    }
  }

  const meta = TYPE_META[form.wasteType]
  const carbonPreview = form.quantity > 0
    ? fmt(Number(form.quantity) * (CARBON_FACTORS[form.wasteType] || 1.0))
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-5 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">
            {isEdit ? 'Edit Waste Log' : 'Log Waste'}
          </h2>
          <button onClick={onClose}>
            <X className="text-white w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Waste Type */}
          <div className="grid grid-cols-5 gap-2">
            {WASTE_TYPES.map(t => {
              const m = TYPE_META[t]
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, wasteType: t }))}
                  className={`${form.wasteType === t ? 'border-orange-500' : 'border-gray-200'} border rounded-xl`}
                >
                  {m.emoji}
                </button>
              )
            })}
          </div>

          {/* Quantity */}
          <input
            type="number"
            value={form.quantity}
            onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
            className="w-full border p-2 rounded"
          />

          {/* Unit */}
          <select
            value={form.unit}
            onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
          >
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>

          {/* Carbon Preview */}
          {carbonPreview && (
            <div className={`${meta.bg} p-2 rounded`}>
              <FlaskConical /> {carbonPreview} kg CO₂e
            </div>
          )}

          {/* Notes */}
          <textarea
            value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          />

          {error && <div className="text-red-500">{error}</div>}

          <button disabled={loading} className="bg-orange-500 text-white px-4 py-2 rounded">
            {loading ? <Loader2 className="animate-spin" /> : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}