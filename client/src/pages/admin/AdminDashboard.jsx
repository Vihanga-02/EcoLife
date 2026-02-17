import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
// import { adminAPI, recyclingAPI, marketplaceAPI } from '../../api/api'
import {
  Leaf, Grid, Users, ShoppingBag, Trash2,
  MapPin, Settings, LogOut, Menu, X,
  Zap, CheckCircle, Clock, TrendingUp, ChevronRight
} from 'lucide-react'

// =======================
// STAT CARD
// =======================
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white border border-green-300 rounded-xl p-5 flex items-center gap-4 shadow-md">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-black">{value ?? '—'}</p>
      <p className="text-gray-700 text-sm">{label}</p>
    </div>
  </div>
)

// =======================
// ADMIN OVERVIEW
// =======================
const AdminOverview = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getStats()
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black">Admin Dashboard</h2>
        <p className="text-gray-700 text-sm">Platform overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={stats?.stats?.totalUsers} icon={<Users className="text-blue-400 text-xl" />} color="bg-blue-500/10" />
        <StatCard label="Active Users" value={stats?.stats?.activeUsers} icon={<CheckCircle className="text-green-600 text-xl" />} color="bg-green-500/10" />
        <StatCard label="Market Items" value={stats?.stats?.totalMarketItems} icon={<ShoppingBag className="text-purple-400 text-xl" />} color="bg-purple-500/10" />
        <StatCard label="Pending Recycling" value={stats?.stats?.pendingSubmissions} icon={<Clock className="text-yellow-400 text-xl" />} color="bg-yellow-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Users */}
        <div className="bg-white border border-green-300 rounded-xl p-5 shadow-md">
          <h3 className="text-black font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-600" /> Top Green Score Users
          </h3>
          {stats?.topUsers?.length > 0 ? (
            <div className="space-y-3">
              {stats.topUsers.map((u, i) => (
                <div key={u._id} className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm w-5">{i + 1}.</span>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-black text-sm truncate">{u.name}</p>
                    <p className="text-gray-600 text-xs truncate">{u.email}</p>
                  </div>
                  <span className="text-green-600 text-sm font-medium">{u.greenScore} pts</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No data yet</p>
          )}
        </div>

        {/* Waste by Type */}
        <div className="bg-white border border-green-300 rounded-xl p-5 shadow-md">
          <h3 className="text-black font-semibold mb-4 flex items-center gap-2">
            <Trash2 className="text-orange-600" /> Waste by Type
          </h3>
          {stats?.wasteByType?.length > 0 ? (
            <div className="space-y-2">
              {stats.wasteByType.map(w => (
                <div key={w._id} className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">{w._id}</span>
                  <span className="text-black text-sm font-medium">{w.total?.toFixed(1)} kg</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No waste logs yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

// =======================
// USERS MANAGEMENT
// =======================
const UsersPanel = () => (
  <div className="p-6">
    <div className="mb-6">
      <h2 className="text-xl font-bold text-black">User Management</h2>
      <p className="text-gray-700 text-sm">Manage platform users</p>
    </div>
    <div className="bg-white border border-green-300 rounded-xl p-6 flex items-center justify-center min-h-[300px] text-gray-600 shadow-md">
      <div className="text-center">
        <Users className="text-4xl mx-auto mb-2 text-blue-500" />
        <p>User table and controls will appear here</p>
      </div>
    </div>
  </div>
)

// =======================
// MARKETPLACE PANEL
// =======================
const MarketplacePanel = () => (
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

// =======================
// RECYCLING PANEL
// =======================
const RecyclingPanel = () => (
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

// =======================
// WASTE PANEL
// =======================
const WastePanel = () => (
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

// =======================
// TARIFF PANEL
// =======================
const TariffPanel = () => (
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

// =======================
// SIDEBAR CONFIG
// =======================
const sidebarItems = [
  { path: '/admin', label: 'Overview', icon: <Grid />, exact: true },
  { path: '/admin/users', label: 'Users', icon: <Users /> },
  { path: '/admin/marketplace', label: 'Marketplace', icon: <ShoppingBag /> },
  { path: '/admin/recycling', label: 'Recycling', icon: <MapPin /> },
  { path: '/admin/waste', label: 'Waste', icon: <Trash2 /> },
  { path: '/admin/tariffs', label: 'Tariffs', icon: <Zap /> },
]

// =======================
// MAIN ADMIN DASHBOARD
// =======================
export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-green-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Leaf className="text-green-600" />
          </div>
          <div>
            <span className="font-bold text-black">EcoLife</span>
            <span className="block text-xs text-gray-700">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div className="px-4 py-3 border-b border-green-300 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-black text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded inline-block">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-gray-600 text-xs uppercase px-3 py-2 font-medium tracking-wider">Management</p>
        {sidebarItems.map(item => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path) && item.path !== '/admin'
                ? true
                : item.exact
          const active = item.exact
            ? location.pathname === item.path
            : location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
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

      {/* Bottom */}
      <div className="p-3 border-t border-green-300 space-y-0.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer text-sm w-full text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-white border-r border-green-300 flex-col fixed left-0 top-0 bottom-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white border-r border-green-300 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 md:ml-60 min-h-screen">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-green-300 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="text-black text-xl" />
          </button>
          <span className="text-black font-semibold">Admin Panel</span>
          <div className="w-6" />
        </div>

        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<UsersPanel />} />
          <Route path="marketplace" element={<MarketplacePanel />} />
          <Route path="recycling" element={<RecyclingPanel />} />
          <Route path="waste" element={<WastePanel />} />
          <Route path="tariffs" element={<TariffPanel />} />
        </Routes>
      </main>
    </div>
  )
}
