import { useState, useEffect, useRef } from 'react'
import { X, Trash2, Loader2, FlaskConical, ChevronDown, Camera, UploadCloud, CheckCircle } from 'lucide-react'
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

/**
 * WasteLogForm — Add / Edit a waste log entry with AI Auto-Detection.
 */
export default function WasteLogForm({ log = null, onSuccess, onClose }) {
  const isEdit = Boolean(log)

  const [form, setForm] = useState({
    wasteType: log?.wasteType || 'Plastic',
    quantity: log?.quantity || '',
    unit: log?.unit || 'kg',
    notes: log?.notes || '',
  })
  
  const [loading, setLoading] = useState(false)
  const [analyzingImage, setAnalyzingImage] = useState(false)
  const [error, setError] = useState('')
  const [aiSuccess, setAiSuccess] = useState('')
  
  const fileInputRef = useRef(null)

  // Escape key closes modal
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAnalyzingImage(true)
    setError('')
    setAiSuccess('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await wasteAPI.analyzeImage(formData)
      const detectedType = res.data?.data?.wasteType

      if (detectedType && WASTE_TYPES.includes(detectedType)) {
        setForm(p => ({ ...p, wasteType: detectedType }))
        setAiSuccess(`AI Detected: ${detectedType}! ✨`)
      } else {
        setError('AI could not confidently detect the waste type. Please select manually.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image.')
    } finally {
      setAnalyzingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[92dvh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-green-600 px-6 py-5 flex items-center justify-between shrink-0 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Trash2 className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                {isEdit ? 'Edit Waste Log' : 'Log Waste'}
              </h2>
              <p className="text-orange-100 text-xs">+2 Green Score on each new log</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X className="text-white w-4 h-4" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          {/* AI Auto-Detect Section */}
          {!isEdit && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-indigo-900">AI Auto-Detect</h3>
              </div>
              <p className="text-xs text-indigo-700/70 mb-3">Upload a photo of your waste, and our AI will automatically classify it for you!</p>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={analyzingImage}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white/50 hover:bg-white text-indigo-600 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                {analyzingImage ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Image...</>
                ) : (
                  <><UploadCloud className="w-4 h-4" /> Choose or Drop Photo</>
                )}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {aiSuccess && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                  <CheckCircle className="w-3.5 h-3.5" /> {aiSuccess}
                </div>
              )}
            </div>
          )}

          {/* Waste Type selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waste Type {isEdit ? '' : <span className="text-xs text-gray-400 font-normal ml-1">(or select manually)</span>}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {WASTE_TYPES.map(t => {
                const m = TYPE_META[t]
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setError(''); setAiSuccess(''); setForm(p => ({ ...p, wasteType: t })) }}
                    className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 text-xs font-medium transition-all ${form.wasteType === t
                        ? `border-green-500 shadow-sm ${m.bg} ${m.color}`
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-green-300'
                      }`}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <span className="truncate w-full text-center">{t}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number" min="0.01" step="0.01" value={form.quantity}
                onChange={e => { setError(''); setForm(p => ({ ...p, quantity: e.target.value })) }}
                placeholder="e.g. 2.5"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
              <div className="relative">
                <select
                  value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                  className="w-full appearance-none px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white pr-8"
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Carbon preview */}
          {carbonPreview !== null && (
            <div className={`flex items-center gap-2 ${meta.bg} ${meta.border} border rounded-xl px-4 py-2.5`}>
              <FlaskConical className={`w-4 h-4 ${meta.color} shrink-0`} />
              <span className={`text-xs font-medium ${meta.color}`}>
                Estimated carbon equivalent: ~{carbonPreview} kg CO₂e
              </span>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Notes <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <textarea
              value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Any additional details..." rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all resize-none"
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || analyzingImage} className="flex-1 px-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Log Waste'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
