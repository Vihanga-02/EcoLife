import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Menu } from 'lucide-react'
import Sidebar, { userSidebarItems } from '../../components/common/Sidebar'

// Sub-pages
import OverviewPage from './OverviewPage'
import EnergyPage from './EnergyPage'
import WastePage from './WastePage'
import MarketPage from './MarketPage'
import RecycleDetails from './RecycleDetails'

export default function UserDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-500 to-white flex overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-white border-r border-green-300 flex-col fixed left-0 top-0 bottom-0 z-40 shadow-lg">
        <Sidebar
          mode="user"
          sidebarItems={userSidebarItems}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white border-r border-green-300 flex flex-col shadow-lg">
            <Sidebar
              mode="user"
              sidebarItems={userSidebarItems}
              onClose={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-60 min-h-screen min-w-0">
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
          <Route path="recycling" element={<RecycleDetails />} />
        </Routes>
      </main>
    </div>
  )
}
