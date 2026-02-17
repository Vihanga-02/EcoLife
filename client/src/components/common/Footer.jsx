import { Link } from 'react-router-dom'
import { Leaf, Home, ShoppingBag, MapPin, Info, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { path: '/home', label: 'Home', icon: <Home size={16} /> },
    { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag size={16} /> },
    { path: '/recycle-centers', label: 'Recycle Centers', icon: <MapPin size={16} /> },
    { path: '/about', label: 'About Us', icon: <Info size={16} /> },
  ]

  return (
    <footer className="bg-white border-t border-green-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div>
            <Link to="/home" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="text-green-600" />
              </div>
              <span className="font-bold text-black text-lg">EcoLife</span>
            </Link>
            <p className="text-gray-700 text-sm">
              Empowering sustainable living through smart technology and community action.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-black mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600 text-sm transition-colors"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-black mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-green-600" />
                <a href="mailto:support@ecolife.com" className="hover:text-green-600 transition-colors">
                  support@ecolife.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-green-600" />
                <a href="tel:+1234567890" className="hover:text-green-600 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} EcoLife. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-600">
            <Link to="/about" className="hover:text-green-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-green-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
