// Simple local authentication system using localStorage
// Works immediately without external dependencies

export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  total_earnings?: number;
  total_leagues?: number;
  championships?: number;
  created_at: string;
  updated_at: string;
}

const USERS_KEY = 'fantasy-flix-users'
const CURRENT_USER_KEY = 'fantasy-flix-current-user'

// Get all users from localStorage
function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return []
  
  try {
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  } catch {
    return []
  }
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Failed to save users:', error)
  }
}

// Get current user from localStorage
function getCurrentStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

// Save current user to localStorage
function saveCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return
  
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  } catch (error) {
    console.error('Failed to save current user:', error)
  }
}

// Initialize with demo data
function initializeDemoData(): void {
  const existingUsers = getStoredUsers()
  if (existingUsers.length === 0) {
    const demoUsers: User[] = [
      {
        id: 'demo-user-1',
        username: 'fatherflix',
        email: 'demo@fantasyflix.com',
        display_name: 'Father Flix',
        total_earnings: 25420.50,
        total_leagues: 8,
        championships: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'demo-user-2',
        username: 'moviemogul',
        email: 'sarah@example.com',
        display_name: 'Sarah M',
        total_earnings: 18950.25,
        total_leagues: 5,
        championships: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    saveUsers(demoUsers)
  }
}

export async function register(userData: {
  username: string
  email: string
  displayName: string
  password: string
}): Promise<{ user: User | null; needsConfirmation: boolean }> {
  console.log('Local registration for:', userData.email)
  
  // Check if user already exists
  const existingUsers = getStoredUsers()
  const emailExists = existingUsers.some(user => user.email === userData.email)
  const usernameExists = existingUsers.some(user => user.username === userData.username)
  
  if (emailExists) {
    throw new Error('An account with this email already exists')
  }
  
  if (usernameExists) {
    throw new Error('This username is already taken')
  }
  
  // Import email functions dynamically to avoid server-side issues
  const { sendConfirmationEmail, generateConfirmationToken } = await import('./email')
  
  // Generate confirmation token
  const confirmationToken = generateConfirmationToken()
  
  // Create new user (but don't activate yet)
  const newUser: User = {
    id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    username: userData.username,
    email: userData.email,
    display_name: userData.displayName,
    total_earnings: 0,
    total_leagues: 0,
    championships: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // Store pending confirmation
  if (typeof window !== 'undefined') {
    await fetch('/api/confirm-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: confirmationToken,
        email: userData.email,
        userData: newUser
      })
    })
  }
  
  // Send confirmation email
  const emailSent = await sendConfirmationEmail({
    email: userData.email,
    confirmationToken,
    displayName: userData.displayName
  })
  
  if (!emailSent) {
    throw new Error('Failed to send confirmation email. Please try again.')
  }
  
  console.log('Registration initiated, confirmation email sent to:', userData.email)
  
  return {
    user: null, // Don't return user until confirmed
    needsConfirmation: true
  }
}

export async function login(email: string, password: string): Promise<User | null> {
  console.log('Local login for:', email)
  
  const users = getStoredUsers()
  const user = users.find(u => u.email === email)
  
  if (!user) {
    console.log('User not found')
    return null
  }
  
  // For demo purposes, accept any password for existing users
  // In a real app, you'd verify the password hash
  console.log('Login successful:', user)
  
  // Set as current user
  saveCurrentUser(user)
  
  // Trigger auth state change
  triggerAuthStateChange(user)
  
  return user
}

export async function logout(): Promise<void> {
  console.log('Logging out')
  saveCurrentUser(null)
  // Trigger auth state change
  triggerAuthStateChange(null)
}

export async function getCurrentUser(): Promise<User | null> {
  return getCurrentStoredUser()
}

export async function isLoggedIn(): Promise<boolean> {
  const user = getCurrentStoredUser()
  return !!user
}

// Session management with callback support
let authCallbacks: ((user: User | null) => void)[] = []

export function onAuthStateChange(callback: (user: User | null) => void) {
  authCallbacks.push(callback)
  
  // Call immediately with current user
  const currentUser = getCurrentStoredUser()
  callback(currentUser)
  
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          authCallbacks = authCallbacks.filter(cb => cb !== callback)
        }
      }
    }
  }
}

// Trigger auth state change (called after login/logout)
function triggerAuthStateChange(user: User | null): void {
  authCallbacks.forEach(callback => {
    try {
      callback(user)
    } catch (error) {
      console.error('Auth callback error:', error)
    }
  })
}

// Initialize demo data when module loads
if (typeof window !== 'undefined') {
  initializeDemoData()
  
  // Don't auto-login anyone - users must explicitly log in
  console.log('Local auth initialized - users must log in manually')
}

// Complete registration after email confirmation
export async function confirmEmailAndActivateUser(token: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/confirm-email?token=${token}`)
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Email confirmation failed')
    }
    
    // In a real implementation, we'd get the user data from the API response
    // For now, we'll create a simple confirmed user
    const confirmedUser: User = {
      id: 'user-confirmed-' + Date.now(),
      username: data.email.split('@')[0],
      email: data.email,
      display_name: data.email.split('@')[0],
      total_earnings: 0,
      total_leagues: 0,
      championships: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Save user to storage
    const existingUsers = getStoredUsers()
    const updatedUsers = [...existingUsers, confirmedUser]
    saveUsers(updatedUsers)
    
    // Set as current user and trigger auth state change
    saveCurrentUser(confirmedUser)
    triggerAuthStateChange(confirmedUser)
    
    console.log('Email confirmed and user activated:', confirmedUser)
    return confirmedUser
  } catch (error) {
    console.error('Email confirmation failed:', error)
    return null
  }
}