'use client'

import { useState } from 'react'
import { login, register, User } from '../lib/auth'

interface AuthProps {
  onLogin: (user: User) => void
}

const Auth = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password)
        if (user) {
          onLogin(user)
        } else {
          setError('Invalid email or password')
        }
      } else {
        const user = await register({
          username: formData.username,
          email: formData.email,
          displayName: formData.displayName
        })
        onLogin(user)
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
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
    const user = await login('grant.geyer@icloud.com', 'demo123')
    if (user) {
      onLogin(user)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen gradient-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-40 right-40 w-72 h-72 bg-indigo-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '4s' }} />
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block animate-glow rounded-full p-1 mb-6">
            <span className="text-6xl">🎬</span>
          </div>
          <h1 className="text-5xl font-black mb-4 text-gradient-silver">
            Fantasy Flix
          </h1>
          <p className="text-gray-300 font-light">
            {isLogin ? 'Welcome back, Champion' : 'Join the elite league'}
          </p>
        </div>

        <div className="glass-elegant rounded-3xl p-8">
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 rounded-xl p-3 mb-6">
              {error}
            </div>
          )}

          <div className="flex mb-6">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                isLogin
                  ? 'gradient-blue text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                !isLogin
                  ? 'gradient-blue text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Your username"
                    required={!isLogin}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Your display name"
                    required={!isLogin}
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-blue text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or</span>
                </div>
              </div>
              
              <button
                onClick={handleQuickLogin}
                disabled={isLoading}
                className="w-full mt-4 glass border border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-medium hover:card-glow transition-all"
              >
                Quick Demo Login
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="text-blue-400 hover:text-blue-300 ml-1"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth