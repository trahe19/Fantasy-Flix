-- Fresh Fantasy Flix Database Schema
-- Copy and paste this entire script into Supabase SQL Editor

-- Users table (linked to Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
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
  tmdb_data JSONB,
  box_office_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leagues table
CREATE TABLE leagues (
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

-- League members
CREATE TABLE league_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_score DECIMAL DEFAULT 0,
  current_rank INTEGER,
  UNIQUE(league_id, user_id)
);

-- Drafts table
CREATE TABLE drafts (
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

-- Rosters table
CREATE TABLE rosters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(id),
  position VARCHAR CHECK (position IN ('starter', 'bench')) NOT NULL,
  slot_number INTEGER,
  is_locked BOOLEAN DEFAULT false,
  fantasy_points DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, league_id, slot_number)
);

-- Scoring history
CREATE TABLE scoring_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roster_id UUID REFERENCES rosters(id) ON DELETE CASCADE,
  movie_id INTEGER REFERENCES movies(id),
  scoring_date DATE NOT NULL,
  box_office_gross BIGINT,
  fantasy_points DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- League invitations
CREATE TABLE league_invitations (
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

-- Sample movies
INSERT INTO movies (id, title, release_date, poster_path, overview, vote_average, popularity) VALUES 
(912649, 'Venom: The Last Dance', '2024-10-22', '/aosm8NMQ3UyoBVpSxyimorCQykC.jpg', 'Eddie and Venom are on the run.', 6.8, 3876.433),
(533535, 'Deadpool & Wolverine', '2024-07-24', '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', 'A listless Wade Wilson toils away in civilian life.', 7.7, 2845.123),
(558449, 'Gladiator II', '2024-11-13', '/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg', 'Years after witnessing the death of the revered hero Maximus.', 6.8, 2543.876),
(402431, 'Wicked', '2024-11-20', '/c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg', 'Elphaba and Glinda become extremely unlikely friends.', 8.6, 3456.789),
(1241982, 'Moana 2', '2024-11-27', '/yh64qw9mgXBvlaWDi7Q9tpUBAvH4iodkvo0z5.jpg', 'Moana journeys alongside Maui and a new crew.', 7.0, 4567.890);

-- Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;