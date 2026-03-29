import { useState, useEffect } from 'react'
import { X, Zap, Loader2, Info } from 'lucide-react'
import { energyAPI } from '../../api/api'

const CATEGORIES = ['Kitchen', 'Living', 'Bedroom', 'Other']

export default function ApplianceForm({ appliance = null, onSuccess, onClose }) {
  const isEdit = Boolean(appliance)
  const [form, setForm] = useState({
    name: appliance?.name || '',
    wattage: appliance?.wattage || '',
    category: appliance?.category || 'Other',
    noOfHoursForDay: appliance?.noOfHoursForDay ?? '',
    noOfDaysForMonth: appliance?.noOfDaysForMonth ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleChange = (e) => {
    setError('')
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Live estimated kWh preview
  const estimatedKwh =
    form.wattage && form.noOfHoursForDay && form.noOfDaysForMonth
      ? ((Number(form.wattage) / 1000) * Number(form.noOfHoursForDay) * Number(form.noOfDaysForMonth)).toFixed(3)
      : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.wattage) {
      setError('Name and wattage are required.')
      return
    }
    if (Number(form.wattage) <= 0) {
      setError('Wattage must be a positive number.')
      return
    }
    if (form.noOfHoursForDay !== '' && (Number(form.noOfHoursForDay) < 0 || Number(form.noOfHoursForDay) > 24)) {
      setError('Hours per day must be between 0 and 24.')
      return
    }
    if (form.noOfDaysForMonth !== '' && (Number(form.noOfDaysForMonth) < 0 || Number(form.noOfDaysForMonth) > 31)) {
      setError('Days per month must be between 0 and 31.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        wattage: Number(form.wattage),
        category: form.category,
        noOfHoursForDay: form.noOfHoursForDay !== '' ? Number(form.noOfHoursForDay) : 0,
        noOfDaysForMonth: form.noOfDaysForMonth !== '' ? Number(form.noOfDaysForMonth) : 0,
      }
      if (isEdit) {
        await energyAPI.updateAppliance(appliance._id, payload)
      } else {
        await energyAPI.addAppliance(payload)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save appliance.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                {isEdit ? 'Edit Appliance' : 'Add Appliance'}
              </h2>
              <p className="text-green-100 text-xs">Track your energy usage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="text-white w-4 h-4" />
          </button>
        </div>

        {/* Form — scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Appliance Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Samsung Refrigerator"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Wattage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Wattage (W) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="wattage"
                value={form.wattage}
                onChange={handleChange}
                placeholder="e.g. 150"
                min="1"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">W</span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setForm(prev => ({ ...prev, category: cat })); setError('') }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${form.category === cat
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-green-300'
                    }`}
                >
                  {cat === 'Kitchen' && '🍳 '}
                  {cat === 'Living' && '🛋️ '}
                  {cat === 'Bedroom' && '🛏️ '}
                  {cat === 'Other' && '⚡ '}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Usage schedule for estimated bill ─── */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">
                Set typical usage schedule to enable <strong>Estimated Bill</strong> calculation
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Hours per day */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hours / Day</label>
                <div className="relative">
                  <input
                    type="number"
                    name="noOfHoursForDay"
                    value={form.noOfHoursForDay}
                    onChange={handleChange}
                    placeholder="e.g. 8"
                    min="0"
                    max="24"
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">h</span>
                </div>
              </div>

              {/* Days per month */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Days / Month</label>
                <div className="relative">
                  <input
                    type="number"
                    name="noOfDaysForMonth"
                    value={form.noOfDaysForMonth}
                    onChange={handleChange}
                    placeholder="e.g. 30"
                    min="0"
                    max="31"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">d</span>
                </div>
              </div>
            </div>

            {/* Live preview */}
            {estimatedKwh !== null ? (
              <div className="bg-white rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Estimated monthly usage</span>
                <span className="text-sm font-bold text-amber-700">{estimatedKwh} kWh</span>
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center">Fill wattage + hours + days to see preview</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Add Appliance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
