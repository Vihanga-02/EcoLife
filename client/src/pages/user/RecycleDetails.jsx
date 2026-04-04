import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, Clock, Package, Recycle, XCircle, Loader2, Leaf, BarChart2 } from 'lucide-react'
import { recyclingAPI } from '../../api/api'
import { useAuth } from '../../context/AuthContext'



return (
    <div className="p-5 md:p-6 max-w-5xl mx-auto space-y-6 min-h-screen">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          <Recycle className="w-6 h-6 text-green-600" /> My Recycling
        </h2>
        <p className="text-gray-500 text-sm mt-1">Track your green drop-offs and earned points</p>
      </div>

      

        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-200 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Pending Reviews</p>
            <p className="text-2xl font-black text-amber-700">{pending}</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-200 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Green Points (Recycling)</p>
            <p className="text-2xl font-black text-emerald-700">{Math.round(totalWeight * 3)} pts</p>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Recent Drop-off Requests</h3>
          <button onClick={fetchSubmissions} disabled={loading} className="text-green-600 text-xs font-semibold flex items-center gap-1 hover:bg-green-50 px-2 py-1 rounded">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Recycle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-900">No requests found</p>
            <p className="text-xs">Find a center on the Recycling map to start.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-bold text-gray-500">Center</th>
                <th className="px-5 py-3 text-left font-bold text-gray-500">Material</th>
                <th className="px-5 py-3 text-left font-bold text-gray-500">Weight</th>
                <th className="px-5 py-3 text-left font-bold text-gray-500">Submitted</th>
                <th className="px-5 py-3 text-right font-bold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {submissions.map(sub => {
                const meta = STATUS_META[sub.status] || STATUS_META.pending
                const Icon = meta.icon
                return (
                  <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{sub.centerId?.name || 'Unknown Center'}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{sub.centerId?.address || ''}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-medium">{sub.materialType}</td>
                    <td className="px-5 py-4 text-gray-700">{sub.estimatedWeight} kg</td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {new Date(sub.submittedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-bold ${meta.bg} ${meta.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {meta.label}
                        </span>
                      </div>
                      {sub.status === 'rejected' && sub.reviewNotes && (
                        <p className="text-[10px] text-red-400 mt-1 max-w-[150px] truncate ml-auto">{sub.reviewNotes}</p>
                      )}
                      {sub.status === 'approved' && (
                        <p className="text-[10px] text-green-500 mt-1 font-bold">+{Math.round(sub.estimatedWeight * 3)} pts</p>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>

  )
}

