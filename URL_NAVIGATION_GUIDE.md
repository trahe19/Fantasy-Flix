# Fantasy Flix - Complete URL Structure & Navigation Guide

## 🌐 Application URL Structure

This guide provides Tyler with the complete URL structure and navigation paths for the Fantasy Flix platform.

## 🏠 **Base URL**
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## 🧭 **Main Navigation Structure**

### Primary Navigation Bar
The top navigation provides access to all major sections:

1. **🏠 Dashboard** - `http://localhost:3000/`
2. **🏆 Draft** - `http://localhost:3000/draft`
3. **📊 2025 Leaders** - `http://localhost:3000/` (Leaders view)
4. **⚙️ More** - Dropdown with additional options

### Dashboard Views (Single Page with View States)
The dashboard uses view states rather than separate URLs:
- **Dashboard View** - Default landing view
- **My Team → My Roster** - Roster management view
- **My Team → My Leagues** - League management view
- **My Team → 🏛️ The Vault** - Movie discovery view
- **2025 Leaders** - Profit leaders view
- **History** - League history view

## 📄 **Complete Page Structure**

### 🏠 **Dashboard System** (`/`)
**Main URL**: `http://localhost:3000/`

The dashboard is a single-page application with multiple views:

#### View States:
- **Default Dashboard** - League overview, standings, recent activity
- **My Roster** - Roster management, lineup setting, player stats
- **My Leagues** - League selection, league settings, multi-league management
- **The Vault** - Movie discovery, upcoming movies, scouting reports
- **2025 Leaders** - Profit leaders, performance rankings, analytics
- **History** - League history, transaction log, season archives

### 🏆 **Draft System** (`/draft`)
**Main URL**: `http://localhost:3000/draft`

Professional snake draft interface with:
- Live draft board with top 50 movies
- Real-time timer and pick tracking
- Player order and draft history
- Movie analysis and selection tools

### 🎬 **Movie Pages**
#### Individual Movie Details
**URL Pattern**: `http://localhost:3000/movie/[movieId]`

**Examples**:
- `http://localhost:3000/movie/502356` - The Super Mario Bros. Movie
- `http://localhost:3000/movie/447365` - Guardians of the Galaxy Vol. 3
- `http://localhost:3000/movie/298618` - The Flash

**Features**:
- Complete movie analysis with trailers
- Cast and crew information
- Box office performance data
- Similar movie recommendations

#### Vault Movie Analysis Pages
**URL Pattern**: `http://localhost:3000/vault/movie/[movieId]`

**Examples**:
- `http://localhost:3000/vault/movie/83533` - Avatar: Fire and Ash
- `http://localhost:3000/vault/movie/1061474` - Superman
- `http://localhost:3000/vault/movie/558449` - Gladiator 2

**Features**:
- Comprehensive draft analysis
- Box office projections and Oscar potential
- Risk assessment and scouting reports
- Draft potential scoring

### 👥 **Actor Pages**
**URL Pattern**: `http://localhost:3000/actor/[actorId]`

**Examples**:
- `http://localhost:3000/actor/31` - Tom Hanks
- `http://localhost:3000/actor/6384` - Keanu Reeves
- `http://localhost:3000/actor/1245` - Scarlett Johansson

**Features**:
- Complete filmography and career stats
- Upcoming movies and projects
- Box office performance history
- Biography and career highlights

## 🎯 **Feature Access Paths**

### How to Access Key Features

#### 🏛️ **The Vault**
1. **Go to**: `http://localhost:3000/`
2. **Click**: "My Team" dropdown in top navigation
3. **Select**: "🏛️ The Vault"
4. **Result**: Movie discovery interface loads

**Or use direct navigation within the dashboard view state**

#### 🏆 **Draft Room**
1. **Go to**: `http://localhost:3000/draft`
2. **Or click**: "🏆 Draft" button in top navigation
3. **Result**: Professional draft interface with live timer

#### 📊 **Performance Analytics**
1. **Go to**: `http://localhost:3000/`
2. **Click**: "2025 Leaders" in top navigation
3. **Result**: Profit leaders board with performance data

#### 🎬 **Movie Analysis**
1. **From any movie poster**: Click to open detailed analysis
2. **From The Vault**: Click "📊 View Analysis" button
3. **From Draft**: Click movie poster for scouting report
4. **Direct URL**: `/movie/[movieId]` or `/vault/movie/[movieId]`

## 🔗 **URL Parameters & Query Strings**

### Movie URLs
- **Basic Movie**: `/movie/123456`
- **With Analysis**: `/vault/movie/123456`
- **With Trailer**: `/movie/123456?showTrailer=true`

### Actor URLs
- **Basic Actor**: `/actor/12345`
- **With Filmography**: `/actor/12345?view=filmography`

### Dashboard Views
- **Specific View**: `/?view=vault`
- **League Context**: `/?league=father-flix`

## 📱 **Mobile Navigation**

### Mobile-Specific Features
- **Responsive Navigation**: Collapsible menu system
- **Touch-Optimized**: Larger tap targets and swipe gestures
- **Progressive Web App**: Can be installed as mobile app
- **Full Feature Parity**: All desktop features available on mobile

### Mobile URL Structure
All URLs work identically on mobile devices with responsive design adaptation.

## 🔍 **Search & Discovery**

### Movie Search
- **Global Search**: Available from search icon in top navigation
- **The Vault Search**: Built-in search within vault interface
- **Filter URLs**: Maintain state for filtered movie lists

### Navigation Breadcrumbs
- **Movie Pages**: Fantasy Flix > Movies > [Movie Title]
- **Actor Pages**: Fantasy Flix > People > [Actor Name]
- **Draft Pages**: Fantasy Flix > Draft > October 2025

## ⚙️ **Admin & Settings**

### League Management
- **Access**: Through "My Team" → "My Leagues"
- **Features**: League creation, player management, settings
- **URL Context**: Maintains current league in navigation state

### User Settings
- **Profile Management**: Accessible through user avatar dropdown
- **Preferences**: Theme, notification, and display settings
- **League Switching**: Quick league selection from navigation

## 📊 **Analytics & Reporting URLs**

### Performance Pages
- **Profit Leaders**: Main dashboard with leaders view
- **Box Office Charts**: Integrated into movie detail pages
- **Transaction History**: Accessible through dashboard history view
- **Season Archives**: Historical data through history section

### Real-time Data
- **Live Updates**: All pages include real-time data refresh
- **WebSocket Integration**: Live draft updates and league activity
- **Caching Strategy**: Intelligent caching for improved performance

## 🎮 **Game Features Navigation**

### Draft System
- **Pre-Draft**: Setup and configuration interface
- **Live Draft**: Real-time drafting with timer and picks
- **Post-Draft**: Results and analysis review

### League Play
- **Roster Management**: Lineup setting and player management
- **Transaction System**: Trades, waivers, and free agency
- **Scoring Tracking**: Real-time score updates and standings

## 🔒 **Authentication & Security**

### Login System
- **Authentication**: Prepared for user login system
- **Session Management**: Secure session handling
- **Authorization**: Role-based access control ready

### API Security
- **TMDB Integration**: Secure API key management
- **Rate Limiting**: Built-in API rate limiting
- **Error Handling**: Graceful error recovery

## 📈 **SEO & Performance**

### Search Engine Optimization
- **Clean URLs**: SEO-friendly URL structure
- **Meta Tags**: Comprehensive meta tag system
- **Sitemap Ready**: Prepared for sitemap generation
- **Social Sharing**: Open Graph and Twitter Card support

### Performance Features
- **Fast Loading**: Optimized page load times
- **Code Splitting**: Automatic code splitting for faster loads
- **Image Optimization**: Next.js Image component optimization
- **Caching**: Intelligent browser and API caching

## 🎯 **Quick Reference**

### Most Important URLs for Tyler
1. **🏠 Main App**: `http://localhost:3000/`
2. **🏆 Draft**: `http://localhost:3000/draft`
3. **🎬 Movie Example**: `http://localhost:3000/movie/502356`
4. **👥 Actor Example**: `http://localhost:3000/actor/31`
5. **🏛️ Vault Movie**: `http://localhost:3000/vault/movie/83533`

### Testing Navigation
1. **Start server**: `npm run dev`
2. **Open browser**: Go to `http://localhost:3000`
3. **Test all navigation**: Use top menu and dropdowns
4. **Click movie posters**: Access detailed movie pages
5. **Try draft system**: Go to `/draft` for draft interface

## ✅ **Navigation Checklist**

### Verify These Work:
- [ ] Main dashboard loads at `/`
- [ ] All navigation menu items respond
- [ ] Movie posters click through to detail pages
- [ ] Draft page loads and displays movies
- [ ] The Vault shows upcoming movies with analysis
- [ ] Actor links work from movie pages
- [ ] Search functionality works
- [ ] Mobile navigation adapts properly
- [ ] Back/forward browser buttons work correctly
- [ ] URLs are bookmarkable and shareable

## 🎉 **Complete Navigation System**

Fantasy Flix includes a **comprehensive navigation system** with:
- ✅ **Intuitive URL structure** - Clean, logical paths
- ✅ **Deep linking support** - All content is directly linkable
- ✅ **Mobile optimization** - Full responsive navigation
- ✅ **SEO friendly** - Search engine optimized URLs
- ✅ **Fast navigation** - Optimized routing and loading
- ✅ **Breadcrumb trails** - Clear navigation context
- ✅ **Back button support** - Proper browser history handling

**Tyler gets a professional navigation system that works exactly like major sports and entertainment platforms!**