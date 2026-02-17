import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Leaf, Home, Zap, Trash2, ShoppingBag, BarChart2,
  Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

// =====================
// Sub-page placeholders
// =====================

const PlaceholderPage = ({ title, desc, icon }) => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <h2 className="text-black text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-700 text-sm max-w-xs">{desc}</p>
      <div className="mt-6 px-4 py-2.5 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm inline-block">
        🚧 Implementation coming soon
      </div>
    </div>
  </div>
)

const EnergyPage = () => (
  <div className="p-6">
    <div className="mb-6">
      <h2 className="text-xl font-bold text-black">Energy Monitor</h2>
      <p className="text-gray-700 text-sm">Track appliance usage and estimate bills</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {['Total kWh (Month)', 'Est. Bill', 'Appliances'].map(label => (
        <div key={label} className="bg-white border border-green-300 rounded-xl p-4 text-center shadow-md">
          <p className="text-2xl font-bold text-green-600">—</p>
          <p className="text-gray-700 text-sm mt-1">{label}</p>
        </div>
      ))}
    </div>
    <div className="bg-white border border-green-300 rounded-xl p-6 flex items-center justify-center min-h-[200px] text-gray-600 shadow-md">
      <div className="text-center">
        <Zap className="text-3xl mx-auto mb-2 text-yellow-500" />
        <p>Appliance list will appear here</p>
      </div>
    </div>
  </div>
)

const WastePage = () => (
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

const MarketPage = () => (
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

const OverviewPage = () => {
  const { user } = useAuth()
  return (
    <div className="p-6">
      <div className="mb-6">
      <h2 className="text-xl font-bold text-black">My Dashboard</h2>
      <p className="text-gray-700 text-sm">Your sustainability overview</p>
      </div>

      {/* Green score hero */}
      <div className="bg-white border border-green-300 rounded-xl p-6 mb-4 flex items-center gap-6 bg-gradient-to-r from-green-100 to-white shadow-md">
        <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center shrink-0">
          <Leaf className="text-green-700 text-2xl" />
        </div>
        <div>
          <p className="text-gray-700 text-sm">Your Green Score</p>
          <p className="text-4xl font-bold text-green-600">{user?.greenScore || 0}</p>
          <p className="text-gray-600 text-xs mt-0.5">Keep earning by logging waste, listing items & recycling</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Transactions', value: user?.totalTransactions || 0, color: 'text-blue-600' },
          { label: 'Waste Logs', value: '—', color: 'text-orange-600' },
          { label: 'Recycled (kg)', value: '—', color: 'text-green-600' },
          { label: 'Carbon Saved', value: '—', color: 'text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-green-300 rounded-xl p-4 text-center shadow-md">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-700 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-green-300 rounded-xl p-6 flex items-center justify-center min-h-[160px] text-gray-600 shadow-md">
        <div className="text-center">
          <BarChart2 className="text-3xl mx-auto mb-2 text-green-500" />
          <p>Activity charts will appear here</p>
        </div>
      </div>
    </div>
  )
}

// =====================
// Sidebar component
// =====================

const sidebarItems = [
  { path: '/dashboard', label: 'Overview', icon: <BarChart2 />, exact: true },
  { path: '/dashboard/energy', label: 'Energy Monitor', icon: <Zap /> },
  { path: '/dashboard/waste', label: 'Waste Tracker', icon: <Trash2 /> },
  { path: '/dashboard/market', label: 'My Listings', icon: <ShoppingBag /> },
]

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-green-300">
        <Link to="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Leaf className="text-green-600" />
          </div>
          <span className="font-bold text-black">EcoLife</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-green-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-black text-sm font-medium truncate">{user?.name}</p>
            <p className="text-green-600 text-xs">⭐ {user?.greenScore || 0} pts</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-gray-600 text-xs uppercase px-3 py-1 font-medium">Dashboard</p>
        {sidebarItems.map(item => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path) && item.path !== '/dashboard'
                ? true
                : item.exact && location.pathname === item.path
          const active = item.exact
            ? location.pathname === item.path
            : location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer text-sm ${
                active 
                  ? 'text-green-600 bg-green-100 border-l-2 border-green-500' 
                  : 'text-gray-600 hover:text-black hover:bg-green-50'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-sm">{item.label}</span>
              {active && <ChevronRight className="text-xs text-green-600" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-green-300 space-y-1">
        <Link to="/home" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-black hover:bg-green-50 transition-all cursor-pointer text-sm">
          <Home /> Back to Home
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer text-sm w-full">
          <LogOut /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-white border-r border-green-300 flex-col fixed left-0 top-0 bottom-0 z-40 shadow-lg">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white border-r border-green-300 flex flex-col shadow-lg">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-60 min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-green-300 sticky top-0 z-30 shadow-md">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="text-black text-xl" />
          </button>
          <span className="text-black font-semibold">Dashboard</span>
          <div className="w-6" />
        </div>

        {/* Routes */}
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="energy" element={<EnergyPage />} />
          <Route path="waste" element={<WastePage />} />
          <Route path="market" element={<MarketPage />} />
        </Routes>
      </main>
    </div>
  )
}
