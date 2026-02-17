import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Leaf, Home, ShoppingBag, MapPin, Grid, LogOut, User, ChevronDown, Info } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/home')
    setDropdownOpen(false)
  }

  const handleDashboard = () => {
    navigate('/dashboard')
    setDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const links = [
    { path: '/home', label: 'Home', icon: <Home /> },
    { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag /> },
    { path: '/recycle-centers', label: 'Recycle Centers', icon: <MapPin /> },
    { path: '/about', label: 'About Us', icon: <Info /> },
  ]

  return (
    <nav className="bg-white border-b border-green-300 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Leaf className="text-green-600" />
          </div>
          <span className="font-bold text-black text-lg">EcoLife</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                location.pathname.startsWith(link.path)
                  ? 'text-green-600 bg-green-100'
                  : 'text-gray-700 hover:text-black hover:bg-green-50'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons or User dropdown */}
        {isAuthenticated() ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-black text-sm font-medium">{user?.name}</span>
              <ChevronDown className={`text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} size={16} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-green-300 rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-green-200">
                  <p className="text-black text-sm font-medium">{user?.name}</p>
                  <p className="text-green-600 text-xs">⭐ {user?.greenScore || 0} pts</p>
                </div>
                <button
                  onClick={handleDashboard}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                >
                  <Grid size={16} />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-gray-700 hover:text-black transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
