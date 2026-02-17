import { useState, useEffect } from 'react'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
// import { recyclingAPI } from '../../api/api'
import { MapPin, Search, Phone, Clock, Package } from 'lucide-react'

const CenterCard = ({ center }) => (
  <div className="bg-white border border-green-300 rounded-xl p-5 hover:border-green-500 transition-all shadow-md">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-black font-semibold text-base">{center.name}</h3>
        <p className="text-gray-700 text-sm flex items-center gap-1 mt-0.5">
          <MapPin className="text-green-600 shrink-0" />
          {center.city} · {center.address}
        </p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${
        center.isActive
          ? 'bg-green-100 text-green-700 border border-green-400'
          : 'bg-gray-200 text-gray-600'
      }`}>
        {center.isActive ? 'Active' : 'Inactive'}
      </span>
    </div>

    {center.acceptMaterials?.length > 0 && (
      <div className="flex flex-wrap gap-1.5 mb-3">
        {center.acceptMaterials.map(m => (
          <span key={m} className="text-xs bg-green-50 border border-green-200 text-gray-700 px-2 py-0.5 rounded">
            {m}
          </span>
        ))}
      </div>
    )}

    <div className="flex flex-col gap-1.5 text-xs text-gray-600 mb-4">
      {center.contactNumber && (
        <span className="flex items-center gap-1.5"><Phone className="text-green-600" /> {center.contactNumber}</span>
      )}
      {center.operatingHours && (
        <span className="flex items-center gap-1.5"><Clock className="text-green-600" /> {center.operatingHours}</span>
      )}
    </div>

    <button className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 w-full text-sm py-1.5 flex items-center justify-center gap-2">
      <Package /> Submit Recycling Request
    </button>
  </div>
)

export default function RecycleCentersPage() {
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await recyclingAPI.getCenters()
        setCenters(res.data.centers || [])
      } catch {
        setCenters([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = centers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-white flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black">Recycle Centers</h1>
          <p className="text-gray-700 text-sm mt-0.5">Find nearby centers and submit recycling requests</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        {/* Centers Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(center => <CenterCard key={center._id} center={center} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-700">
            <MapPin className="text-4xl mx-auto mb-3" />
            <p className="text-lg text-black">No centers found</p>
            <p className="text-sm mt-1">Try a different search or check back later.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
