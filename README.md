# 🎬 Fantasy Flix - Fantasy Movie League

A sophisticated fantasy movie league application where users draft movies, compete based on real box office performance, and climb the leaderboards to become cinema champions.

## 🚀 Quick Start for Team Members

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/trahe19/Fantasy-Flix.git
cd Fantasy-Flix

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Access the App
- **Local**: http://localhost:3000
- **Network** (for team sharing): http://YOUR_IP:3000

### 3. Demo Login
- **Email**: demo@fantasyflix.com
- **Password**: demo123

## 🌐 Team Collaboration Setup

### For Network Access (Same WiFi)
```bash
# Start server accessible to team members
npm run dev -- --hostname 0.0.0.0
```
Then share: `http://YOUR_IP:3000`

### For Remote Access (Different Networks)
1. **Push to GitHub** (after authentication)
2. **Deploy to Vercel** for live access
3. **Team members clone and run locally**

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main landing/login page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── DraftRoom.tsx      # Live draft interface
│   ├── RosterManagement.tsx # Drag-drop roster
│   ├── UserProfile.tsx    # User profiles
│   └── MovieDetail.tsx    # Movie details
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
└── CLAUDE_CONTEXT.md     # Development context
```

## 🎯 Features

### ✅ Implemented
- **Authentication Flow** - Demo login system
- **Dashboard** - Stats, leagues, live feed
- **Roster Management** - Drag-and-drop interface
- **Draft Room** - Live drafting with timer
- **User Profiles** - Click usernames to view
- **Movie Details** - Click movie titles for info
- **Responsive Design** - Works on all devices

### 🔮 Planned
- Real Supabase integration
- TMDB API for movie data
- WebSocket for real-time features
- Mobile app version

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Features**: HTML5 Drag & Drop, Modals, Animations
- **Development**: Hot reload, TypeScript checking

## 🎨 Design System

### Colors
- **Primary Blue**: #3b82f6
- **Accent Cyan**: #06b6d4  
- **Gold**: #FFD700
- **Success Green**: #10b981

### CSS Classes
- `glass` - Glassmorphism effect
- `card-glow` - Subtle blue glow
- `gradient-blue` - Blue gradients

## 🔧 Development Workflow

### Daily Workflow
```bash
# Pull latest changes
git pull origin main

# Make your changes...

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

### Available Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Code linting
```

## 📱 Interactive Elements

- **Click usernames** → User profile modal
- **Click movie titles** → Movie detail modal
- **Drag movies** between roster slots
- **"Enter League"** → League details
- **"Browse Leagues"** → Browse modal

## 🔐 GitHub Setup

To push to GitHub, you'll need to authenticate:

```bash
# Option 1: Use GitHub CLI
gh auth login

# Option 2: Use Personal Access Token
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/trahe19/Fantasy-Flix.git

# Then push
git push -u origin main
```

## 🌍 Deployment Options

### 1. Vercel (Recommended)
- Connect GitHub repo to Vercel
- Automatic deployments on push
- Live URL for team access

### 2. Local Network
- Use `--hostname 0.0.0.0` flag
- Team accesses via your IP
- Works only when your machine is online

## 🤝 Contributing

1. **Pull latest changes** before starting work
2. **Test thoroughly** before committing  
3. **Use descriptive commit messages**
4. **Communicate with team** about major changes

## 📄 Current Status

**Version**: 2.0.0  
**Status**: Active Development  
**Demo**: Functional with sample data  
**Team Access**: ✅ Ready for collaboration

---

**🎬 Ready to build the ultimate movie league experience!**