import { useState, useEffect, useCallback } from 'react'
import { MapPin, CheckCircle, Package, Plus, Search, Loader2, XCircle, Pencil, Trash2 } from 'lucide-react'
import { recyclingAPI } from '../../api/api'
import RecycleCenterForm from '../../components/forms/RecycleCenterForm'

const STATUS_META = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-100' },
  approved: { label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  rejected: { label: 'Rejected', color: 'text-red-500', bg: 'bg-red-100' }
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function Toast({ msg, type = 'success' }) {
  if (!msg) return null
  return (
    <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-5 sm:top-5 z-50 px-4 sm:px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium flex items-center gap-2 animate-fade-in ${type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
      {type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
      {msg}
    </div>
  )
}

export default function RecyclingPanel() {
  const [tab, setTab] = useState('centers') // 'centers' | 'submissions'
  const [centers, setCenters] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loadingCenters, setLoadingCenters] = useState(true)
  const [loadingSubs, setLoadingSubs] = useState(true)
  
  const [showCenterForm, setShowCenterForm] = useState(false)
  const [editCenterTarget, setEditCenterTarget] = useState(null)
  
  const [search, setSearch] = useState('')
  const [subFilter, setSubFilter] = useState('all')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadCenters = useCallback(async () => {
    setLoadingCenters(true)
    try {
      const res = await recyclingAPI.getCenters()
      setCenters(res.data.centers || [])
    } catch {
      showToast('Failed to load centers', 'error')
    } finally {
      setLoadingCenters(false)
    }
  }, [])

  const loadSubmissions = useCallback(async () => {
    setLoadingSubs(true)
    try {
      const res = await recyclingAPI.getAllSubmissions()
      setSubmissions(res.data.submissions || [])
    } catch {
      showToast('Failed to load submissions', 'error')
    } finally {
      setLoadingSubs(false)
    }
  }, [])

  useEffect(() => { loadCenters(); loadSubmissions() }, [loadCenters, loadSubmissions])

  const handleDeleteCenter = async (id) => {
    if (!window.confirm('Delete this recycling center?')) return
    try {
      await recyclingAPI.deleteCenter(id)
      showToast('Center deleted')
      loadCenters()
    } catch {
      showToast('Failed to delete center', 'error')
    }
  }

  const handleReviewStatus = async (id, status) => {
    try {
      await recyclingAPI.reviewSubmission(id, { status, reviewNotes: `Reviewed by admin on ${new Date().toLocaleDateString()}` })
      showToast(`Submission ${status} successfully`)
      loadSubmissions()
    } catch {
      showToast('Failed to review submission', 'error')
    }
  }

  const handleCenterFormSuccess = () => {
    setShowCenterForm(false)
    setEditCenterTarget(null)
    showToast(editCenterTarget ? 'Center updated' : 'Center created')
    loadCenters()
  }

  const filteredCenters = centers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.city.toLowerCase().includes(search.toLowerCase())
  )

  const filteredSubs = submissions.filter(s => {
    if (subFilter !== 'all' && s.status !== subFilter) return false
    const q = search.toLowerCase()
    if (!q) return true
    return s.userId?.name?.toLowerCase().includes(q) || s.centerId?.name?.toLowerCase().includes(q) || s.materialType.toLowerCase().includes(q)
  })

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <Toast msg={toast?.msg} type={toast?.type} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md shrink-0">
            <Package className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 leading-tight">Recycle Management</h2>
            <p className="text-gray-400 text-xs">Manage centers and user submissions</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {tab === 'centers' && (
            <button onClick={() => { setEditCenterTarget(null); setShowCenterForm(true) }} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all w-full sm:w-auto">
              <Plus className="w-4 h-4" /> Add Center
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 shadow-sm mb-6 w-full max-w-full overflow-x-auto md:overflow-x-visible">
        <button onClick={() => { setTab('centers'); setSearch('') }} className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${tab === 'centers' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
          <MapPin className="w-4 h-4 shrink-0" /> Centers ({centers.length})
        </button>
        <button onClick={() => { setTab('submissions'); setSearch('') }} className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${tab === 'submissions' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
          <Package className="w-4 h-4 shrink-0" /> Submissions ({submissions.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex flex-wrap gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder={tab === 'centers' ? 'Search centers...' : 'Search submissions...'} value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm" />
          </div>
          
          {tab === 'submissions' && (
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(s => (
                <button key={s} onClick={() => setSubFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${subFilter === s ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'}`}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Centers View */}
        {tab === 'centers' && (
          loadingCenters ? <Spinner /> : filteredCenters.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">No centers found.</div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto -mx-px">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-500">City / Address</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-500">Materials</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCenters.map(center => (
                    <tr key={center._id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{center.name}</td>
                      <td className="px-4 py-3 text-gray-600"><p>{center.city}</p><p className="text-xs text-gray-400 truncate max-w-[200px]">{center.address}</p></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {center.acceptMaterials?.slice(0, 3).map(m => <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{m}</span>)}
                          {center.acceptMaterials?.length > 3 && <span className="text-xs text-gray-400">+{center.acceptMaterials.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${center.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{center.isActive ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditCenterTarget(center); setShowCenterForm(true) }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteCenter(center._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )
        )}

        {/* Submissions View */}
        {tab === 'submissions' && (
          loadingSubs ? <Spinner /> : filteredSubs.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">No submissions found.</div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto -mx-px">
              <table className="w-full text-sm min-w-[720px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-500">User</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-500">Center</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-500">Material</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-500">Est. Weight</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-500">Status</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-500">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubs.map(sub => {
                    const sm = STATUS_META[sub.status] || STATUS_META.pending
                    return (
                      <tr key={sub._id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">{sub.userId?.name || '—'}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">{sub.userId?.email || ''}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 truncate max-w-[150px]">{sub.centerId?.name || '—'}</p>
                          <p className="text-xs text-gray-400">{sub.centerId?.city || ''}</p>
                        </td>
                        <td className="px-4 py-3 font-medium text-green-700">{sub.materialType}</td>
                        <td className="px-4 py-3 text-gray-700">{sub.estimatedWeight} kg</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${sm.bg} ${sm.color}`}>{sm.label}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {sub.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleReviewStatus(sub._id, 'approved')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors">Approve</button>
                              <button onClick={() => handleReviewStatus(sub._id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-xs font-bold transition-colors">Reject</button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>
            </div>
          )
        )}
      </div>

      {showCenterForm && (
        <RecycleCenterForm 
          center={editCenterTarget} 
          onClose={() => { setShowCenterForm(false); setEditCenterTarget(null) }} 
          onSuccess={handleCenterFormSuccess} 
        />
      )}
    </div>
  )
}
