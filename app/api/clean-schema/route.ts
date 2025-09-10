import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const schemaPath = join(process.cwd(), 'supabase', 'clean-and-rebuild.sql')
    const schemaContent = readFileSync(schemaPath, 'utf-8')
    
    return new Response(schemaContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="fantasy-flix-clean-schema.sql"'
      }
    })
  } catch (error) {
    console.error('Failed to read clean schema file:', error)
    return NextResponse.json({ 
      error: 'Failed to read clean schema file' 
    }, { status: 500 })
  }
}