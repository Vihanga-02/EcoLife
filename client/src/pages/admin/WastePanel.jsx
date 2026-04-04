import { useState, useEffect, useCallback } from 'react'
import { Trash2, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { wasteAPI } from '../../api/api'

export default function WastePanel() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await wasteAPI.adminGetAll()
      setLogs(res.data.logs || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch waste logs.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-black mb-4">Waste Analytics</h2>

      {error && (
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle /> {error}
        </div>
      )}

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <p>Total Logs: {logs.length}</p>
      )}
    </div>
  )
}