import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import { useAuth } from '../../context/AuthContext'
import { Leaf, Users, Target, Heart, Award, Globe, Zap, ShoppingBag, Trash2, MapPin } from 'lucide-react'

export default function AboutUsPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-white flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mb-6">
            <Leaf className="text-green-700 text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">About EcoLife</h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Empowering individuals and communities to live sustainably through smart technology and collective action.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white border border-green-300 rounded-2xl p-8 mb-8 shadow-md">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <Target className="text-green-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                EcoLife is dedicated to creating a sustainable future by making environmental consciousness accessible, 
                measurable, and rewarding. We believe that every small action counts, and together, we can make a 
                significant impact on our planet.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-green-300 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Energy Monitoring</h3>
            <p className="text-gray-700 text-sm">
              Track your energy consumption and get insights to reduce your carbon footprint while saving on bills.
            </p>
          </div>

          <div className="bg-white border border-green-300 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Sustainable Marketplace</h3>
            <p className="text-gray-700 text-sm">
              Buy, sell, or give away items to extend their lifecycle and reduce waste in your community.
            </p>
          </div>

          <div className="bg-white border border-green-300 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Trash2 className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Waste Tracking</h3>
            <p className="text-gray-700 text-sm">
              Log and analyze your waste patterns to understand your environmental impact better.
            </p>
          </div>

          <div className="bg-white border border-green-300 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Recycling Centers</h3>
            <p className="text-gray-700 text-sm">
              Find nearby recycling centers and submit recycling requests to contribute to a circular economy.
            </p>
          </div>

          <div className="bg-white border border-green-300 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Award className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Green Score System</h3>
            <p className="text-gray-700 text-sm">
              Earn points for every sustainable action you take and compete with others in your community.
            </p>
          </div>

          <div className="bg-white border border-green-300 rounded-xl p-6 shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Community Driven</h3>
            <p className="text-gray-700 text-sm">
              Join a community of like-minded individuals working together towards a sustainable future.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white border border-green-300 rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Sustainability</h3>
              <p className="text-gray-700 text-sm">
                We prioritize long-term environmental health over short-term convenience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Accessibility</h3>
              <p className="text-gray-700 text-sm">
                Making sustainable living easy and accessible to everyone.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Impact</h3>
              <p className="text-gray-700 text-sm">
                Every action matters. We measure and celebrate your contributions.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action - Only show for unauthenticated users */}
        {!isAuthenticated() && (
          <div className="mt-12 text-center">
            <div className="bg-green-50 border border-green-300 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-black mb-4">Join Us Today</h2>
              <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                Start your sustainable journey and make a positive impact on the environment. 
                Every small step counts towards a greener future.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/signup"
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Get Started
                </a>
                <a
                  href="/home"
                  className="px-6 py-3 bg-white border border-green-300 hover:bg-green-50 text-black font-semibold rounded-lg transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
