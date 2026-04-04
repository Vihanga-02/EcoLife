import { MapPin, CheckCircle } from 'lucide-react'

export default function RecyclingPanel() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">Recycling Management</h2>
        <p className="text-gray-700 text-sm">Manage centers and review submissions</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-green-300 rounded-xl shadow-md p-6 flex items-center justify-center min-h-[250px] text-gray-600">
          <div className="text-center">
            <MapPin className="text-4xl mx-auto mb-2 text-green-600/30" />
            <p>Recycling centers list will appear here</p>
          </div>
        </div>
        <div className="bg-white border border-green-300 rounded-xl shadow-md p-6 flex items-center justify-center min-h-[250px] text-gray-600">
          <div className="text-center">
            <CheckCircle className="text-4xl mx-auto mb-2 text-yellow-400/30" />
            <p>Pending submissions will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
