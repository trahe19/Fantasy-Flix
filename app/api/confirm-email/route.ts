import { NextRequest, NextResponse } from 'next/server'

// Simple token storage - in production, use a database
const pendingConfirmations = new Map<string, {
  email: string
  userData: any
  expires: number
}>()

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing confirmation token' }, { status: 400 })
  }

  const confirmation = pendingConfirmations.get(token)
  
  if (!confirmation) {
    return NextResponse.json({ error: 'Invalid or expired confirmation token' }, { status: 400 })
  }

  if (Date.now() > confirmation.expires) {
    pendingConfirmations.delete(token)
    return NextResponse.json({ error: 'Confirmation token has expired' }, { status: 400 })
  }

  // Token is valid, proceed with account activation
  pendingConfirmations.delete(token)
  
  return NextResponse.json({ 
    success: true, 
    email: confirmation.email,
    message: 'Email confirmed successfully! You can now sign in.' 
  })
}

export async function POST(request: NextRequest) {
  try {
    const { token, email, userData } = await request.json()

    // Store the confirmation with 24 hour expiry
    pendingConfirmations.set(token, {
      email,
      userData,
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}