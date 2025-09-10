'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ConfirmEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid confirmation link')
      return
    }

    // Call the API to confirm the email
    fetch(`/api/confirm-email?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          setMessage(data.message)
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Confirmation failed')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error occurred')
      })
  }, [token, router])

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
            Email Confirmation
          </p>
        </div>

        <div className="glass-elegant rounded-3xl p-8 text-center">
          {status === 'loading' && (
            <div>
              <div className="animate-spin h-8 w-8 mx-auto mb-4">
                <svg className="text-blue-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-gray-300">Confirming your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-green-400 mb-4">Email Confirmed!</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              <p className="text-sm text-gray-400">Redirecting you to sign in...</p>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-400 mb-4">Confirmation Failed</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="gradient-blue text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-dark flex flex-col items-center justify-center p-4">
        <div className="animate-spin h-8 w-8">
          <svg className="text-blue-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}