import { useEffect, useMemo, useState } from 'react'
import { Users, Search } from 'lucide-react'
import { adminAPI } from '../../api/api'

export default function UsersPanel() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(u =>
      String(u?.name || '').toLowerCase().includes(q) ||
      String(u?.email || '').toLowerCase().includes(q)
    )
  }, [users, search])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await adminAPI.getUsers({ role: 'user', limit: 200 })
        setUsers(res.data.users || [])
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black">User Management</h2>
          <p className="text-gray-700 text-sm">View platform users (read-only)</p>
        </div>

        <div className="bg-white border border-green-300 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b border-green-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Users size={18} />
            <span className="text-sm font-medium">
              {loading ? 'Loading…' : `${filtered.length} user${filtered.length === 1 ? '' : 's'}`}
            </span>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full pl-9 pr-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 border-b border-red-200">
            {error}
          </div>
        )}

        <div className="divide-y divide-green-100">
          {loading ? (
            <div className="p-6 text-gray-600">Loading users…</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-gray-600">No users found.</div>
          ) : (
            filtered.map((u) => {
              const initial = (u?.name || 'U').charAt(0).toUpperCase()
              return (
                <div key={u._id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-green-100 border border-green-200 overflow-hidden flex items-center justify-center shrink-0 text-green-700 font-bold">
                      {u?.profileImage ? (
                        <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                      ) : (
                        initial
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-black font-semibold truncate">{u?.name}</p>
                      <p className="text-xs text-gray-600 truncate">{u?.email}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-800">
                          ⭐ {u?.greenScore || 0} pts
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                          u?.isActive ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-700'
                        }`}>
                          {u?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    Joined: {u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
