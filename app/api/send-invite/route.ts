import { NextRequest, NextResponse } from 'next/server'
import { sendLeagueInviteEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, leagueId, leagueName, inviterName } = await request.json()

    if (!email || !leagueId || !leagueName || !inviterName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const success = await sendLeagueInviteEmail({
      email,
      leagueId,
      leagueName,
      inviterName
    })

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Invitation sent successfully!' 
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send invitation email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Send invite API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}