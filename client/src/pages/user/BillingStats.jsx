import { useState, useEffect } from 'react'
import { Sparkles, CalendarCheck, Receipt, Loader2, Info, CheckCircle, Flame } from 'lucide-react'
import { energyAPI, aiAPI } from '../../api/api'

const fmt = (n, d = 2) => parseFloat(n || 0).toFixed(d)

export default function BillingStats({ onFinalizeSuccess }) {
  const [pastBills, setPastBills] = useState([])
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(true)
  const [finalizing, setFinalizing] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await energyAPI.getBillingStats()
      setPastBills(res.data.stats || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load past billing stats.')
    } finally {
      setLoading(false)
    }

    setAiLoading(true)
    try {
      const aiRes = await aiAPI.getEnergyTips()
      setTips(aiRes.data.tips || [])
    } catch {
      // AI fail is non-critical, leave tips empty
    } finally {
      setAiLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleFinalize = async () => {
    if (!window.confirm("Are you sure you want to finalize this month? This will save the current usage as your official monthly bill and reset all appliance usage tracking to 0 kWh.")) return
    setFinalizing(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await energyAPI.finalizeMonth()
      setSuccessMsg(res.data.message)
      await loadData() // Refresh past bills & maybe get new AI recommendations
      if (onFinalizeSuccess) {
        onFinalizeSuccess()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to finalize month.')
    } finally {
      setFinalizing(false)
    }
  }

  return (
    <div className="space-y-6">

      {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl border border-red-100 text-sm font-medium">{error}</div>}
      {successMsg && <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-2xl border border-emerald-100 text-sm font-medium">{successMsg}</div>}

      {/* ── AI Energy Tips Section ── */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-md border border-indigo-400 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <div className="relative z-10 flex flex-col md:flex-row gap-6">
          <div className="shrink-0 flex flex-col md:items-center">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h3 className="text-white font-bold text-lg leading-tight">AI Energy<br className="hidden md:block" /> Advisor</h3>
          </div>

          <div className="flex-1">
            {aiLoading ? (
              <div className="flex items-center gap-2 text-indigo-100 py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Analysing your usage and predicting savings...</span>
              </div>
            ) : tips.length === 0 ? (
              <p className="text-indigo-100 text-sm py-4">Add appliances and run them to start receiving personalised energy-saving tips.</p>
            ) : (
              <ul className="space-y-3">
                {tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 bg-black/10 rounded-xl p-3 items-start">
                    <Flame className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                    <p className="text-indigo-50 text-sm font-medium leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Finalize Action Panel ── */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-500" />
            End of Month Cycle
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Finalize the current month to permanently save your live tracked usage. This will lock in your real-time bill for the month and reset all appliance usage tracking to 0 kWh.
          </p>
        </div>
        <button
          onClick={handleFinalize}
          disabled={finalizing}
          className="shrink-0 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {finalizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          {finalizing ? 'Finalizing...' : 'Finalize Current Month'}
        </button>
      </div>

      {/* ── Historical Bills Grid ── */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2 ml-1">
          <Receipt className="w-4 h-4 text-gray-400" />
          Billing History
        </h3>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>
        ) : pastBills.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl py-14 px-6 text-center">
            <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-gray-800 font-bold mb-1">No past bills found</h4>
            <p className="text-xs text-gray-400">Finalize a month cycle to save your first bill.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastBills.map((stat) => (
              <div key={stat._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">{stat.monthLabel}</span>
                  </div>
                  <span className="text-xs text-gray-400">Tariff: {stat.tariffApplied}</span>
                </div>

                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Final Bill</p>
                    <p className="text-3xl font-black text-gray-900 leading-none">
                      <span className="text-lg text-gray-400 mr-1">Rs</span>{fmt(stat.realTimeBill)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Total Usage</p>
                    <p className="text-xl font-bold text-emerald-600 leading-none">
                      {fmt(stat.totalKwh, 3)} <span className="text-xs text-emerald-600/60 ml-0.5">kWh</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center tooltip-trigger group relative">
                  <div className="flex items-center gap-1.5 line-clamp-1">
                    <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500">Estimated bill was: <strong>Rs {fmt(stat.estimatedBill)}</strong></span>
                  </div>

                  {/* Appliance details tooltip */}
                  <div className="absolute bottom-full left-0 mb-2 w-full invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all z-20">
                    <div className="bg-slate-800 text-white rounded-xl p-4 shadow-xl text-xs">
                      <p className="font-bold text-slate-300 border-b border-slate-600 pb-2 mb-2">Usage Breakdown</p>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {stat.appliances.map((a, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="truncate pr-2">{a.name} ({a.wattage}W)</span>
                            <span className="font-mono text-emerald-400 shrink-0">{fmt(a.totalKwh, 2)} kWh</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
