import { useState, useEffect, useRef } from 'react'
import { X, ShoppingBag } from 'lucide-react'

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