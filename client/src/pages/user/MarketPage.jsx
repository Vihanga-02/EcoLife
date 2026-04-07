import { useState, useEffect, useCallback } from 'react'
import {
  ShoppingBag, Plus, RefreshCw, CheckCircle, XCircle,
  Trash2, Loader2, Package, Tag,
  ArrowLeftRight, Clock, MessageSquare, Pencil
} from 'lucide-react'
import { marketplaceAPI } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import MarketItemForm from '../../components/forms/MarketItemForm'

// ─── Constants ──────────────────────────────────────────────────────────────
const CONDITION_META = {
  New: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  Good: { color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
  Fair: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
}

const STATUS_META = {
  available: { label: 'Available', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  reserved: { label: 'Reserved', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  completed: { label: 'Completed', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
}

const TXN_STATUS = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  completed: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
function ConfirmDialog({ title, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <Trash2 className="h-5 w-5 text-red-500" />
        </div>

        <h3 className="mb-1 text-center text-lg font-bold text-gray-900">
          Delete Listing?
        </h3>

        <p className="mb-5 text-center text-sm text-gray-500">
          <span className="font-semibold text-gray-700">"{title}"</span> will be permanently removed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Item Card ──────────────────────────────────────────────────────────────
function ItemCard({ item, onEdit, onDelete }) {
  const sm = STATUS_META[item.status] || STATUS_META.available
  const cm = CONDITION_META[item.condition] || CONDITION_META.Good

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-10 w-10 text-gray-300" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${sm.bg} ${sm.color} ${sm.border}`}>
            {sm.label}
          </span>
          <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-600">
            {item.listingType === 'Free' ? 'Free' : 'Trade'}
          </span>
        </div>

        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            onClick={() => onEdit(item)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:text-emerald-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1 truncate text-sm font-bold text-gray-900">
          {item.title}
        </h3>

        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <Tag className="h-3.5 w-3.5" />
          <span>{item.category}</span>
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${cm.bg} ${cm.color} ${cm.border}`}>
            {item.condition}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {new Date(item.createdAt).toLocaleDateString('en-LK', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Transaction Row ────────────────────────────────────────────────────────
function TxnRow({ txn, isIncoming, onApprove, onReject }) {
  const sm = TXN_STATUS[txn.status] || TXN_STATUS.pending
  const isPending = txn.status === 'pending'

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {txn.itemId?.imageUrl ? (
          <img src={txn.itemId.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Package className="h-6 w-6 text-gray-300" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-gray-900">
          {txn.itemId?.title || 'Unknown item'}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {isIncoming ? (
            <>Requested by <span className="font-semibold text-gray-700">{txn.buyerId?.name || 'Unknown'}</span></>
          ) : (
            <>From <span className="font-semibold text-gray-700">{txn.sellerId?.name || 'Unknown'}</span></>
          )}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${sm.bg} ${sm.color} ${sm.border}`}>
            {sm.label}
          </span>

          {txn.itemId?.listingType && (
            <span className="text-xs text-gray-500">
              {txn.itemId.listingType === 'Free' ? 'Free' : 'Trade'}
            </span>
          )}

          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            {new Date(txn.createdAt).toLocaleDateString('en-LK', {
              day: '2-digit',
              month: 'short',
            })}
          </span>
        </div>
      </div>

      {isIncoming && isPending && (
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => onApprove(txn._id)}
            className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Approve
          </button>
          <button
            onClick={() => onReject(txn._id)}
            className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <XCircle className="h-3.5 w-3.5" />
            Reject
          </button>
        </div>
      )}

      {!isIncoming && txn.status === 'completed' && (
        <div className="shrink-0 text-xs font-bold text-emerald-700">
          Completed
        </div>
      )}
    </div>
  )
}

// ─── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, tone = 'default' }) {
  const toneMap = {
    primary: 'bg-sky-50 border-sky-200 text-sky-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    secondary: 'bg-violet-50 border-violet-200 text-violet-700',
  }

  return (
    <div className={`rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${toneMap[tone]}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm font-semibold text-gray-600">{label}</p>
    </div>
  )
}

// ─── Empty State ────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-14 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
        <Icon className="h-7 w-7 text-gray-300" />
      </div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ─── Main MarketPage ────────────────────────────────────────────────────────
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
    try {
      setItems((await marketplaceAPI.getMyItems()).data.items || [])
    } catch {
      showToast('Failed to load listings.', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTxns = useCallback(async () => {
    setTxnLoading(true)
    try {
      setTransactions((await marketplaceAPI.getMyTransactions()).data.transactions || [])
    } catch {
      //
    } finally {
      setTxnLoading(false)
    }
  }, [])

  useEffect(() => {
    loadItems()
    loadTxns()
  }, [loadItems, loadTxns])

  const handleDelete = async () => {
    try {
      await marketplaceAPI.deleteItem(deleteTarget._id)
      showToast(`"${deleteTarget.title}" removed.`)
      setDeleteTarget(null)
      loadItems()
    } catch {
      showToast('Delete failed.', 'error')
      setDeleteTarget(null)
    }
  }

  const handleReview = async (txnId, action) => {
    try {
      await marketplaceAPI.reviewTransaction(txnId, action)
      showToast(action === 'approve' ? 'Request approved! +10 Green pts 🌿' : 'Request rejected.')
      loadItems()
      loadTxns()
      if (action === 'approve') await refreshUser() // sync green score in sidebar/profile
    } catch {
      showToast('Action failed.', 'error')
    }
  }

  const incoming = transactions.filter(
    (t) => t.sellerId?._id === user?._id || t.sellerId === user?._id
  )
  const outgoing = transactions.filter(
    (t) => t.buyerId?._id === user?._id || t.buyerId === user?._id
  )

  const pendingIncoming = incoming.filter((t) => t.status === 'pending').length

  const stats = [
    { label: 'Total Listings', value: items.length, tone: 'primary' },
    { label: 'Available', value: items.filter((i) => i.status === 'available').length, tone: 'success' },
    { label: 'Reserved', value: items.filter((i) => i.status === 'reserved').length, tone: 'warning' },
    { label: 'Completed', value: items.filter((i) => i.status === 'completed').length, tone: 'secondary' },
  ]

  const tabs = [
    { id: 'listings', label: 'My Listings', count: items.length, icon: Package },
    { id: 'requests', label: 'Requests', count: pendingIncoming, icon: MessageSquare },
    { id: 'transactions', label: 'My Requests', count: outgoing.length, icon: ArrowLeftRight },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className={`fixed right-5 top-5 z-50 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-xl ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'
          }`}>
          {toast.type === 'error' ? (
            <XCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          {toast.msg}
        </div>
      )}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 shadow-sm">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>

              <h1 className="text-2xl font-black tracking-tight text-gray-900">
                My Marketplace
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your listings and track marketplace requests in one place.
              </p>
            </div>

            <div className="flex gap-2 self-start">
              <button
                onClick={() => {
                  loadItems()
                  loadTxns()
                }}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <button
                onClick={() => {
                  setEditTarget(null)
                  setShowForm(true)
                }}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                New Listing
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const Icon = t.icon
              const isActive = tab === t.id

              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${isActive
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                  {t.count > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
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

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {tab === 'listings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="No listings yet"
                description="List items you no longer need and make them available for others."
                action={
                  <button
                    onClick={() => {
                      setEditTarget(null)
                      setShowForm(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Listing
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    onEdit={(i) => {
                      setEditTarget(i)
                      setShowForm(true)
                    }}
                    onDelete={(i) => setDeleteTarget(i)}
                  />
                ))}

                <button
                  onClick={() => {
                    setEditTarget(null)
                    setShowForm(true)
                  }}
                  className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-white text-gray-400 transition hover:border-emerald-300 hover:text-emerald-600"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
                    <Plus className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold">New Listing</span>
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div>
            {txnLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : incoming.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No incoming requests yet"
                description="When someone requests one of your listings, it will appear here."
              />
            ) : (
              <div className="space-y-3">
                {incoming.map((t) => (
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

        {tab === 'transactions' && (
          <div>
            {txnLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            ) : outgoing.length === 0 ? (
              <EmptyState
                icon={ArrowLeftRight}
                title="No requests made yet"
                description="Your marketplace requests will appear here once you start requesting items."
              />
            ) : (
              <div className="space-y-3">
                {outgoing.map((t) => (
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

      {showForm && (
        <MarketItemForm
          item={editTarget}
          onSuccess={() => {
            setShowForm(false)
            setEditTarget(null)
            showToast(editTarget ? 'Listing updated successfully.' : 'Item listed successfully.')
            loadItems()
          }}
          onClose={() => {
            setShowForm(false)
            setEditTarget(null)
          }}
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