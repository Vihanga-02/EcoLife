import { useState, useEffect, useRef } from 'react'
import { X, ShoppingBag, ChevronDown, Package} from 'lucide-react'

const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Tools', 'Toys', 'Sports', 'Other']
const CONDITIONS = ['New', 'Good', 'Fair']
const LISTING_TYPES = ['Free', 'Trade']

const CONDITION_META = {
  New:  { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Good: { color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
  Fair: { color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
}

/**
 * MarketItemForm — Add / Edit a marketplace listing.
 *
 * Props:
 *   item       – existing MarketItem document (null = create mode)
 *   onSuccess  – called after successful save
 *   onClose    – close modal
 */
export default function MarketItemForm({ item = null, onSuccess, onClose }) {
  const isEdit = Boolean(item)

  const [form, setForm] = useState({
    title:       item?.title       || '',
    description: item?.description || '',
    category:    item?.category    || 'Other',
    condition:   item?.condition   || 'Good',
    listingType: item?.listingType || 'Free',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Escape key closes modal
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleChange = (e) => {
    setError('')
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    // TODO: Implement API call
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">
                {isEdit ? 'Edit Listing' : 'New Listing'}
              </h2>
              <p className="text-indigo-100 text-xs">EcoLife Marketplace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="text-white w-4 h-4" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
        
        {/* Title */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    Title <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    name="title"
    value={form.title}
    onChange={handleChange}
    placeholder="e.g. Used Bicycle in Good Condition"
    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
  />
</div>

{/* Description */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    Description <span className="text-gray-400 text-xs font-normal">(optional)</span>
  </label>
  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    rows={2}
    placeholder="Describe your item — age, defects, reason for listing..."
    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
  />
</div>

{/* Category */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
  <div className="relative">
    <select
      name="category"
      value={form.category}
      onChange={handleChange}
      className="w-full appearance-none px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white pr-10"
    >
      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
</div>

{/* Condition + Listing type */}
<div className="grid grid-cols-2 gap-4">
  {/* Condition pills */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition</label>
    <div className="flex gap-1.5">
      {CONDITIONS.map(c => {
        const m = CONDITION_META[c]
        return (
          <button
            key={c}
            type="button"
            onClick={() => setForm(p => ({ ...p, condition: c }))}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${form.condition === c
              ? `${m.bg} ${m.color} ${m.border}`
              : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-indigo-300'
            }`}
          >
            {c}
          </button>
        )
      })}
    </div>
  </div>

  {/* Listing type pills */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">Listing Type</label>
    <div className="flex gap-1.5">
      {LISTING_TYPES.map(t => (
        <button
          key={t}
          type="button"
          onClick={() => setForm(p => ({ ...p, listingType: t }))}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${form.listingType === t
            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-indigo-300'
          }`}
        >
          {t === 'Free' ? '🎁 Free' : '🔄 Trade'}
        </button>
      ))}
    </div>
  </div>
</div>
          {/* Form fields will go here */}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">{error}</div>
          )}

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
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-60"
            >
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'List Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}