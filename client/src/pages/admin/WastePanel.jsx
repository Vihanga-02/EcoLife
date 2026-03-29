import { Trash2 } from 'lucide-react'

export default function WastePanel() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">Waste Analytics</h2>
        <p className="text-gray-700 text-sm">Platform-wide waste data</p>
      </div>
      <div className="bg-white border border-green-300 rounded-xl shadow-md p-6 flex items-center justify-center min-h-[300px] text-gray-600">
        <div className="text-center">
          <Trash2 className="text-4xl mx-auto mb-2 text-orange-400/30" />
          <p>Waste analytics charts and logs will appear here</p>
        </div>
      </div>
    </div>
  )
}
