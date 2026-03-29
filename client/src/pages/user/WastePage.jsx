import { Trash2 } from 'lucide-react'

export default function WastePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">Waste Tracker</h2>
        <p className="text-gray-700 text-sm">Log and analyse your waste generation</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {['Total Logs', 'Carbon Equiv.', 'Recyclable'].map(label => (
          <div key={label} className="bg-white border border-green-300 rounded-xl p-4 text-center shadow-md">
            <p className="text-2xl font-bold text-green-600">—</p>
            <p className="text-gray-700 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-green-300 rounded-xl p-6 flex items-center justify-center min-h-[200px] text-gray-600 shadow-md">
        <div className="text-center">
          <Trash2 className="text-3xl mx-auto mb-2 text-orange-500" />
          <p>Waste log history will appear here</p>
        </div>
      </div>
    </div>
  )
}
