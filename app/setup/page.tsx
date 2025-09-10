'use client'

import { useState, useEffect } from 'react'

interface DatabaseStatus {
  success: boolean
  status: {
    users_table: string
    leagues_table: string
    movies_table: string
    connection: string
  }
  message: string
  errors?: {
    users?: string
    leagues?: string
    movies?: string
  }
}

export default function SetupPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/init-db')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to check database status:', error)
    } finally {
      setLoading(false)
    }
  }

  const copySchemaToClipboard = async () => {
    try {
      const response = await fetch('/api/schema')
      const schemaText = await response.text()
      await navigator.clipboard.writeText(schemaText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy schema:', error)
      alert('Failed to copy schema. Please manually copy from supabase/schema.sql')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking database status...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🎬 Fantasy Flix Database Setup
        </h1>

        {/* Status Display */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Database Status</h2>
          
          {status && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Connection:</span>
                <span className={`px-3 py-1 rounded ${
                  status.status.connection === 'OK' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {status.status.connection}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Users Table:</span>
                <span className={`px-3 py-1 rounded ${
                  status.status.users_table === 'OK' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {status.status.users_table}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Leagues Table:</span>
                <span className={`px-3 py-1 rounded ${
                  status.status.leagues_table === 'OK' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {status.status.leagues_table}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Movies Table:</span>
                <span className={`px-3 py-1 rounded ${
                  status.status.movies_table === 'OK' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                  {status.status.movies_table}
                </span>
              </div>

              <div className="mt-4 p-4 bg-gray-700 rounded">
                <strong>Status:</strong> {status.message}
              </div>
            </div>
          )}

          <button
            onClick={checkDatabaseStatus}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            Refresh Status
          </button>
        </div>

        {/* Setup Instructions */}
        {status && !status.success && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Setup Instructions</h2>
            
            <div className="space-y-4">
              <p className="text-gray-300">
                Your Supabase database tables need to be created. Follow these steps:
              </p>
              
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Go to your <a 
                  href="https://xvlqxmarcxgabdadfwcb.supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Supabase project dashboard
                </a></li>
                <li>Navigate to the <strong>SQL Editor</strong> tab</li>
                <li>Click the button below to copy the database schema</li>
                <li>Paste the schema into the SQL Editor</li>
                <li>Click <strong>Run</strong> to execute the SQL</li>
                <li>Come back here and refresh the status</li>
              </ol>

              <div className="bg-gray-700 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Database Schema</h3>
                  <button
                    onClick={copySchemaToClipboard}
                    className={`px-4 py-2 rounded transition-colors ${
                      copied 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {copied ? '✅ Copied!' : '📋 Copy Schema'}
                  </button>
                </div>
                
                <div className="text-sm text-gray-400">
                  Click the copy button above, then paste into your Supabase SQL Editor.
                </div>
              </div>
              
              <div className="bg-yellow-900 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-400">
                      Important Note
                    </h3>
                    <div className="mt-2 text-sm text-yellow-300">
                      <p>
                        Once you run the SQL schema, Fantasy Flix will automatically switch from localStorage 
                        to Supabase for all user data and leagues. This means your data will persist across 
                        devices and browsers!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {status && status.success && (
          <div className="bg-green-900 border-l-4 border-green-400 p-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-green-400">
                  Database Ready! 🎉
                </h3>
                <div className="mt-2 text-sm text-green-300">
                  <p>
                    All database tables are set up correctly. Fantasy Flix is now using Supabase 
                    for persistent data storage. You can now:
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Create user accounts that persist across devices</li>
                    <li>Create leagues that are stored in the database</li>
                    <li>Invite other users via email</li>
                    <li>Access your data from any browser</li>
                  </ul>
                  <div className="mt-4">
                    <a
                      href="/"
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors inline-block"
                    >
                      🎬 Go to Fantasy Flix
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}