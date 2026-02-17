import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { Zap, ShoppingBag, Trash2, MapPin, ArrowRight, Award } from 'lucide-react'

const FeatureCard = ({ icon, title, desc, to, color, requiresAuth, isAuthenticated }) => {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (requiresAuth && !isAuthenticated) {
      e.preventDefault()
      navigate('/login')
    }
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="bg-white border border-green-300 rounded-xl p-6 hover:border-green-500 transition-all group cursor-pointer block shadow-md"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <h3 className="text-black font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-700 text-sm mb-4">{desc}</p>
      <span className="flex items-center gap-1.5 text-green-600 text-sm group-hover:gap-2.5 transition-all">
        Explore <ArrowRight />
      </span>
    </Link>
  )
}

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()

  const features = [
    {
      icon: <Zap className="text-yellow-400 text-xl" />,
      title: 'Energy Monitor',
      desc: 'Track appliance usage and estimate your monthly electricity bill.',
      to: '/dashboard/energy',
      color: 'bg-yellow-500/10',
      requiresAuth: true,
    },
    {
      icon: <ShoppingBag className="text-blue-400 text-xl" />,
      title: 'Marketplace',
      desc: 'List or claim reusable items and earn Green Score rewards.',
      to: '/marketplace',
      color: 'bg-blue-500/10',
      requiresAuth: false,
    },
    {
      icon: <Trash2 className="text-orange-400 text-xl" />,
      title: 'Waste Tracker',
      desc: 'Log your waste and analyse your environmental footprint.',
      to: '/dashboard/waste',
      color: 'bg-orange-500/10',
      requiresAuth: true,
    },
    {
      icon: <MapPin className="text-green-400 text-xl" />,
      title: 'Recycle Centers',
      desc: 'Find nearby recycling centers and submit recycling requests.',
      to: '/recycle-centers',
      color: 'bg-green-500/10',
      requiresAuth: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-white flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12 flex-1">
        {/* Hero */}
        <div className="mb-12">
          {user && (
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-300 text-green-700 text-sm px-3 py-1.5 rounded-full mb-4">
              <Award className="text-xs" />
              Green Score: {user?.greenScore || 0} points
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {user ? (
              <>
                Welcome back,{' '}
                <span className="text-green-700">{user?.name?.split(' ')[0]}</span> 👋
              </>
            ) : (
              <>
                Welcome to <span className="text-green-700">EcoLife</span> 🌱
              </>
            )}
          </h1>
          <p className="text-gray-700 text-lg max-w-xl">
            {user 
              ? 'Track your impact, reuse smarter, and earn Green Score points for every sustainable action you take.'
              : 'Start your sustainable journey today. Track your impact, reuse smarter, and earn Green Score points for every sustainable action you take.'
            }
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map(f => (
            <FeatureCard 
              key={f.title} 
              {...f} 
              isAuthenticated={isAuthenticated()} 
            />
          ))}
        </div>

        {/* Quick stats placeholder */}
        {user && (
          <div className="bg-white border border-green-300 rounded-xl p-6 shadow-md">
            <h2 className="text-black font-semibold text-lg mb-4">Your Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Green Score', value: user?.greenScore || 0, unit: 'pts' },
                { label: 'Transactions', value: user?.totalTransactions || 0, unit: 'trades' },
                { label: 'Waste Logged', value: '—', unit: 'entries' },
                { label: 'Carbon Saved', value: '—', unit: 'kg CO₂' },
              ].map(s => (
                <div key={s.label} className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                  <p className="text-2xl font-bold text-green-600">{s.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{s.unit}</p>
                  <p className="text-sm text-gray-700">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
