import { ShoppingBag } from 'lucide-react'

export default function MarketPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">My Marketplace Listings</h2>
        <p className="text-gray-700 text-sm">Manage your listed items and transactions</p>
      </div>
      <div className="bg-white border border-green-300 rounded-xl p-6 flex items-center justify-center min-h-[200px] text-gray-600 shadow-md">
        <div className="text-center">
          <ShoppingBag className="text-3xl mx-auto mb-2 text-blue-500" />
          <p>Your listings and requests will appear here</p>
        </div>
      </div>
    </div>
  )
}
