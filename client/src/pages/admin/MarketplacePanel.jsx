import { useState, useEffect, useCallback } from 'react'
import { marketplaceAPI } from '../../api/api'
import {
  ShoppingBag, ArrowLeftRight, Search, RefreshCw,
  Package, CheckCircle, XCircle, Clock, Loader2,
  Tag, BarChart3, TrendingUp, Users
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────
const ITEM_STATUS_META = {
  available: { label: 'Available', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  reserved: { label: 'Reserved', color: 'text-amber-600', bg: 'bg-amber-100' },
  completed: { label: 'Completed', color: 'text-gray-500', bg: 'bg-gray-100' },
}

const TXN_STATUS_META = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100' },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  rejected: { label: 'Rejected', color: 'text-red-500', bg: 'bg-red-100' },
  approved: { label: 'Approved', color: 'text-blue-600', bg: 'bg-blue-100' },
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className={`${bg} rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color.replace('text', 'bg').replace('-600', '-100').replace('-500', '-100')}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        <p className="text-gray-500 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ─── Loading Spinner ─────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function Empty({ icon: Icon, text }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-300" />
      </div>
      <p className="text-gray-400 text-sm">{text}</p>
    </div>
  )
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
export default function MarketplacePanel() {
  const [tab, setTab] = useState('overview')
  const [items, setItems] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingTxns, setLoadingTxns] = useState(true)
  const [itemSearch, setItemSearch] = useState('')
  const [txnSearch, setTxnSearch] = useState('')
  const [txnFilter, setTxnFilter] = useState('all')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadItems = useCallback(async () => {
    setLoadingItems(true)
    try {
      const res = await marketplaceAPI.adminGetAll()
      setItems(res.data.items || [])
    } catch {
      showToast('Failed to load items.', 'error')
    } finally {
      setLoadingItems(false)
    }
  }, [])

  const loadTransactions = useCallback(async () => {
    setLoadingTxns(true)
    try {
      const res = await marketplaceAPI.adminGetAllTransactions()
      setTransactions(res.data.transactions || [])
    } catch {
      showToast('Failed to load transactions.', 'error')
    } finally {
      setLoadingTxns(false)
    }
  }, [])

  useEffect(() => { loadItems(); loadTransactions() }, [loadItems, loadTransactions])

  // ─── Derived stats ──────────────────────────────────────────────────────────
  const totalItems = items.length
  const availableItems = items.filter(i => i.status === 'available').length
  const reservedItems = items.filter(i => i.status === 'reserved').length
  const completedItems = items.filter(i => i.status === 'completed').length
  const totalTxns = transactions.length
  const completedTxns = transactions.filter(t => t.status === 'completed').length
  const pendingTxns = transactions.filter(t => t.status === 'pending').length
  const rejectedTxns = transactions.filter(t => t.status === 'rejected').length

  // Unique sellers / buyers
  const uniqueSellers = new Set(items.map(i => i.ownerId?._id || i.ownerId)).size
  const uniqueBuyers = new Set(transactions.map(t => t.buyerId?._id || t.buyerId)).size

  // ─── Filtered lists ─────────────────────────────────────────────────────────
  const filteredItems = items.filter(i => {
    const q = itemSearch.toLowerCase()
    return !q ||
      i.title?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q) ||
      i.ownerId?.name?.toLowerCase().includes(q)
  })

  const filteredTxns = transactions
    .filter(t => txnFilter === 'all' || t.status === txnFilter)
    .filter(t => {
      const q = txnSearch.toLowerCase()
      return !q ||
        t.itemId?.title?.toLowerCase().includes(q) ||
        t.buyerId?.name?.toLowerCase().includes(q) ||
        t.sellerId?.name?.toLowerCase().includes(q)
    })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'items', label: `Items (${totalItems})`, icon: Package },
    { id: 'transactions', label: `Transactions (${totalTxns})`, icon: ArrowLeftRight },
  ]

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
            <ShoppingBag className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Marketplace Management</h2>
            <p className="text-gray-400 text-xs">Monitor all listings, requests and transactions</p>
          </div>
        </div>
        <button
          onClick={() => { loadItems(); loadTransactions() }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-500 text-sm hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm mb-6 w-fit">
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ══ OVERVIEW TAB ══ */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Item Stats */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Listings Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Listings" value={totalItems} icon={ShoppingBag} color="text-indigo-600" bg="bg-indigo-50" />
              <StatCard label="Available" value={availableItems} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
              <StatCard label="Reserved" value={reservedItems} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
              <StatCard label="Completed" value={completedItems} icon={Package} color="text-gray-500" bg="bg-gray-100" />
            </div>
          </div>

          {/* Transaction Stats */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Transaction Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Transactions" value={totalTxns} icon={ArrowLeftRight} color="text-indigo-600" bg="bg-indigo-50" />
              <StatCard label="Completed" value={completedTxns} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
              <StatCard label="Pending" value={pendingTxns} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
              <StatCard label="Rejected" value={rejectedTxns} icon={XCircle} color="text-red-500" bg="bg-red-50" />
            </div>
          </div>

          {/* Community Stats */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Community Activity</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard label="Active Sellers" value={uniqueSellers} icon={Users} color="text-purple-600" bg="bg-purple-50" />
              <StatCard label="Active Buyers" value={uniqueBuyers} icon={TrendingUp} color="text-pink-600" bg="bg-pink-50" />
              <StatCard label="Green Points Awarded" value={completedTxns * 15} icon={Tag} color="text-emerald-600" bg="bg-emerald-50" />
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Recent Transactions</h3>
            {loadingTxns ? <Spinner /> : transactions.length === 0 ? (
              <Empty icon={ArrowLeftRight} text="No transactions yet." />
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Item', 'Buyer', 'Seller', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {transactions.slice(0, 8).map(t => {
                      const sm = TXN_STATUS_META[t.status] || TXN_STATUS_META.pending
                      return (
                        <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {t.itemId?.imageUrl ? (
                                <img src={t.itemId.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                              ) : (
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                  <Package className="w-4 h-4 text-gray-300" />
                                </div>
                              )}
                              <span className="font-medium text-gray-800 truncate max-w-[140px]">
                                {t.itemId?.title || '—'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{t.buyerId?.name || '—'}</td>
                          <td className="px-4 py-3 text-gray-600">{t.sellerId?.name || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${sm.bg} ${sm.color}`}>{sm.label}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(t.createdAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {transactions.length > 8 && (
                  <div className="px-4 py-3 border-t border-gray-50 text-center">
                    <button onClick={() => setTab('transactions')} className="text-indigo-500 text-xs font-semibold hover:underline">
                      View all {transactions.length} transactions →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ ITEMS TAB ══ */}
      {tab === 'items' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, category or seller..."
              value={itemSearch}
              onChange={e => setItemSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
            />
          </div>

          {loadingItems ? <Spinner /> : filteredItems.length === 0 ? (
            <Empty icon={Package} text="No listings found." />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Item', 'Category', 'Condition', 'Type', 'Status', 'Seller', 'Listed'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredItems.map(item => {
                    const sm = ITEM_STATUS_META[item.status] || ITEM_STATUS_META.available
                    return (
                      <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                <Package className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                            <span className="font-semibold text-gray-800 truncate max-w-[160px]">{item.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{item.category}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.condition === 'New' ? 'bg-emerald-100 text-emerald-700' :
                              item.condition === 'Good' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                            }`}>
                            {item.condition}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {item.listingType === 'Free' ? '🎁 Free' : '🔄 Trade'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${sm.bg} ${sm.color}`}>{sm.label}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{item.ownerId?.name || '—'}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══ TRANSACTIONS TAB ══ */}
      {tab === 'transactions' && (
        <div className="space-y-4">
          {/* Search + filter row */}
          <div className="flex flex-wrap gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by item, buyer or seller..."
                value={txnSearch}
                onChange={e => setTxnSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'completed', 'rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setTxnFilter(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${txnFilter === s
                      ? 'bg-indigo-500 text-white border-indigo-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loadingTxns ? <Spinner /> : filteredTxns.length === 0 ? (
            <Empty icon={ArrowLeftRight} text="No transactions found." />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Item', 'Buyer', 'Seller', 'Status', 'Date', 'Completed'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTxns.map(t => {
                    const sm = TXN_STATUS_META[t.status] || TXN_STATUS_META.pending
                    return (
                      <tr key={t._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {t.itemId?.imageUrl ? (
                              <img src={t.itemId.imageUrl} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                            ) : (
                              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800 truncate max-w-[130px]">{t.itemId?.title || '—'}</p>
                              {t.itemId?.listingType && (
                                <p className="text-xs text-gray-400">{t.itemId.listingType === 'Free' ? '🎁 Free' : '🔄 Trade'}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700 font-medium">{t.buyerId?.name || '—'}</p>
                          <p className="text-gray-400 text-xs">{t.buyerId?.email || ''}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700 font-medium">{t.sellerId?.name || '—'}</p>
                          <p className="text-gray-400 text-xs">{t.sellerId?.email || ''}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${sm.bg} ${sm.color}`}>{sm.label}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(t.createdAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {t.completedAt
                            ? new Date(t.completedAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-gray-50">
                <p className="text-xs text-gray-400">
                  Showing {filteredTxns.length} of {transactions.length} transactions
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
