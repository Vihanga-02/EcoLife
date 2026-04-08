import { useState, useCallback, useRef } from 'react'
import { X, MapPin, Loader2, Info } from 'lucide-react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { recyclingAPI } from '../../api/api'

const COMMON_MATERIALS = ['Plastic', 'Paper', 'Glass', 'E-waste', 'Organic', 'Metal', 'Textile']
const MAP_CONTAINER_STYLE = { width: '100%', height: '100%', borderRadius: '0.75rem' }
const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 } // Sri Lanka

export default function RecycleCenterForm({ center = null, onClose, onSuccess }) {
  const isEdit = Boolean(center)
  const defaultLoc = isEdit && center.location?.coordinates
    ? { lng: center.location.coordinates[0], lat: center.location.coordinates[1] }
    : DEFAULT_CENTER

  const [form, setForm] = useState({
    name: center?.name || '',
    city: center?.city || '',
    address: center?.address || '',
    contactNumber: center?.contactNumber || '',
    operatingHours: center?.operatingHours || '',
    acceptMaterials: center?.acceptMaterials || [],
    isActive: center?.isActive ?? true,
    latitude: defaultLoc.lat,
    longitude: defaultLoc.lng
  })

  // Has the user intentionally placed a marker?
  const [markerPlaced, setMarkerPlaced] = useState(isEdit)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  })

  const mapRef = useRef(null)
  const onMapLoad = useCallback((map) => { mapRef.current = map }, [])
  const onMapUnmount = useCallback(() => { mapRef.current = null }, [])

  const handleMapClick = (e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setForm(p => ({ ...p, latitude: lat, longitude: lng }))
    setMarkerPlaced(true)
  }

  const toggleMaterial = (mat) => {
    setForm(p => {
      const isSelected = p.acceptMaterials.includes(mat)
      const newMats = isSelected
        ? p.acceptMaterials.filter(m => m !== mat)
        : [...p.acceptMaterials, mat]
      return { ...p, acceptMaterials: newMats }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!markerPlaced) {
      setError('Please pin the location on the map.')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      if (isEdit) {
        await recyclingAPI.updateCenter(center._id, form)
      } else {
        await recyclingAPI.createCenter(form)
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save location.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95dvh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0 pr-8 sm:pr-0">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                {isEdit ? 'Edit Recycling Center' : 'Add New Center'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Provide details and pin the location</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 min-h-0">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm flex gap-2">
              <Info className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Center Name <span className="text-red-500">*</span></label>
                <input required type="text" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g. Colombo Central Recycling"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                <input required type="text" value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g. Colombo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address <span className="text-red-500">*</span></label>
                <input required type="text" value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g. 123 Main St, Colombo 05"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                  <input type="text" value={form.contactNumber} onChange={e => setForm(p => ({...p, contactNumber: e.target.value}))}
                    className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="e.g. 011 234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Operating Hours</label>
                  <input type="text" value={form.operatingHours} onChange={e => setForm(p => ({...p, operatingHours: e.target.value}))}
                    className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="e.g. 9 AM - 5 PM"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({...p, isActive: e.target.checked}))}
                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-800">Center is Active (Visible to users)</span>
                </label>
              </div>
            </div>

            {/* Right Column: Map & Materials */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-400 font-normal ml-2">Click on map to pin</span>
                </label>
                
                <div className="rounded-xl overflow-hidden border border-gray-300 relative bg-gray-50 h-[220px] sm:h-[280px] lg:h-[300px]">
                  {loadError ? (
                    <div className="flex items-center justify-center w-full h-full text-sm text-red-500">Map failed to load</div>
                  ) : !isLoaded ? (
                    <div className="flex items-center justify-center w-full h-full"><Loader2 className="w-6 h-6 animate-spin text-green-500" /></div>
                  ) : (
                    <GoogleMap
                      mapContainerStyle={MAP_CONTAINER_STYLE}
                      center={defaultLoc}
                      zoom={markerPlaced ? 14 : 7}
                      onClick={handleMapClick}
                      onLoad={onMapLoad}
                      onUnmount={onMapUnmount}
                      options={{ streetViewControl: false, mapTypeControl: false, disableDefaultUI: true, zoomControl: true }}
                    >
                      {markerPlaced && (
                        <Marker position={{ lat: form.latitude, lng: form.longitude }} />
                      )}
                    </GoogleMap>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Accepted Materials</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {COMMON_MATERIALS.map(mat => {
                    const active = form.acceptMaterials.includes(mat)
                    return (
                      <button type="button" key={mat} onClick={() => toggleMaterial(mat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          active ? 'bg-green-500 border-green-500 text-white shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:border-green-400'
                        }`}
                      >
                        {mat}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 shrink-0">
          <button type="button" onClick={onClose} disabled={loading} className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isEdit ? 'Save Changes' : 'Add Center'}
          </button>
        </div>
      </div>
    </div>
  )
}
