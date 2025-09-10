import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Initializing Supabase database tables...')
    
    // Check if tables already exist by trying to select from users table
    const { data, error: selectError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (!selectError) {
      return NextResponse.json({ 
        success: true, 
        message: 'Database tables already exist and are ready to use!' 
      })
    }
    
    console.log('Tables do not exist, they need to be created via Supabase SQL Editor')
    
    return NextResponse.json({ 
      success: false, 
      message: 'Database tables need to be created. Please run the schema.sql file in your Supabase SQL Editor.',
      instructions: [
        '1. Go to your Supabase project dashboard',
        '2. Navigate to the SQL Editor',
        '3. Copy and paste the contents of supabase/schema.sql',
        '4. Run the SQL script to create all tables',
        '5. Try this endpoint again to verify setup'
      ]
    }, { status: 400 })
    
  } catch (error: any) {
    console.error('Database initialization failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Database initialization failed',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check database connection and table status
    const { data: usersCheck, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    const { data: leaguesCheck, error: leaguesError } = await supabase
      .from('leagues')
      .select('count')
      .limit(1)
    
    const { data: moviesCheck, error: moviesError } = await supabase
      .from('movies')
      .select('count')
      .limit(1)
    
    const status = {
      users_table: !usersError ? 'OK' : 'ERROR',
      leagues_table: !leaguesError ? 'OK' : 'ERROR', 
      movies_table: !moviesError ? 'OK' : 'ERROR',
      connection: 'OK'
    }
    
    const allTablesReady = !usersError && !leaguesError && !moviesError
    
    return NextResponse.json({
      success: allTablesReady,
      status,
      message: allTablesReady 
        ? 'All database tables are ready!' 
        : 'Some database tables are missing. Run the schema.sql in Supabase SQL Editor.',
      errors: {
        users: usersError?.message,
        leagues: leaguesError?.message,
        movies: moviesError?.message
      }
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      status: { connection: 'ERROR' },
      error: 'Failed to check database status',
      details: error.message 
    }, { status: 500 })
  }
}