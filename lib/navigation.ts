// Navigation utilities for Fantasy Flix
// Handles navigation between movies, actors, and other pages

export interface NavigationContext {
  from?: 'movie' | 'search' | 'browse' | 'actor'
  fromId?: number
  fromTitle?: string
  fromPath?: string
}

// Store navigation context in sessionStorage for back navigation
export function setNavigationContext(context: NavigationContext) {
  try {
    sessionStorage.setItem('fantasyflix_nav_context', JSON.stringify(context))
  } catch (error) {
    console.warn('Could not store navigation context:', error)
  }
}

export function getNavigationContext(): NavigationContext | null {
  try {
    const stored = sessionStorage.getItem('fantasyflix_nav_context')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.warn('Could not retrieve navigation context:', error)
    return null
  }
}

export function clearNavigationContext() {
  try {
    sessionStorage.removeItem('fantasyflix_nav_context')
  } catch (error) {
    console.warn('Could not clear navigation context:', error)
  }
}

// Navigate to actor profile with context
export function navigateToActor(actorId: number, context?: NavigationContext) {
  if (context) {
    setNavigationContext(context)
  }
  window.location.href = `/actor/${actorId}`
}

// Navigate to movie detail with context  
export function navigateToMovie(movieId: number, context?: NavigationContext) {
  if (context) {
    setNavigationContext(context)
  }
  // For now, we don't have dedicated movie pages, so this would open the modal
  // In the future, this could be `/movie/${movieId}`
  console.log(`Navigate to movie ${movieId}`)
}

// Navigate back using stored context
export function navigateBack() {
  const context = getNavigationContext()
  
  if (context?.fromPath) {
    window.location.href = context.fromPath
  } else if (context?.from === 'movie' && context.fromId) {
    navigateToMovie(context.fromId)
  } else {
    // Fallback to browser back or home
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }
  
  clearNavigationContext()
}

// Get a descriptive back button label
export function getBackButtonLabel(): string {
  const context = getNavigationContext()
  
  if (context?.fromTitle) {
    return `Back to ${context.fromTitle}`
  } else if (context?.from === 'movie') {
    return 'Back to Movie'
  } else if (context?.from === 'search') {
    return 'Back to Search'
  } else if (context?.from === 'browse') {
    return 'Back to Browse'
  } else {
    return 'Back'
  }
}

// Check if we have a back navigation available
export function hasBackNavigation(): boolean {
  const context = getNavigationContext()
  return !!(context?.from || context?.fromPath)
}