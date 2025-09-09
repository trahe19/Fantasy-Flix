import { User } from './auth'

// Temporary fallback auth for testing when Supabase isn't configured
export async function registerFallback(userData: {
  username: string
  email: string
  displayName: string
  password: string
}): Promise<{ user: User | null; needsConfirmation: boolean }> {
  console.log('Using fallback registration for:', userData.email)
  
  // Simulate a successful registration
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  
  const mockUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    username: userData.username,
    email: userData.email,
    display_name: userData.displayName,
    total_earnings: 0,
    total_leagues: 0,
    championships: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  console.log('Fallback registration successful:', mockUser)
  
  return {
    user: mockUser,
    needsConfirmation: false
  }
}

export async function loginFallback(email: string, password: string): Promise<User | null> {
  console.log('Using fallback login for:', email)
  
  // Check if this matches our demo user
  if (email === 'demo@fantasyflix.com' && password === 'demo123') {
    const demoUser: User = {
      id: 'demo-user-id',
      username: 'demouser',
      email: 'demo@fantasyflix.com',
      display_name: 'Demo User',
      total_earnings: 1500,
      total_leagues: 3,
      championships: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Fallback login successful:', demoUser)
    return demoUser
  }
  
  // For now, accept any email/password combo for testing
  if (email && password) {
    const mockUser: User = {
      id: 'mock-' + email.replace('@', '-').replace('.', '-'),
      username: email.split('@')[0],
      email: email,
      display_name: email.split('@')[0],
      total_earnings: 0,
      total_leagues: 0,
      championships: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Fallback login successful:', mockUser)
    return mockUser
  }
  
  return null
}