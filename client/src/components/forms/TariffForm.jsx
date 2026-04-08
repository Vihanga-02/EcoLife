import { useState, useEffect } from 'react'
import { X, Zap, Loader2, Info } from 'lucide-react'
import { energyAPI } from '../../api/api'

export default function TariffForm({ tariff = null, nextBlock = 'Block 1', onSuccess, onClose }) {
  const isEdit = Boolean(tariff)

  const [form, setForm] = useState({
    blockName: tariff?.blockName ?? nextBlock,
    minUnits: tariff?.minUnits ?? '',
    maxUnits: tariff?.maxUnits ?? '',
    unitRate: tariff?.unitRate ?? '',
    fixedCharge: tariff?.fixedCharge ?? '',
    isActive: tariff?.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setError('')
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.blockName.trim() || form.minUnits === '' || form.unitRate === '' || form.fixedCharge === '') {
      setError('Block name, min units, unit rate and fixed charge are required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = {
        blockName: form.blockName.trim(),
        minUnits: Number(form.minUnits),
        maxUnits: form.maxUnits !== '' ? Number(form.maxUnits) : null,
        unitRate: Number(form.unitRate),
        fixedCharge: Number(form.fixedCharge),
        isActive: form.isActive,
      }
      if (isEdit) {
        await energyAPI.updateTariff(tariff._id, payload)
      } else {
        await energyAPI.createTariff(payload)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save tariff.')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = 'number', placeholder, suffix, hint }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          min={type === 'number' ? '0' : undefined}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all pr-14"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1 ml-1">{hint}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[92dvh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-yellow-400 to-orange-500 px-4 sm:px-6 py-4 sm:py-5 flex items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-base sm:text-lg leading-tight">
                {isEdit ? 'Edit Tariff Block' : 'Add Tariff Block'}
              </h2>
              <p className="text-yellow-100 text-xs">Configure electricity pricing tier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="text-white w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Block Name - auto suggestion shown read-only in create mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Block Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="blockName"
              value={form.blockName}
              onChange={handleChange}
              placeholder="e.g. Block 1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
            {!isEdit && (
              <p className="text-xs text-yellow-600 mt-1 ml-1 flex items-center gap-1">
                <Info className="w-3 h-3" /> Auto-suggested based on existing blocks
              </p>
            )}
          </div>

          {/* Units range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Min Units" name="minUnits" placeholder="0" suffix="kWh" hint="Starting unit" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Units</label>
              <div className="relative">
                <input
                  type="number"
                  name="maxUnits"
                  value={form.maxUnits}
                  onChange={handleChange}
                  placeholder="Unlimited"
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all pr-14"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">kWh</span>
              </div>
              <p className="text-xs text-gray-400 mt-1 ml-1">Leave blank = unlimited</p>
            </div>
          </div>

          {/* Rate & Fixed charge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Unit Rate" name="unitRate" placeholder="0.00" suffix="Rs/kWh" />
            <Field label="Fixed Charge" name="fixedCharge" placeholder="0.00" suffix="Rs" />
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">Active block</span>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
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
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-yellow-400 to-orange-500 text-white rounded-xl text-sm font-medium hover:from-yellow-500 hover:to-orange-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Create Block'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
