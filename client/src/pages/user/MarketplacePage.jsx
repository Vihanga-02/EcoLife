import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { marketplaceAPI } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import {
  Search, ShoppingBag, Tag, CheckCircle, XCircle,
  Loader2, Package, SlidersHorizontal, X,
  Leaf, ArrowRight, Heart, Info, PlusCircle
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Clothing', 'Books', 'Tools', 'Toys', 'Sports', 'Other']
const CONDITIONS = ['All', 'New', 'Good', 'Fair']

const CONDITION_META = {
  New: { color: 'text-green-800', bg: 'bg-green-100', dot: 'bg-green-500' },
  Good: { color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-400' },
  Fair: { color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-400' },
}

// ─── How It Works Modal ─────────────────────────────────────────────────────
function HowItWorksModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Info className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">How It Works</h3>
            <p className="text-gray-500 text-sm">Simple steps to start sharing</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Browse Items</h4>
              <p className="text-gray-500 text-sm">Explore free and tradeable items listed by your community members.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Send Request</h4>
              <p className="text-gray-500 text-sm">Found something you need? Click "Request Item" and the owner will be notified.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Owner Approves</h4>
              <p className="text-gray-500 text-sm">The item owner will review your request and approve or reject it.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Complete Exchange</h4>
              <p className="text-gray-500 text-sm">Once approved, arrange pickup or delivery and complete the exchange.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Earn Green Points</h4>
              <p className="text-gray-500 text-sm">Successfully completed transactions earn you Green Points! 🌿</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  )
}

// ─── Item Card ───────────────────────────────────────────────────────────────
function ItemCard({ item, onRequest, requesting }) {
  const cm = CONDITION_META[item.condition] || CONDITION_META.Good
  const seller = item.ownerId?.name || 'EcoUser'
  const isFree = item.listingType === 'Free'

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-400 hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Package className="w-10 h-10 text-gray-300" />
            <span className="text-xs text-gray-300 font-medium">No image</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`text-[11px] px-2 py-0.5 rounded font-bold tracking-wide uppercase ${isFree
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-white'
            }`}>
            {isFree ? 'Free' : 'Trade'}
          </span>
        </div>

      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Condition dot */}
        <div className={`inline-flex items-center gap-1.5 mb-2 self-start px-2 py-0.5 rounded-md text-[11px] font-semibold ${cm.bg} ${cm.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cm.dot}`} />
          {item.condition}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm truncate mb-1 leading-snug">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-3 leading-relaxed">{item.description}</p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mb-4 mt-auto">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] text-gray-400 font-medium">{item.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">{seller[0]?.toUpperCase()}</span>
            </div>
            <span className="text-[11px] text-gray-500 truncate max-w-[80px]">{seller}</span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onRequest(item)}
          disabled={requesting === item._id}
          className={`w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border
            ${requesting === item._id
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700 active:scale-95'
            }`}
        >
          {requesting === item._id
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Requesting...</>
            : <><ShoppingBag className="w-3.5 h-3.5" /> Request Item</>
          }
        </button>
      </div>
    </div>
  )
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 ${type === 'error' ? 'bg-red-600' : 'bg-green-700'
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
  const [requesting, setRequesting] = useState(null)
  const [toast, setToast] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)

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

  const filtered = items
    .filter(i => {
      if (user && (i.ownerId?._id === user._id || i.ownerId === user._id)) return false
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
      showToast(`Request sent for "${item.title}". The owner has been notified.`)
      setItems(prev => prev.filter(i => i._id !== item._id))
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send request. Please try again.', 'error')
    } finally {
      setRequesting(null)
    }
  }

  const handleListItem = () => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    navigate('/dashboard/market')
  }

  const activeFilters = (category !== 'All' ? 1 : 0) + (condition !== 'All' ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono&display=swap" rel="stylesheet" />
      <Navbar />

      {/* ── Hero ── */}
      <div className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex flex-col items-center text-center">
            {/* Left */}
            <div className="max-w-2xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Leaf className="w-4 h-4 text-green-300" />
                <span className="text-green-300 text-xs font-semibold uppercase tracking-widest">EcoLife Marketplace</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                Give Items a Second Life
              </h1>
              <p className="text-green-200 text-sm leading-relaxed">
                Browse free and tradeable items listed by your community. Reduce waste, earn green points, and help the planet — one item at a time.
              </p>
              <div className="flex gap-4 mt-8 justify-center">
                <button
                  onClick={() => setShowHowItWorks(true)}
                  className="bg-white text-green-700 hover:bg-green-50 transition-colors px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <Info className="w-4 h-4" /> How It Works
                </button>
                <button
                  onClick={handleListItem}
                  className="border-2 border-white text-white hover:bg-white hover:text-green-700 transition-colors px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> List an Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">

        {/* Toolbar */}
        <div className="flex gap-3 mb-6 flex-wrap items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-800 placeholder-gray-400 rounded-lg px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Condition filter */}
          <select
            value={condition}
            onChange={e => setCondition(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            {CONDITIONS.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Conditions' : c}</option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter(b => !b)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${showFilter || activeFilters > 0
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700'
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilters > 0 && (
              <span className="bg-white text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700">Filter by Category</p>
              {activeFilters > 0 && (
                <button
                  onClick={() => { setCategory('All'); setCondition('All') }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${category === c
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-700'
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results header */}
        {!loading && (
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">{filtered.length}</span> item{filtered.length !== 1 ? 's' : ''} available
              </span>
              {category !== 'All' && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  {category}
                  <button onClick={() => setCategory('All')} className="ml-1 hover:text-green-900">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
              {condition !== 'All' && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  {condition}
                  <button onClick={() => setCondition('All')} className="ml-1 hover:text-green-900">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
            </div>
            {!isAuthenticated() && (
              <button onClick={() => navigate('/login')} className="text-xs text-green-600 hover:underline font-medium">
                Sign in to request items →
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            <p className="text-gray-400 text-sm">Loading marketplace...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-semibold text-lg mb-1.5">No items found</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              {search || activeFilters > 0
                ? 'Try adjusting your search or filters to find more items.'
                : 'The marketplace is empty right now. Check back later!'}
            </p>
            {(search || activeFilters > 0) && (
              <button
                onClick={() => { setSearch(''); setCategory('All'); setCondition('All') }}
                className="mt-5 text-green-600 text-sm font-medium hover:underline"
              >
                Clear all filters
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