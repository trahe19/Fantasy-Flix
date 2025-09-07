'use client'

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'original'

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light')

  useEffect(() => {
    // Check if user has a preference stored
    const savedTheme = localStorage.getItem('theme') as Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    let theme: Theme = savedTheme || (prefersDark ? 'dark' : 'light')
    setCurrentTheme(theme)
    applyTheme(theme)
  }, [])

  const applyTheme = (theme: Theme) => {
    // Remove all theme classes
    document.documentElement.classList.remove('dark', 'original')
    
    // Add the appropriate class
    if (theme !== 'light') {
      document.documentElement.classList.add(theme)
    }
  }

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'original']
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    
    setCurrentTheme(nextTheme)
    applyTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
  }

  const getIcon = () => {
    switch (currentTheme) {
      case 'light':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      case 'dark':
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )
      case 'original':
        return (
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
          </svg>
        )
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded glass hover:card-glow transition-all duration-200 flex items-center space-x-2"
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'original' : 'light'} theme`}
    >
      {getIcon()}
      <span className="text-xs font-medium capitalize hidden sm:inline">
        {currentTheme}
      </span>
    </button>
  )
}

export default ThemeToggle