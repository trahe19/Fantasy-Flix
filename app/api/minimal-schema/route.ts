import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const schemaPath = join(process.cwd(), 'supabase', 'minimal-schema.sql')
    const schemaContent = readFileSync(schemaPath, 'utf-8')
    
    return new Response(schemaContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="fantasy-flix-minimal-schema.sql"'
      }
    })
  } catch (error) {
    console.error('Failed to read minimal schema file:', error)
    return NextResponse.json({ 
      error: 'Failed to read minimal schema file' 
    }, { status: 500 })
  }
}