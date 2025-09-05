-- Fantasy Flix Database Schema
-- Run this in your Supabase SQL Editor to create all tables

-- Enable RLS (Row Level Security)
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR NOT NULL,
  avatar_url TEXT,
  total_earnings DECIMAL DEFAULT 0,
  total_leagues INTEGER DEFAULT 0,
  championships INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movies table (stores TMDB data)
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY, -- TMDB ID
  title VARCHAR NOT NULL,
  release_date DATE,
  poster_path TEXT,
  backdrop_path TEXT,
  overview TEXT,
  budget BIGINT,
  revenue BIGINT,
  runtime INTEGER,
  vote_average DECIMAL,
  vote_count INTEGER,
  popularity DECIMAL,
  genre_ids INTEGER[],
  tmdb_data JSONB, -- Store full TMDB response
  box_office_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leagues table
CREATE TABLE IF NOT EXISTS leagues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  max_players INTEGER DEFAULT 12,
  current_players INTEGER DEFAULT 0,
  entry_fee DECIMAL DEFAULT 0,
  prize_pool DECIMAL DEFAULT 0,
  draft_date TIMESTAMP WITH TIME ZONE,
  season_start DATE NOT NULL,
  season_end DATE NOT NULL,
  scoring_system JSONB DEFAULT '{"box_office": 1, "rating_bonus": 25, "popularity_bonus": 10}',
  status VARCHAR CHECK (status IN ('draft', 'active', 'completed')) DEFAULT 'draft',
  is_public BOOLEAN DEFAULT true,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- League members (many-to-many relationship)
CREATE TABLE IF NOT EXISTS league_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_score DECIMAL DEFAULT 0,
  current_rank INTEGER,
  UNIQUE(league_id, user_id)
);

-- Drafts table (track draft picks)
CREATE TABLE IF NOT EXISTS drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(id),
  pick_number INTEGER NOT NULL,
  round INTEGER NOT NULL,
  auto_pick BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(league_id, pick_number)
);

-- Rosters table (current team lineups)
CREATE TABLE IF NOT EXISTS rosters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(id),
  position VARCHAR CHECK (position IN ('starter', 'bench')) NOT NULL,
  slot_number INTEGER, -- 1-5 for starters, 6-10 for bench
  is_locked BOOLEAN DEFAULT false, -- locked when movie is released
  fantasy_points DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, league_id, slot_number)
);

-- Scoring history (track daily/weekly scoring updates)
CREATE TABLE IF NOT EXISTS scoring_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roster_id UUID REFERENCES rosters(id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(id),
  scoring_date DATE NOT NULL,
  box_office_gross BIGINT,
  fantasy_points DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- League invitations
CREATE TABLE IF NOT EXISTS league_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  inviter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  token UUID DEFAULT gen_random_uuid(),
  status VARCHAR CHECK (status IN ('pending', 'accepted', 'declined', 'expired')) DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_league_members_league_id ON league_members(league_id);
CREATE INDEX IF NOT EXISTS idx_league_members_user_id ON league_members(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_league_id ON drafts(league_id);
CREATE INDEX IF NOT EXISTS idx_rosters_user_league ON rosters(user_id, league_id);
CREATE INDEX IF NOT EXISTS idx_rosters_league_id ON rosters(league_id);
CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies(release_date);
CREATE INDEX IF NOT EXISTS idx_scoring_history_date ON scoring_history(scoring_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leagues_updated_at BEFORE UPDATE ON leagues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rosters_updated_at BEFORE UPDATE ON rosters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (email, username, display_name, total_earnings, total_leagues, championships) VALUES 
('demo@fantasyflix.com', 'boxofficelegend', 'BoxOfficeLegend', 25420.50, 8, 3),
('sarah@example.com', 'moviemogul', 'Sarah M', 18950.25, 5, 1),
('mike@example.com', 'filmfanatic', 'Mike Chen', 12300.75, 4, 0),
('emma@example.com', 'cinemaqueen', 'Emma Rodriguez', 31200.00, 12, 5),
('alex@example.com', 'blockbusterbro', 'Alex Thompson', 8750.50, 3, 0)
ON CONFLICT (email) DO NOTHING;

-- Insert sample movies (current popular films)
INSERT INTO movies (id, title, release_date, poster_path, overview, vote_average, popularity) VALUES 
(912649, 'Venom: The Last Dance', '2024-10-22', '/aosm8NMQ3UyoBVpSxyimorCQykC.jpg', 'Eddie and Venom are on the run.', 6.8, 3876.433),
(533535, 'Deadpool & Wolverine', '2024-07-24', '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', 'A listless Wade Wilson toils away in civilian life.', 7.7, 2845.123),
(558449, 'Gladiator II', '2024-11-13', '/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg', 'Years after witnessing the death of the revered hero Maximus.', 6.8, 2543.876),
(402431, 'Wicked', '2024-11-20', '/c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg', 'Elphaba and Glinda become extremely unlikely friends.', 8.6, 3456.789),
(1241982, 'Moana 2', '2024-11-27', '/yh64qw9mgXBvlaWDi7Q9tpUBAvH.jpg', 'Moana journeys alongside Maui and a new crew.', 7.0, 4567.890)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (optional - for production)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rosters ENABLE ROW LEVEL SECURITY;

-- Grant permissions for anon users (adjust as needed)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;