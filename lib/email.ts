// Email functionality - optional dependency on Resend
let resend: any = null

// Initialize Resend only if API key is available
if (process.env.RESEND_API_KEY) {
  try {
    const { Resend } = require('resend')
    resend = new Resend(process.env.RESEND_API_KEY)
  } catch (error) {
    console.warn('Resend not available - email functionality disabled')
  }
}

export interface EmailConfirmationData {
  email: string
  confirmationToken: string
  displayName: string
}

export async function sendConfirmationEmail(data: EmailConfirmationData): Promise<boolean> {
  try {
    // For development, if no API key is set or resend is not available, just log the email
    if (!process.env.RESEND_API_KEY || !resend) {
      console.log('📧 Email Confirmation (Development Mode)')
      console.log('To:', data.email)
      console.log('Name:', data.displayName)
      console.log('Confirmation URL:', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/confirm-email?token=${data.confirmationToken}`)
      console.log('Click the link above to confirm your email address')
      return true
    }

    const confirmationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/confirm-email?token=${data.confirmationToken}`
    
    await resend.emails.send({
      from: 'Fantasy Flix <noreply@fantasyflix.com>',
      to: [data.email],
      subject: 'Welcome to Fantasy Flix - Confirm your email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px;">🎬 Fantasy Flix</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">The Ultimate Movie Fantasy League</p>
          </div>
          
          <div style="padding: 40px 30px; background: #f8fafc;">
            <h2 style="color: #1e293b; margin-top: 0;">Welcome to the League, ${data.displayName}! 🏆</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              You're just one click away from joining the most exciting fantasy movie league! 
              Click the button below to confirm your email address and start building your winning roster.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" 
                 style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3);">
                Confirm Email Address
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, you can also click this link:<br>
              <a href="${confirmationUrl}" style="color: #3b82f6; word-break: break-all;">${confirmationUrl}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              This email was sent because you registered for Fantasy Flix. 
              If you didn't create an account, please ignore this email.
            </p>
          </div>
        </div>
      `
    })

    console.log('✅ Confirmation email sent to:', data.email)
    return true
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error)
    return false
  }
}

export function generateConfirmationToken(): string {
  return 'confirm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16)
}