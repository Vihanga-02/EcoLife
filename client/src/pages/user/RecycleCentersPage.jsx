import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { recyclingAPI } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import { MapPin, Search, Phone, Clock, Package, Grid, Map as MapIcon, X, Loader2, CheckCircle, XCircle } from 'lucide-react'

const MAP_CONTAINER_STYLE = { width: '100%', height: 'calc(100vh - 200px)', minHeight: '500px', borderRadius: '1rem' }
const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 } // Sri Lanka

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, type = 'success' }) {
  if (!msg) return null
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl shadow-xl text-white text-sm font-medium flex items-center gap-2 animate-fade-in ${type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
      {type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
      {msg}
    </div>
  )
}

// ─── Center Card (Grid View) ─────────────────────────────────────────────────
const CenterCard = ({ center, onRequest }) => (
  <div className="bg-white border border-green-200 rounded-2xl p-5 hover:border-green-400 hover:shadow-lg transition-all shadow-sm flex flex-col h-full group">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-green-600 transition-colors">{center.name}</h3>
        <p className="text-gray-500 text-xs flex items-center gap-1 mt-1 truncate">
          <MapPin className="text-green-500 w-3.5 h-3.5 shrink-0" />
          {center.city} · {center.address}
        </p>
      </div>
    </div>

    {center.acceptMaterials?.length > 0 && (
      <div className="flex flex-wrap gap-1.5 mb-4">
        {center.acceptMaterials.slice(0, 4).map(m => (
          <span key={m} className="text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 px-2 py-1 rounded-md">
            {m}
          </span>
        ))}
        {center.acceptMaterials.length > 4 && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 px-2 py-1 rounded-md">
            +{center.acceptMaterials.length - 4} more
          </span>
        )}
      </div>
    )}

    <div className="mt-auto space-y-1.5 text-xs text-gray-500 mb-5">
      {center.contactNumber && (
        <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-green-500" /> {center.contactNumber}</span>
      )}
      {center.operatingHours && (
        <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-green-500" /> {center.operatingHours}</span>
      )}
    </div>

    <button onClick={() => onRequest(center)} className="w-full bg-green-50 hover:bg-green-500 text-green-700 hover:text-white border border-green-200 hover:border-green-500 font-bold px-4 py-2.5 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2">
      <Package className="w-4 h-4" /> Drop off here
    </button>
  </div>
)

// ─── Request Modal ───────────────────────────────────────────────────────────
function RequestModal({ center, onClose, onSuccess }) {
  const [form, setForm] = useState({ materialType: '', estimatedWeight: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.materialType) return setError('Please select a material type')
    if (!form.estimatedWeight || parseFloat(form.estimatedWeight) <= 0) return setError('Please enter a valid weight')
    
    setLoading(true)
    setError(null)
    try {
      await recyclingAPI.createSubmission({
        centerId: center._id,
        materialType: form.materialType,
        estimatedWeight: parseFloat(form.estimatedWeight)
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Package className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-tight">Drop-off Request</h2>
              <p className="text-green-100 text-xs">{center.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X className="text-white w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Material Type</label>
            <select value={form.materialType} onChange={e => { setForm(p => ({...p, materialType: e.target.value})); setError(null); }}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="" disabled>Select material</option>
              {center.acceptMaterials.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Weight (kg)</label>
            <input type="number" step="0.1" min="0.1" value={form.estimatedWeight} onChange={e => { setForm(p => ({...p, estimatedWeight: e.target.value})); setError(null); }}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="e.g. 5.5"
            />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-bold shadow-md transition-colors flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


// ─── Main Page ───────────────────────────────────────────────────────────────
export default function RecycleCentersPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('map') // 'map' | 'grid'
  
  const [requestCenter, setRequestCenter] = useState(null)
  const [selectedPin, setSelectedPin] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); }

  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '' })
  const mapRef = useRef(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await recyclingAPI.getCenters()
        setCenters(res.data.centers?.filter(c => c.isActive) || [])
      } catch {
        setCenters([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = centers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.city?.toLowerCase().includes(search.toLowerCase()))

  const handleOpenRequest = (center) => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }
    setRequestCenter(center)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <Toast msg={toast?.msg} type={toast?.type} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">♻️</span>
              <span className="text-green-200 text-sm font-semibold uppercase tracking-wider">Recycling Network</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
              Find a Drop-off Center <span className="text-yellow-300">Near You</span>
            </h1>
            <p className="text-green-100 text-sm md:text-base leading-relaxed">
              Locate verified recycling facilities across the country. Submit your drop-off requests and earn green points for every kilogram recycled!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search centers by city, name..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm"
            />
          </div>

          <div className="flex gap-1.5 p-1 bg-white border border-gray-200 rounded-xl shadow-sm w-full md:w-auto">
            <button onClick={() => setViewMode('map')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
              <MapIcon className="w-4 h-4" /> Map
            </button>
            <button onClick={() => setViewMode('grid')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Grid className="w-4 h-4" /> Grid
            </button>
          </div>
        </div>

        {/* Views */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5"><MapPin className="text-gray-300 w-10 h-10" /></div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">No centers found</h3>
            <p className="text-gray-500 text-sm">We couldn't find any centers matching your search.</p>
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-200">
            {!isLoaded ? (
              <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl"><Loader2 className="w-8 h-8 text-green-500 animate-spin" /></div>
            ) : (
              <GoogleMap 
                mapContainerStyle={MAP_CONTAINER_STYLE} 
                zoom={8} 
                center={DEFAULT_CENTER}
                onLoad={map => { mapRef.current = map }}
                options={{ disableDefaultUI: true, zoomControl: true, mapTypeControl: false, streetViewControl: false }}
              >
                {filtered.map(center => {
                  const lat = center.location?.coordinates?.[1]
                  const lng = center.location?.coordinates?.[0]
                  if (!lat || !lng) return null
                  
                  return (
                    <Marker
                      key={center._id}
                      position={{ lat, lng }}
                      icon={{ url: '/dusbin.png', scaledSize: new window.google.maps.Size(40, 40) }}
                      onClick={() => setSelectedPin(center)}
                    />
                  )
                })}

                {selectedPin && (
                  <InfoWindow
                    position={{ lat: selectedPin.location.coordinates[1], lng: selectedPin.location.coordinates[0] }}
                    onCloseClick={() => setSelectedPin(null)}
                  >
                    <div className="p-3 max-w-[220px]">
                      <h3 className="font-bold text-gray-900 text-base mb-1">{selectedPin.name}</h3>
                      <p className="text-xs text-gray-500 mb-3">{selectedPin.address}</p>
                      <button onClick={() => { setSelectedPin(null); handleOpenRequest(selectedPin); }} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-xs font-bold transition-colors">
                        Request Drop-off
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(center => <CenterCard key={center._id} center={center} onRequest={handleOpenRequest} />)}
          </div>
        )}
      </div>

      {requestCenter && (
        <RequestModal 
          center={requestCenter} 
          onClose={() => setRequestCenter(null)} 
          onSuccess={() => { setRequestCenter(null); showToast('Request submitted successfully! We will review it soon.'); }} 
        />
      )}

      <Footer />
    </div>
  )
}
