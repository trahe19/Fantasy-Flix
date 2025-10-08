'use client'

import { useState, useEffect } from 'react'
import { login, register, User } from '../lib/auth'
import { testSupabaseConnection } from '../lib/supabase-test'

interface AuthProps {
  onLogin: (user: User) => void
  onBack?: () => void
  defaultMode?: 'login' | 'signup'
}

const Auth = ({ onLogin, onBack, defaultMode = 'login' }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(defaultMode === 'login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: ''
  })

  // Test Supabase connection on component mount
  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password)
        if (user) {
          onLogin(user)
        } else {
          setError('Invalid email or password')
        }
      } else {
        const result = await register({
          username: formData.username,
          email: formData.email,
          displayName: formData.displayName,
          password: formData.password
        })
        
        if (result.needsConfirmation) {
          setSuccessMessage(`Account created! Check your email (${formData.email}) for a confirmation link. If no email arrives, the account may still work - try logging in.`)
          setFormData({ email: '', password: '', username: '', displayName: '' })
        } else if (result.user) {
          onLogin(result.user)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Quick login for demo
  const handleQuickLogin = async () => {
    setIsLoading(true)
    try {
      const user = await login('demo@fantasyflix.com', 'demo123')
      if (user) {
        onLogin(user)
      } else {
        setError('Demo login failed. Please try creating a new account.')
      }
    } catch (err: any) {
      setError('Demo login failed. Please try creating a new account.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(/images/hero-background.png)',
          filter: 'brightness(0.4)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      
      {/* Elegant Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-8 left-8 z-20 text-white/80 hover:text-amber-400 transition-all duration-300 flex items-center space-x-2 group"
        >
          <svg className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Experience</span>
        </button>
      )}
      
      <div className="w-full max-w-md mx-auto relative z-10">
        {/* Elegant Header */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <img 
              src="/images/logo.png" 
              alt="Fantasy Flix" 
              className="w-40 h-40 mx-auto mb-6 animate-pulse drop-shadow-2xl object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.3))',
                aspectRatio: '1/1'
              }}
            />
          </div>
          <h1 className="text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
              Fantasy Flix
            </span>
          </h1>
          <p className="text-white/70 text-lg font-light">
            {isLogin ? 'Welcome back to the experience' : 'Join the most exclusive entertainment league'}
          </p>
        </div>

        {/* Premium Auth Card */}
        <div className="bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20 shadow-2xl">
          {/* Error Message */}
          {error && (
            <div className="bg-red-600/20 border border-red-500/50 text-red-300 rounded-2xl p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-600/20 border border-green-500/50 text-green-300 rounded-2xl p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold text-green-200">Welcome to the League!</p>
                  <p className="text-green-300 text-sm mt-1">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex mb-8 bg-black/30 rounded-2xl p-1">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
                setSuccessMessage('')
              }}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-2xl'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Member Access
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
                setSuccessMessage('')
              }}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-2xl'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Join the Elite
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="Choose your username"
                    required={!isLogin}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 backdrop-blur-sm"
                    placeholder="How others will see you"
                    required={!isLogin}
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 backdrop-blur-sm"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-4 bg-black/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl ${
                isLogin 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black'
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
                  {isLogin ? 'Accessing...' : 'Creating Your Legacy...'}
                </span>
              ) : (
                <>
                  {isLogin ? 'Enter the Experience' : 'Begin Your Journey'}
                </>
              )}
            </button>
          </form>

          {/* Demo Login Option */}
          {isLogin && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/90 text-gray-400">Or try our</span>
                </div>
              </div>
              
              <button
                onClick={handleQuickLogin}
                disabled={isLoading}
                className="w-full mt-6 border-2 border-gray-600 hover:border-amber-400/50 text-gray-300 hover:text-amber-400 py-3 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm"
              >
                Demo Experience
              </button>
            </div>
          )}

          {/* Footer Switch */}
          {!successMessage && (
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                {isLogin ? "New to the experience?" : "Already a member?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                    setSuccessMessage('')
                  }}
                  className="text-amber-400 hover:text-amber-300 ml-2 font-medium transition-colors duration-300"
                >
                  {isLogin ? 'Join the elite' : 'Access your account'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle Spotlight Effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
    </div>
  )
}

export default Auth