'use client'

import { useAuth } from '../contexts/AuthContext'
import LandingPage from '../components/LandingPage'
import UserDashboard from '../components/UserDashboard'

export default function Home() {
  const { user, loading, setUser } = useAuth()

  const handleLogin = (loggedInUser: any) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} />
  }

  return <UserDashboard user={user} onLogout={handleLogout} />
}