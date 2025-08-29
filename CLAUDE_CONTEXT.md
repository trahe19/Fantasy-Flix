# Claude Context - Box Office Bets Project

## 🎯 Project Overview
**Name**: Box Office Bets (formerly Grant's Sexy Time Movie League)
**Type**: Fantasy Movie League Web Application
**Status**: Active Development
**Dev Server**: Running on http://localhost:3002

## 📁 Project Structure
```
C:\Users\evane\Code\fantasy-movie-league\
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main landing/login page
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles and utilities
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard with leagues
│   ├── DraftRoom.tsx      # Live draft interface
│   ├── RosterManagement.tsx # Drag-drop roster
│   ├── UserProfile.tsx    # User profile modals
│   └── MovieDetail.tsx    # Movie detail modals
├── lib/
│   └── supabase.ts        # Supabase configuration
├── supabase/
│   └── migrations/        # Database schema
└── package.json           # Dependencies
```

## 🎨 Current Design System

### Color Palette (Updated - Less Purple)
- **Primary**: Blue (#3b82f6) - Main actions
- **Secondary**: Cyan (#06b6d4) - Accents
- **Gold**: (#FFD700) - Special/premium
- **Dark**: Gray variants for backgrounds
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)

### Gradients
- `gradient-blue`: Blue to lighter blue
- `gradient-gold`: Gold to orange
- `gradient-dark`: Dark grays
- `gradient-subtle`: Subtle gray gradient

### Effects
- `glass`: Glassmorphism effect
- `glass-dark`: Dark glassmorphism
- `card-glow`: Subtle blue glow (replaced neon-glow)
- `card-glow-hover`: Stronger glow on hover

## 🔧 Recent Changes

### Session Summary
1. **Initial Creation**: Built full fantasy movie league app
2. **Rebranding**: Changed from "Grant's Sexy Time" to "Box Office Bets"
3. **Feature Additions**:
   - User profiles (click usernames)
   - Movie details (click movie titles)
   - Working drag-and-drop roster management
   - Browse leagues modal
   - League details modal
4. **Color Update**: Reduced purple, added more blues/grays for modern look

### Known Issues Fixed
- ✅ Runtime error on login
- ✅ Import path issues
- ✅ Excessive opacity on modals
- ✅ Purple color overload

### Test Data
- Demo login: demo@boxofficebets.com / demo123
- Top user: BoxOfficeLegend (was GrantTheGOAT)
- League names updated to be generic

## 🚀 Features Implemented

### Core Features
1. **Authentication Flow** (demo only)
2. **Dashboard** with stats, leagues, live feed
3. **Roster Management** with drag-and-drop
4. **Draft Room** with timer and chat
5. **User Profiles** with stats and achievements
6. **Movie Details** with projections

### Interactive Elements
- Click usernames → User profile modal
- Click movie titles → Movie detail modal
- Drag movies between roster slots
- "Enter League" → League details
- "Browse Public Leagues" → Browse modal
- "Create Elite League" → Create modal

## 📝 Next Steps & TODOs

### Immediate
- [ ] Finish updating remaining purple references in components
- [ ] Test all modals and interactions
- [ ] Add error handling for drag-drop

### Future Features
- [ ] Real Supabase integration
- [ ] TMDB API for movie data
- [ ] WebSocket for real-time draft
- [ ] Mobile responsive improvements
- [ ] Animation performance optimization

## 🔌 API Keys Needed
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
TMDB_API_KEY=your_tmdb_key
```

## 💻 Development Commands
```bash
# Current directory
cd C:\Users\evane\Code\fantasy-movie-league

# Run dev server (currently on port 3002)
npm run dev

# Build for production
npm run build
```

## 🐛 Debugging Notes
- Server running on port 3002 (3000 and 3001 were busy)
- Using relative imports for components (../components/)
- No external dependencies for drag-drop (using native HTML5)

## 🎯 User Testing Feedback
- "Overdid it on purple" - Fixed with blue/gray palette
- Buttons work properly now
- Drag-drop functional with confirmation
- All modals accessible

## 📊 Component State

### Working
- Login flow
- Dashboard with all features
- User profiles
- Movie details
- Drag and drop roster
- All buttons and modals

### Needs Polish
- Mobile responsiveness
- Loading states
- Error boundaries
- Performance optimization

## 🔄 Session Recovery
To continue development:
1. Navigate to: `C:\Users\evane\Code\fantasy-movie-league`
2. Server should be on http://localhost:3002
3. Main files to edit are in `/app` and `/components`
4. Color scheme uses blues/grays now, not purple
5. App is called "Box Office Bets"

## 📌 Important Notes
- User modified Dashboard.tsx line 15: league name to 'WHATEVER' (intentional)
- Reduced purple theme per user request
- All "Grant" references removed
- Professional branding throughout

---

**Last Updated**: Current session
**Claude Model**: Opus 4.1
**User**: evane
**Project Status**: Active development, functional demo