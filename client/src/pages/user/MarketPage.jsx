import { useState, useEffect, useCallback } from 'react'
import {
  ShoppingBag, Plus, RefreshCw, CheckCircle, XCircle,
  Trash2, X, Loader2, Package, Tag,
  ArrowLeftRight, Clock, Star, MessageSquare, ChevronDown
} from 'lucide-react'
import { marketplaceAPI } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import MarketItemForm from '../../components/forms/MarketItemForm'

// ─── Constants ──────────────────────────────────────────────────────────────
const CONDITION_META = {
  New: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Good: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  Fair: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
}

const STATUS_META = {
  available: { label: 'Available', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  reserved: { label: 'Reserved', color: 'text-amber-600', bg: 'bg-amber-50' },
  completed: { label: 'Completed', color: 'text-gray-500', bg: 'bg-gray-100' },
}

const TXN_STATUS = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50' },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  rejected: { label: 'Rejected', color: 'text-red-500', bg: 'bg-red-50' },
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
function ConfirmDialog({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="text-red-500 w-5 h-5" />
        </div>
        <h3 className="font-bold text-black text-center mb-1">Delete Listing?</h3>
        <p className="text-sm text-gray-500 text-center mb-5">
          <span className="font-semibold text-gray-700">"{title}"</span> will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ─── Item Card (My Listings) ─────────────────────────────────────────────────
function ItemCard({ item, onEdit, onDelete }) {
  const sm = STATUS_META[item.status] || STATUS_META.available
  const cm = CONDITION_META[item.condition] || CONDITION_META.Good
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
        )}
        {/* Status + type badges */}
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${sm.bg} ${sm.color}`}>{sm.label}</span>
          <span className="text-xs px-2 py-1 rounded-full font-bold bg-white text-gray-600 shadow-sm">
            {item.listingType === 'Free' ? '🎁 Free' : '🔄 Trade'}
          </span>
        </div>
        {/* Edit / Delete overlay */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center text-gray-500 hover:text-blue-500 transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item)}
            className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm truncate mb-1">{item.title}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Tag className="w-3 h-3" />{item.category}
          </span>
          <span className="text-xs text-gray-300">·</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cm.bg} ${cm.color}`}>{item.condition}</span>
        </div>
        <p className="text-gray-400 text-xs mt-1.5">
          Listed {new Date(item.createdAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

// ─── Transaction Row ─────────────────────────────────────────────────────────
function TxnRow({ txn, isIncoming, onApprove, onReject }) {
  const sm = TXN_STATUS[txn.status] || TXN_STATUS.pending
  const isPending = txn.status === 'pending'
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
      {txn.itemId?.imageUrl && (
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
          <img src={txn.itemId.imageUrl} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {!txn.itemId?.imageUrl && (
        <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center">
          <Package className="w-6 h-6 text-gray-300" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm truncate">{txn.itemId?.title || 'Unknown item'}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {isIncoming
            ? <>Requested by <span className="font-semibold text-gray-700">{txn.buyerId?.name || 'Unknown'}</span></>
            : <>From <span className="font-semibold text-gray-700">{txn.sellerId?.name || 'Unknown'}</span></>
          }
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${sm.bg} ${sm.color}`}>{sm.label}</span>
          {txn.itemId?.listingType && (
            <span className="text-xs text-gray-400">{txn.itemId.listingType === 'Free' ? '🎁 Free' : '🔄 Trade'}</span>
          )}
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(txn.createdAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short' })}
          </span>
        </div>
      </div>
      {/* Actions */}
      {isIncoming && isPending && (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onApprove(txn._id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            onClick={() => onReject(txn._id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl text-xs font-semibold transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      )}
      {!isIncoming && txn.status === 'completed' && (
        <div className="flex items-center gap-1 text-emerald-600 shrink-0">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-bold">+5 pts</span>
        </div>
      )}
    </div>
  )
}

// ─── Main MarketPage ─────────────────────────────────────────────────────────
export default function MarketPage() {
  const { user, refreshUser } = useAuth()
  const [tab, setTab] = useState('listings')
  const [items, setItems] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [txnLoading, setTxnLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }

  const loadItems = useCallback(async () => {
    setLoading(true)
    try { setItems((await marketplaceAPI.getMyItems()).data.items || []) }
    catch { showToast('Failed to load listings.', 'error') }
    finally { setLoading(false) }
  }, [])

  const loadTxns = useCallback(async () => {
    setTxnLoading(true)
    try { setTransactions((await marketplaceAPI.getMyTransactions()).data.transactions || []) }
    catch { /* silent */ }
    finally { setTxnLoading(false) }
  }, [])

  useEffect(() => { loadItems(); loadTxns() }, [loadItems, loadTxns])

  const handleDelete = async () => {
    try {
      await marketplaceAPI.deleteItem(deleteTarget._id)
      showToast(`"${deleteTarget.title}" removed.`)
      setDeleteTarget(null); loadItems()
    } catch { showToast('Delete failed.', 'error'); setDeleteTarget(null) }
  }

  const handleReview = async (txnId, action) => {
    try {
      await marketplaceAPI.reviewTransaction(txnId, action)
      showToast(action === 'approve' ? 'Request approved! +10 Green pts 🌿' : 'Request rejected.')
      loadItems(); loadTxns()
      if (action === 'approve') await refreshUser()  // sync green score in sidebar/profile
    } catch { showToast('Action failed.', 'error') }
  }

  // Split transactions
  const incoming = transactions.filter(t => t.sellerId?._id === user?._id || t.sellerId === user?._id)
  const outgoing = transactions.filter(t => t.buyerId?._id === user?._id || t.buyerId === user?._id)

  const pendingIncoming = incoming.filter(t => t.status === 'pending').length

  const stats = [
    { label: 'Total Listings', value: items.length, bg: 'bg-indigo-50', txt: 'text-indigo-700' },
    { label: 'Available', value: items.filter(i => i.status === 'available').length, bg: 'bg-emerald-50', txt: 'text-emerald-700' },
    { label: 'Reserved', value: items.filter(i => i.status === 'reserved').length, bg: 'bg-amber-50', txt: 'text-amber-700' },
    { label: 'Completed', value: items.filter(i => i.status === 'completed').length, bg: 'bg-gray-100', txt: 'text-gray-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium flex items-center gap-2 transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 pt-6 pb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                <ShoppingBag className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">My Marketplace</h1>
                <p className="text-gray-400 text-xs">Manage your EcoLife marketplace listings & requests</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { loadItems(); loadTxns() }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-sm transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
              <button
                onClick={() => { setEditTarget(null); setShowForm(true) }}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-sm font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> New Listing
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-gray-100">
            {[
              { id: 'listings', label: `My Listings`, count: items.length, icon: Package },
              { id: 'requests', label: `Requests`, count: pendingIncoming, icon: Star },
              { id: 'transactions', label: `My Requests`, count: outgoing.length, icon: ArrowLeftRight },
            ].map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all -mb-px ${tab === t.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {t.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === t.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                      {t.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-5">

        {/* ══ LISTINGS TAB ══ */}
        {tab === 'listings' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                  <p className={`text-2xl font-black ${s.txt}`}>{s.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-indigo-300" />
                </div>
                <h3 className="text-gray-800 font-bold text-lg mb-1">No listings yet</h3>
                <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
                  List items you no longer need. Give them a second life and earn green points!
                </p>
                <button
                  onClick={() => { setEditTarget(null); setShowForm(true) }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md mx-auto"
                >
                  <Plus className="w-4 h-4" /> Create First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onEdit={(i) => { setEditTarget(i); setShowForm(true) }}
                    onDelete={(i) => setDeleteTarget(i)}
                  />
                ))}
                {/* Ghost add card */}
                <button
                  onClick={() => { setEditTarget(null); setShowForm(true) }}
                  className="bg-white border-2 border-dashed border-gray-200 hover:border-indigo-300 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-indigo-600 transition-all min-h-[220px] group"
                >
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-indigo-50 rounded-2xl flex items-center justify-center transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold">New Listing</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ══ INCOMING REQUESTS TAB ══ */}
        {tab === 'requests' && (
          <div>
            {txnLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : incoming.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-800 font-bold">No incoming requests yet</h3>
                <p className="text-gray-400 text-sm mt-1">
                  When someone requests one of your listings, it will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incoming.map(t => (
                  <TxnRow
                    key={t._id}
                    txn={t}
                    isIncoming={true}
                    onApprove={(id) => handleReview(id, 'approve')}
                    onReject={(id) => handleReview(id, 'reject')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ MY REQUESTS TAB ══ */}
        {tab === 'transactions' && (
          <div>
            {txnLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : outgoing.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-14 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ArrowLeftRight className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-800 font-bold">No requests made yet</h3>
                <p className="text-gray-400 text-sm mt-1">Browse the marketplace and request items you need.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {outgoing.map(t => (
                  <TxnRow
                    key={t._id}
                    txn={t}
                    isIncoming={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <MarketItemForm
          item={editTarget}
          onSuccess={() => {
            setShowForm(false)
            setEditTarget(null)
            showToast(editTarget ? 'Listing updated! 🎉' : 'Item listed! 🌿')
            loadItems()
          }}
          onClose={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
