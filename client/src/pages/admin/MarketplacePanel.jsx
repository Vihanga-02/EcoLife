import { ShoppingBag } from 'lucide-react'

export default function MarketplacePanel() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">Marketplace Management</h2>
        <p className="text-gray-700 text-sm">Monitor all listings and transactions</p>
      </div>
      <div className="bg-white border border-green-300 rounded-xl shadow-md p-6 flex items-center justify-center min-h-[300px] text-gray-600">
        <div className="text-center">
          <ShoppingBag className="text-4xl mx-auto mb-2 text-purple-400/30" />
          <p>Marketplace items and transactions will appear here</p>
        </div>
      </div>
    </div>
  )
}
