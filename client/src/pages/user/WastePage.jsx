import { useState, useEffect, useCallback } from 'react'
import { Trash2, FlaskConical, Recycle, Package } from 'lucide-react'
import { wasteAPI } from '../../api/api'

export default function WastePage() {
  const [logs, setLogs] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadWasteData = useCallback(async () => {
    setLoading(true)
    try {
      const [logsRes, analyticsRes] = await Promise.all([
        wasteAPI.getLogs(),
        wasteAPI.getAnalytics()
      ])

      setLogs(logsRes.data.logs || [])
      setAnalytics(analyticsRes.data || null)
    } catch (error) {
      console.error('Failed to load waste data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWasteData()
  }, [loadWasteData])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">Waste Tracker</h2>
        <p className="text-gray-700 text-sm">Log and analyse your waste generation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-green-300 rounded-xl p-4 text-center shadow-md">
          <div className="flex justify-center mb-2">
            <Package className="text-green-600 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {analytics?.totalLogs || 0}
          </p>
          <p className="text-gray-700 text-sm mt-1">Total Logs</p>
        </div>

        <div className="bg-white border border-green-300 rounded-xl p-4 text-center shadow-md">
          <div className="flex justify-center mb-2">
            <FlaskConical className="text-purple-600 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {analytics?.totalCarbonEquivalent?.toFixed?.(1) || '0.0'} kg
          </p>
          <p className="text-gray-700 text-sm mt-1">Carbon Equiv.</p>
        </div>

        <div className="bg-white border border-green-300 rounded-xl p-4 text-center shadow-md">
          <div className="flex justify-center mb-2">
            <Recycle className="text-blue-600 w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {analytics?.recyclableItems || 0}
          </p>
          <p className="text-gray-700 text-sm mt-1">Recyclable</p>
        </div>
      </div>

      <div className="bg-white border border-green-300 rounded-xl p-6 min-h-[200px] text-gray-600 shadow-md">
        {loading ? (
          <div className="flex items-center justify-center min-h-[150px]">
            <p>Loading waste logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[150px]">
            <div className="text-center">
              <Trash2 className="text-3xl mx-auto mb-2 text-orange-500" />
              <p>Waste log history will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const TYPE_META = {
                Plastic: { color: 'text-blue-600', bg: 'bg-blue-50', emoji: '🧴' },
                Paper: { color: 'text-yellow-600', bg: 'bg-yellow-50', emoji: '📄' },
                Glass: { color: 'text-cyan-600', bg: 'bg-cyan-50', emoji: '🍶' },
                Organic: { color: 'text-green-600', bg: 'bg-green-50', emoji: '🌿' },
                'E-waste': { color: 'text-red-600', bg: 'bg-red-50', emoji: '🔌' },
              }

              const meta = TYPE_META[log.wasteType] || TYPE_META['Plastic']

              return (
                <div
                  key={log._id}
                  className="bg-white rounded-xl border p-4 flex items-center gap-4 shadow-sm"
                >
                  <div className={`w-12 h-12 ${meta.bg} rounded-xl flex items-center justify-center text-xl`}>
                    {meta.emoji}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold ${meta.color}`}>{log.wasteType}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-sm text-gray-700">
                        {log.quantity} {log.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <p className="text-xs text-gray-500">
                        🌫 {log.carbonEquivalent?.toFixed(2)} kg CO₂
                      </p>

                      {log.isRecyclable && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ♻ Recyclable
                        </span>
                      )}

                      {log.isBiodegradable && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                          🌱 Biodegradable
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">
                    {new Date(log.date).toLocaleDateString()}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}