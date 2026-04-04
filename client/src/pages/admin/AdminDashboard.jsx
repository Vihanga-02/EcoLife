import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu } from 'lucide-react'
import Sidebar, { adminSidebarItems } from '../../components/common/Sidebar'

// Sub-pages
import AdminOverview from './AdminOverview'
import UsersPanel from './UsersPanel'
import MarketplacePanel from './MarketplacePanel'
import RecyclingPanel from './RecyclingPanel'
import WastePanel from './WastePanel'
import TariffPanel from './TariffPanel'


export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-white border-r border-green-300 flex-col fixed left-0 top-0 bottom-0 z-40">
        <Sidebar
          mode="admin"
          sidebarItems={adminSidebarItems}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white border-r border-green-300 flex flex-col">
            <Sidebar
              mode="admin"
              sidebarItems={adminSidebarItems}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
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
