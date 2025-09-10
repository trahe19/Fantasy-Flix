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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <img src="/images/logo.png" alt="Fantasy Flix" className="w-48 h-48 mx-auto mb-8 animate-pulse object-contain" style={{aspectRatio: '1/1'}} />
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-white/60 mt-4 text-sm">Loading the experience...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} />
  }

  return <UserDashboard user={user} onLogout={handleLogout} />
}