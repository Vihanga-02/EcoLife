import { Link, useLocation } from 'react-router-dom'
import {
  Leaf, Home, ChevronRight, LogOut,
  BarChart2, Zap, Trash2, ShoppingBag,
  Grid, Users, MapPin
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// ─── Sidebar nav configs (edit labels/paths/icons here) ───────────────────────

/** Navigation items for the User dashboard (/dashboard/*) */
export const userSidebarItems = [
  { path: '/dashboard',        label: 'Overview',       icon: <BarChart2 />, exact: true },
  { path: '/dashboard/energy', label: 'Energy Monitor', icon: <Zap /> },
  { path: '/dashboard/waste',  label: 'Waste Tracker',  icon: <Trash2 /> },
  { path: '/dashboard/market', label: 'My Listings',    icon: <ShoppingBag /> },
]

/** Navigation items for the Admin dashboard (/admin/*) */
export const adminSidebarItems = [
  { path: '/admin',             label: 'Overview',    icon: <Grid />,        exact: true },
  { path: '/admin/users',       label: 'Users',       icon: <Users /> },
  { path: '/admin/marketplace', label: 'Marketplace', icon: <ShoppingBag /> },
  { path: '/admin/recycling',   label: 'Recycling',   icon: <MapPin /> },
  { path: '/admin/waste',       label: 'Waste',       icon: <Trash2 /> },
  { path: '/admin/tariffs',     label: 'Tariffs',     icon: <Zap /> },
]

// ──────────────────────────────────────────────────────────────────────────────

/**
 * Shared Sidebar component used by both UserDashboard and AdminDashboard.
 *
 * Props:
 *   mode          – 'user' | 'admin'
 *   sidebarItems  – pass userSidebarItems or adminSidebarItems (exported above)
 *   onClose       – called when a nav link is clicked (for mobile drawer)
 *   onLogout      – logout handler
 */
export default function Sidebar({ mode = 'user', sidebarItems = [], onClose, onLogout }) {
  const { user } = useAuth()
  const location = useLocation()

  const isAdmin = mode === 'admin'

  return (
    <div className="flex flex-col h-full">
      {/* ── Brand / Logo ── */}
      <div className="p-5 border-b border-green-300">
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="text-green-600" />
            </div>
            <div>
              <span className="font-bold text-black">EcoLife</span>
              <span className="block text-xs text-gray-700">Admin Panel</span>
            </div>
          </div>
        ) : (
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="text-green-600" />
            </div>
            <span className="font-bold text-black">EcoLife</span>
          </Link>
        )}
      </div>

      {/* ── User / Admin info ── */}
      {isAdmin ? (
        <div className="px-4 py-3 border-b border-green-300 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-black text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded inline-block">Admin</p>
          </div>
        </div>
      ) : (
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
      )}

      {/* ── Navigation ── */}
      <nav className={`flex-1 p-3 ${isAdmin ? 'space-y-0.5' : 'space-y-1'}`}>
        <p className="text-gray-600 text-xs uppercase px-3 py-2 font-medium tracking-wider">
          {isAdmin ? 'Management' : 'Dashboard'}
        </p>

        {sidebarItems.map(item => {
          const active = item.exact
            ? location.pathname === item.path
            : location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
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

      {/* ── Bottom actions ── */}
      <div className={`p-3 border-t border-green-300 ${isAdmin ? 'space-y-0.5' : 'space-y-1'}`}>
        {!isAdmin && (
          <Link
            to="/home"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-black hover:bg-green-50 transition-all cursor-pointer text-sm"
          >
            <Home /> Back to Home
          </Link>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all cursor-pointer text-sm w-full"
        >
          <LogOut /> Logout
        </button>
      </div>
    </div>
  )
}
