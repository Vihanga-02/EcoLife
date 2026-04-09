import { useState, useEffect, useCallback, useMemo } from 'react'
import { Trash2, Loader2, FlaskConical, Search, AlertCircle, RefreshCw, BarChart3, Leaf, Recycle } from 'lucide-react'
import { wasteAPI } from '../../api/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'

const TYPE_META = {
  Plastic: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', bar: '#60a5fa', emoji: '🧴' },
  Paper: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', bar: '#fcd34d', emoji: '📄' },
  Glass: { color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', bar: '#22d3ee', emoji: '🍶' },
  Organic: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', bar: '#4ade80', emoji: '🌿' },
  'E-waste': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', bar: '#f87171', emoji: '🔌' },
}

const fmt = (n, d = 2) => parseFloat(n || 0).toFixed(d)

export default function WastePanel() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await wasteAPI.adminGetAll()
      setLogs(res.data.logs || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to map platform waste logs.')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  useEffect(() => {
    setShowAll(false)
  }, [search])

  // Process data for charts & stats 
  const stats = useMemo(() => {
    let carbonSum = 0
    let recyclableCt = 0
    let biodegradableCt = 0
    const typeAgg = { Plastic: 0, Paper: 0, Glass: 0, Organic: 0, 'E-waste': 0 }

    logs.forEach(l => {
      carbonSum += l.carbonEquivalent || 0
      if (l.isRecyclable) recyclableCt++
      if (l.isBiodegradable) biodegradableCt++
      if (typeAgg[l.wasteType] !== undefined) {
        // Uniformly treating counts or kg as "units" visually for the high-level dashboard chart
        typeAgg[l.wasteType] += l.quantity || 0
      }
    })

    const chartData = Object.entries(typeAgg).map(([name, val]) => ({
      name, quantity: parseFloat(val.toFixed(2)), fill: TYPE_META[name]?.bar || '#9ca3af'
    }))

    return { totalLogs: logs.length, carbonSum, recyclableCt, biodegradableCt, chartData }
  }, [logs])

  // Filter Table Data
  const filteredLogs = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return logs
    return logs.filter(l =>
      l.userId?.name?.toLowerCase().includes(q) ||
      l.userId?.email?.toLowerCase().includes(q) ||
      l.wasteType?.toLowerCase().includes(q)
    )
  }, [logs, search])

  const visibleLogs = showAll ? filteredLogs : filteredLogs.slice(0, 8)

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-linear-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-md shrink-0">
            <Trash2 className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 leading-tight">Waste Analytics Database</h2>
            <p className="text-gray-400 text-xs">Monitor platform-wide waste entries & environmental impact</p>
          </div>
        </div>
        <button onClick={fetchLogs} disabled={loading} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50 w-full sm:w-fit">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} /> Refresh Data
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {loading && logs.length === 0 ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-14 h-14 bg-gray-50 text-gray-500 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100"><Trash2 className="w-6 h-6" /></div>
              <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Logs</p><p className="text-2xl font-black text-gray-800">{stats.totalLogs}</p></div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 border border-purple-100"><FlaskConical className="w-6 h-6" /></div>
              <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Carbon Saved</p><p className="text-2xl font-black text-purple-700">{fmt(stats.carbonSum, 1)} <span className="text-sm font-medium">kg CO₂</span></p></div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100"><Recycle className="w-6 h-6" /></div>
              <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recyclable Logs</p><p className="text-2xl font-black text-blue-700">{stats.recyclableCt}</p></div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0 border border-green-100"><Leaf className="w-6 h-6" /></div>
              <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Biodegradable</p><p className="text-2xl font-black text-green-700">{stats.biodegradableCt}</p></div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4 sm:mb-6">
              <BarChart3 className="w-4 h-4 text-orange-500 shrink-0" /> Aggregate Waste Quantities by Type
            </h3>
            <div className="h-[220px] sm:h-[250px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value) => [`${value} units`, 'Quantity']}
                  />
                  <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 items-stretch sm:items-center bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-800 shrink-0">Global Submission Logs</h3>
              <div className="relative w-full sm:max-w-xs min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text" placeholder="Search by user or type..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              {filteredLogs.length === 0 ? (
                <div className="p-10 text-center text-gray-400 text-sm">No waste logs matched your search.</div>
              ) : (
                <>
                  <table className="w-full text-sm">
                    <thead className="bg-white border-b border-gray-100">
                      <tr>
                        <th className="px-5 py-3.5 text-left font-bold text-gray-500 uppercase tracking-wider text-[11px]">User</th>
                        <th className="px-5 py-3.5 text-left font-bold text-gray-500 uppercase tracking-wider text-[11px]">Waste Entry</th>
                        <th className="px-5 py-3.5 text-left font-bold text-gray-500 uppercase tracking-wider text-[11px]">Footprint</th>
                        <th className="px-5 py-3.5 text-left font-bold text-gray-500 uppercase tracking-wider text-[11px]">Flags</th>
                        <th className="px-5 py-3.5 text-right font-bold text-gray-500 uppercase tracking-wider text-[11px]">Date Logged</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {visibleLogs.map(log => {
                        const m = TYPE_META[log.wasteType] || TYPE_META.Plastic
                        return (
                          <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-gray-900">{log.userId?.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-400">{log.userId?.email || 'N/A'}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="text-lg" title={log.wasteType}>{m.emoji}</span>
                                <div>
                                  <p className={`font-bold ${m.color}`}>{log.wasteType}</p>
                                  <p className="text-xs text-gray-500 font-medium">{log.quantity} {log.unit}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                                <FlaskConical className="w-3.5 h-3.5" />
                                {fmt(log.carbonEquivalent, 2)} kg
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex flex-col gap-1 w-max">
                                {log.isRecyclable && <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1"><Recycle className="w-3 h-3" /> Recyclable</span>}
                                {log.isBiodegradable && <span className="text-[10px] uppercase font-bold tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1"><Leaf className="w-3 h-3" /> Biodegradable</span>}
                                {!log.isRecyclable && !log.isBiodegradable && <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Standard</span>}
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-right whitespace-nowrap">
                              <span className="text-xs text-gray-500">
                                {new Date(log.date).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {filteredLogs.length > 10 && (
                    <div className="p-4 text-center border-t border-gray-100 bg-white">
                      <button
                        onClick={() => setShowAll(prev => !prev)}
                        className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                      >
                        {showAll ? 'Show less ↑' : `View all ${filteredLogs.length} logs →`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
