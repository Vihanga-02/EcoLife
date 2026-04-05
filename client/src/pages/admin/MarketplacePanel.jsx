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
  reserved:  { label: 'Reserved',  color: 'text-amber-600',   bg: 'bg-amber-100'   },
  completed: { label: 'Completed', color: 'text-gray-500',    bg: 'bg-gray-100'    },
}

const TXN_STATUS_META = {
  pending:   { label: 'Pending',   color: 'text-amber-600',   bg: 'bg-amber-100'   },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  rejected:  { label: 'Rejected',  color: 'text-red-500',     bg: 'bg-red-100'     },
  approved:  { label: 'Approved',  color: 'text-blue-600',    bg: 'bg-blue-100'    },
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
export default function MarketplacePanel() {
  const [tab, setTab] = useState('overview')
  const [items, setItems] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [loadingTxns, setLoadingTxns] = useState(true)
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

  const tabs = [
    { id: 'overview',      label: 'Overview',      icon: BarChart3    },
    { id: 'items',         label: 'Items',         icon: Package      },
    { id: 'transactions',  label: 'Transactions',  icon: ArrowLeftRight },
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
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
    </div>
  )
}