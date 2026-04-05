import { useState, useEffect, useCallback } from 'react'
import {
  ShoppingBag, Plus, RefreshCw, CheckCircle, XCircle,
  Trash2, Loader2, Package, Tag,
  ArrowLeftRight, Clock, MessageSquare
} from 'lucide-react'
import { marketplaceAPI } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import MarketItemForm from '../../components/forms/MarketItemForm'

// ─── Constants ───────────────────────────────────────────────────────────────
const CONDITION_META = {
  New:  { color: 'text-green-700',  bg: 'bg-green-50',  dot: 'bg-green-500'  },
  Good: { color: 'text-blue-700',   bg: 'bg-blue-50',   dot: 'bg-blue-400'   },
  Fair: { color: 'text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-400' },
}

const STATUS_META = {
  available: { label: 'Available', color: 'text-green-700',  bg: 'bg-green-50'  },
  reserved:  { label: 'Reserved',  color: 'text-yellow-700', bg: 'bg-yellow-50' },
  completed: { label: 'Completed', color: 'text-gray-500',   bg: 'bg-gray-100'  },
}

const TXN_STATUS = {
  pending:   { label: 'Pending',   color: 'text-yellow-700', bg: 'bg-yellow-50' },
  completed: { label: 'Completed', color: 'text-green-700',  bg: 'bg-green-50'  },
  rejected:  { label: 'Rejected',  color: 'text-red-600',    bg: 'bg-red-50'    },
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
function ConfirmDialog({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full border border-gray-200">
        <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Trash2 className="text-red-500 w-4 h-4" />
        </div>
        <h3 className="font-bold text-gray-900 text-center mb-1 text-sm">Delete Listing?</h3>
        <p className="text-xs text-gray-500 text-center mb-5">
          <span className="font-semibold text-gray-700">"{title}"</span> will be permanently removed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Item Card ───────────────────────────────────────────────────────────────
function ItemCard({ item, onEdit, onDelete }) {
  const sm = STATUS_META[item.status] || STATUS_META.available
  const cm = CONDITION_META[item.condition] || CONDITION_META.Good

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-400 hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative h-40 bg-gray-50 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
            <Package className="w-8 h-8 text-gray-300" />
            <span className="text-[10px] text-gray-300">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide ${sm.bg} ${sm.color}`}>
            {sm.label}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-gray-800 text-white uppercase tracking-wide">
            {item.listingType === 'Free' ? 'Free' : 'Trade'}
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(item)}
            className="w-7 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:text-green-600 hover:border-green-300 transition-colors text-xs"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item)}
            className="w-7 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="font-semibold text-gray-900 text-sm truncate mb-2">{item.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-gray-400" />
            <span className="text-[11px] text-gray-400">{item.category}</span>
          </div>
          <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${cm.bg} ${cm.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cm.dot}`} />
            {item.condition}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-2 border-t border-gray-100 pt-2">
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
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-green-300 transition-colors">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center">
        {txn.itemId?.imageUrl
          ? <img src={txn.itemId.imageUrl} alt="" className="w-full h-full object-cover" />
          : <Package className="w-5 h-5 text-gray-300" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{txn.itemId?.title || 'Unknown item'}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {isIncoming
            ? <>Requested by <span className="font-semibold text-gray-700">{txn.buyerId?.name || 'Unknown'}</span></>
            : <>Seller: <span className="font-semibold text-gray-700">{txn.sellerId?.name || 'Unknown'}</span></>
          }
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${sm.bg} ${sm.color}`}>
            {sm.label}
          </span>
          {txn.itemId?.listingType && (
            <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {txn.itemId.listingType}
            </span>
          )}
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            onClick={() => onReject(txn._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      )}
      {!isIncoming && txn.status === 'completed' && (
        <div className="flex items-center gap-1 text-green-600 shrink-0 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100">
          <CheckCircle className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">+5 pts</span>
        </div>
      )}
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-xl p-14 text-center">
      <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-gray-300" />
      </div>
      <h3 className="text-gray-800 font-semibold text-sm mb-1">{title}</h3>
      <p className="text-gray-400 text-xs max-w-xs mx-auto mb-4">{description}</p>
      {action}
    </div>
  )
}

// ─── Main MarketPage ─────────────────────────────────────────────────────────
export default function MarketPage() {
  const { user, refreshUser } = useAuth()
  const [tab,          setTab]          = useState('listings')
  const [items,        setItems]        = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [txnLoading,   setTxnLoading]   = useState(true)
  const [showForm,     setShowForm]     = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast,        setToast]        = useState(null)

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
      showToast(action === 'approve' ? 'Request approved! +10 Green pts' : 'Request rejected.')
      loadItems(); loadTxns()
      if (action === 'approve') await refreshUser()
    } catch { showToast('Action failed.', 'error') }
  }

  const incoming = transactions.filter(t => t.sellerId?._id === user?._id || t.sellerId === user?._id)
  const outgoing  = transactions.filter(t => t.buyerId?._id  === user?._id || t.buyerId  === user?._id)
  const pendingCount = incoming.filter(t => t.status === 'pending').length

  const stats = [
    { label: 'Total',     value: items.length,                                       color: 'text-gray-800'   },
    { label: 'Available', value: items.filter(i => i.status === 'available').length, color: 'text-green-700'  },
    { label: 'Reserved',  value: items.filter(i => i.status === 'reserved').length,  color: 'text-yellow-700' },
    { label: 'Completed', value: items.filter(i => i.status === 'completed').length, color: 'text-gray-500'   },
  ]

  const TABS = [
    { id: 'listings',     label: 'My Listings',  count: items.length,    icon: Package       },
    { id: 'requests',     label: 'Requests',      count: pendingCount,    icon: MessageSquare },
    { id: 'transactions', label: 'My Requests',   count: outgoing.length, icon: ArrowLeftRight },
  ]

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-xs font-semibold flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-700'
        }`}>
          {toast.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-5 pt-6 pb-0">

          {/* Title row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-white w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">My Marketplace</h1>
                <p className="text-gray-400 text-[11px]">Manage your listings & trade requests</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { loadItems(); loadTxns() }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-xs font-medium transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
              <button
                onClick={() => { setEditTarget(null); setShowForm(true) }}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> New Listing
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0">
            {TABS.map(t => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all -mb-px ${
                    active
                      ? 'border-green-600 text-green-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  {t.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {t.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-5 py-6 space-y-5">

        {/* ── LISTINGS TAB ── */}
        {tab === 'listings' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              {stats.map(s => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No listings yet"
                description="List items you no longer need. Give them a second life and earn green points!"
                action={
                  <button
                    onClick={() => { setEditTarget(null); setShowForm(true) }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create First Listing
                  </button>
                }
              />
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
                {/* Add card */}
                <button
                  onClick={() => { setEditTarget(null); setShowForm(true) }}
                  className="bg-white border border-dashed border-gray-200 hover:border-green-400 hover:bg-green-50/30 rounded-xl flex flex-col items-center justify-center gap-2.5 text-gray-400 hover:text-green-600 transition-all min-h-[200px]"
                >
                  <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Add Listing</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ── REQUESTS TAB ── */}
        {tab === 'requests' && (
          <>
            {txnLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
              </div>
            ) : incoming.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No incoming requests"
                description="When someone requests one of your listings, it will appear here."
              />
            ) : (
              <div className="space-y-3">
                {incoming.map(t => (
                  <TxnRow
                    key={t._id}
                    txn={t}
                    isIncoming
                    onApprove={(id) => handleReview(id, 'approve')}
                    onReject={(id) => handleReview(id, 'reject')}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── MY REQUESTS TAB ── */}
        {tab === 'transactions' && (
          <>
            {txnLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
              </div>
            ) : outgoing.length === 0 ? (
              <EmptyState
                icon={ArrowLeftRight}
                title="No requests made yet"
                description="Browse the marketplace and request items you need."
              />
            ) : (
              <div className="space-y-3">
                {outgoing.map(t => (
                  <TxnRow key={t._id} txn={t} isIncoming={false} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <MarketItemForm
          item={editTarget}
          onSuccess={() => {
            setShowForm(false)
            setEditTarget(null)
            showToast(editTarget ? 'Listing updated!' : 'Item listed successfully!')
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