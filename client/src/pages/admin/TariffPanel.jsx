import { Zap } from 'lucide-react'

export default function TariffPanel() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">Tariff Management</h2>
        <p className="text-gray-700 text-sm">Configure electricity tariff blocks</p>
      </div>
      <div className="bg-white border border-green-300 rounded-xl shadow-md p-6 flex items-center justify-center min-h-[300px] text-gray-600">
        <div className="text-center">
          <Zap className="text-4xl mx-auto mb-2 text-yellow-400/30" />
          <p>Tariff blocks and configuration will appear here</p>
        </div>
      </div>
    </div>
  )
}
