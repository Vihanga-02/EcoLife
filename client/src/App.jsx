import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Public pages
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

// User pages
import HomePage from './pages/user/HomePage'
import MarketplacePage from './pages/user/MarketplacePage'
import RecycleCentersPage from './pages/user/RecycleCentersPage'
import UserDashboard from './pages/user/UserDashboard'
import AboutUsPage from './pages/user/AboutUsPage'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* User Routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/recycle-centers" element={<RecycleCentersPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/dashboard/*" element={<UserDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
