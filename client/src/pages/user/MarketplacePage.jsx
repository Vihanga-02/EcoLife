import { useState, useEffect } from 'react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
// import { marketplaceAPI } from '../../api/api'
import { Search, Filter, Plus, ShoppingBag, Tag } from 'lucide-react'

const ItemCard = ({ item }) => (
  <div className="bg-white border border-green-300 rounded-xl overflow-hidden hover:border-green-500 transition-all shadow-md">
    <div className="aspect-video bg-green-100 relative">
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <ShoppingBag className="text-3xl" />
        </div>
      )}
      <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
        item.listingType === 'Free'
          ? 'bg-green-200 text-green-700 border border-green-400'
          : 'bg-blue-200 text-blue-700 border border-blue-400'
      }`}>
        {item.listingType}
      </span>
    </div>
    <div className="p-4">
      <h3 className="text-black font-medium mb-1 truncate">{item.title}</h3>
      <p className="text-gray-700 text-xs mb-3 line-clamp-2">{item.description || 'No description'}</p>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-gray-600">
          <Tag /> {item.category}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          item.condition === 'New' ? 'bg-green-100 text-green-700' :
          item.condition === 'Good' ? 'bg-blue-100 text-blue-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {item.condition}
        </span>
      </div>
      <button className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 w-full mt-3 text-sm py-1.5">
        View Details
      </button>
    </div>
  </div>
)

export default function MarketplacePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await marketplaceAPI.getItems()
        setItems(res.data.items || [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const filtered = items.filter(i =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-white flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-black">Marketplace</h1>
            <p className="text-gray-700 text-sm mt-0.5">Reuse, trade and earn Green Score</p>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm">
            <Plus /> List an Item
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 border border-green-300 text-gray-700 hover:border-green-500 hover:text-green-600 px-4 py-2 rounded-lg transition-all text-sm bg-white">
            <Filter /> Filter
          </button>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => <ItemCard key={item._id} item={item} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-700">
            <ShoppingBag className="text-4xl mx-auto mb-3" />
            <p className="text-lg text-black">No items found</p>
            <p className="text-sm mt-1">Be the first to list something!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
