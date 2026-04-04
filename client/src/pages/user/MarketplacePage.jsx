import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { marketplaceAPI } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import {
  Search, ShoppingBag, Tag, CheckCircle, XCircle,
  Loader2, Package, Filter, SlidersHorizontal, X
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Clothing', 'Books', 'Tools', 'Toys', 'Sports', 'Other']
const CONDITIONS = ['All', 'New', 'Good', 'Fair']

const CONDITION_META = {
  New: { color: 'text-emerald-700', bg: 'bg-emerald-100' },
  Good: { color: 'text-blue-700', bg: 'bg-blue-100' },
  Fair: { color: 'text-amber-700', bg: 'bg-amber-100' },
}

// ─── Item Card ───────────────────────────────────────────────────────────────
function ItemCard({ item, onRequest, requesting }) {
  const cm = CONDITION_META[item.condition] || CONDITION_META.Good
  const seller = item.ownerId?.name || 'EcoUser'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-14 h-14 text-gray-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${item.listingType === 'Free'
              ? 'bg-emerald-500 text-white'
              : 'bg-indigo-500 text-white'
            }`}>
            {item.listingType === 'Free' ? '🎁 Free' : '🔄 Trade'}
          </span>
        </div>

        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cm.bg} ${cm.color}`}>
            {item.condition}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{item.title}</h3>
        {item.description && (
          <p className="text-gray-500 text-xs line-clamp-2 mb-2">{item.description}</p>
        )}

        <div className="flex items-center gap-1.5 mb-3">
          <Tag className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">{item.category}</span>
          <span className="text-gray-200 text-xs">·</span>
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">{seller[0]?.toUpperCase()}</span>
          </div>
          <span className="text-xs text-gray-500 truncate max-w-[100px]">{seller}</span>
        </div>

        {/* Request Button */}
        <button
          onClick={() => onRequest(item)}
          disabled={requesting === item._id}
          className={`mt-auto w-full py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
            ${requesting === item._id
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg active:scale-95'
            }`}
        >
          {requesting === item._id
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
            : <><ShoppingBag className="w-3.5 h-3.5" /> Request</>
          }
        </button>
      </div>
    </div>
  )
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium flex items-center gap-2 animate-fade-in ${type === 'error' ? 'bg-red-500' : 'bg-emerald-500'
      }`}>
      {type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
      {msg}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [condition, setCondition] = useState('All')
  const [requesting, setRequesting] = useState(null)   // item._id being requested
  const [toast, setToast] = useState(null)
  const [showFilter, setShowFilter] = useState(false)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await marketplaceAPI.getItems()
        setItems(res.data.items || [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  // Filter: exclude own items, apply search + category + condition
  const filtered = items
    .filter(i => {
      // Hide logged-in user's own listings
      if (user && (
        i.ownerId?._id === user._id ||
        i.ownerId === user._id
      )) return false
      return true
    })
    .filter(i => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        i.title?.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      const matchCat = category === 'All' || i.category === category
      const matchCond = condition === 'All' || i.condition === condition
      return matchSearch && matchCat && matchCond
    })

  const handleRequest = async (item) => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    setRequesting(item._id)
    try {
      await marketplaceAPI.claimItem(item._id)
      showToast(`Request sent for "${item.title}" 🌿`)
      // Remove item from list since it's now reserved
      setItems(prev => prev.filter(i => i._id !== item._id))
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send request.', 'error')
    } finally {
      setRequesting(null)
    }
  }

  const activeFilters = (category !== 'All' ? 1 : 0) + (condition !== 'All' ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <span className="text-indigo-200 text-sm font-semibold uppercase tracking-wider">EcoLife Marketplace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
              Give Items a <span className="text-yellow-300">Second Life</span>
            </h1>
            <p className="text-indigo-100 text-sm md:text-base leading-relaxed">
              Browse free and tradeable items listed by your community. Reduce waste, earn green points, and help the planet — one item at a time.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">

        {/* Search & Filter Bar */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter(b => !b)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all shadow-sm ${showFilter || activeFilters > 0
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="bg-white text-indigo-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${category === c
                          ? 'bg-indigo-500 text-white border-indigo-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              {/* Condition */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Condition</p>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map(c => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${condition === c
                          ? 'bg-indigo-500 text-white border-indigo-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {activeFilters > 0 && (
              <button
                onClick={() => { setCategory('All'); setCondition('All') }}
                className="mt-4 text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-800">{filtered.length}</span> item{filtered.length !== 1 ? 's' : ''}
              {search && <> for "<span className="font-semibold text-indigo-600">{search}</span>"</>}
            </p>
            {!isAuthenticated() && (
              <p className="text-xs text-gray-400 italic">
                <button onClick={() => navigate('/login')} className="text-indigo-500 underline font-medium">Sign in</button> to request items
              </p>
            )}
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
            <p className="text-gray-400 text-sm">Loading marketplace items...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-28">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-gray-700 font-bold text-lg mb-2">No items found</h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              {search || activeFilters > 0
                ? 'Try adjusting your search or filters.'
                : 'The marketplace is empty right now. Check back later!'}
            </p>
            {(search || activeFilters > 0) && (
              <button
                onClick={() => { setSearch(''); setCategory('All'); setCondition('All') }}
                className="mt-4 text-indigo-500 text-sm font-semibold hover:underline"
              >
                Clear search & filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(item => (
              <ItemCard
                key={item._id}
                item={item}
                onRequest={handleRequest}
                requesting={requesting}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
