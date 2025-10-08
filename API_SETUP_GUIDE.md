# Fantasy Flix - API Setup & Configuration Guide

## 🔑 Required API Setup

Fantasy Flix requires TMDB (The Movie Database) API access for movie data. This guide walks through the complete setup process.

## 🎬 TMDB API Setup

### Step 1: Create TMDB Account
1. Go to **https://www.themoviedb.org/**
2. Click "Join TMDB" in the top right corner
3. Create a free account (required for API access)
4. Verify your email address

### Step 2: Request API Access
1. **Log into your TMDB account**
2. **Navigate to Settings**:
   - Click on your profile avatar (top right)
   - Select "Settings" from dropdown menu
3. **Go to API Section**:
   - In the left sidebar, click "API"
   - You'll see the API settings page

### Step 3: Generate API Key
1. **Request API Key**:
   - Click "Create" or "Request an API Key"
   - Choose "Developer" (free option)
   - Accept the terms of use

2. **Fill Application Details**:
   - **Application Name**: "Fantasy Flix"
   - **Application URL**: "http://localhost:3000" (or your domain)
   - **Application Summary**: "Fantasy movie league platform for tracking and drafting movies"

3. **Complete Registration**:
   - Submit the form
   - Your API key will be generated instantly

### Step 4: Get Your API Credentials
After approval, you'll have access to:

1. **API Key (v3 auth)** - 32 character string like: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`
2. **Access Token (v4 auth)** - Longer JWT token for advanced features

## 🔧 Environment Configuration

### Create Environment File
1. **In your Fantasy-Flix-Latest folder**, create a file named `.env.local`
2. **Add your API credentials**:

```bash
# TMDB API Configuration (Required)
NEXT_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_actual_access_token_here

# Optional: Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Example Configuration
```bash
# Replace with your actual keys from TMDB
NEXT_PUBLIC_TMDB_API_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYTJiM2M0ZDVlNmY3ZzhoOWkwajFrMmwzbTRuNW82cCIsInN1YiI6IjY1YTJiM2M0ZDVlNmY3ZzhoOWkwaiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.example_token_string

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 📁 File Structure

Your project structure should look like this:
```
Fantasy-Flix-Latest/
├── .env.local              ← Your API keys go here
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── app/
├── components/
├── lib/
├── public/
└── ...other files
```

## 🔒 Security Best Practices

### Environment File Security
- ✅ **Never commit `.env.local`** - It's already in `.gitignore`
- ✅ **Keep API keys private** - Don't share in screenshots or code
- ✅ **Use separate keys for production** - Different keys for dev/prod
- ✅ **Monitor API usage** - Check TMDB dashboard for usage limits

### API Key Permissions
TMDB API keys are **read-only** by default and include:
- ✅ **Movie data access** - All movie information
- ✅ **Search functionality** - Movie and person search
- ✅ **Image access** - Posters, backdrops, profiles
- ✅ **Ratings and reviews** - Community ratings data
- 🚫 **No write access** - Cannot modify TMDB data

## 🌐 API Usage in Fantasy Flix

### What TMDB Powers
Fantasy Flix uses TMDB API for:

1. **🎬 Movie Data**:
   - Movie titles, descriptions, ratings
   - Release dates and box office data
   - Poster images and backdrops
   - Cast and crew information

2. **👥 People Data**:
   - Actor and director profiles
   - Filmographies and career information
   - Profile photos and biographies

3. **📊 Search & Discovery**:
   - Movie search functionality
   - Similar movie recommendations
   - Genre and keyword filtering
   - Trending movies and rankings

4. **🏆 Draft System**:
   - Upcoming movie data for draft
   - Release date filtering
   - Movie popularity and ratings
   - Comprehensive movie analysis

## 📈 API Rate Limits

### TMDB Rate Limits
- **40 requests per 10 seconds**
- **1000 requests per day** (free tier)
- **Automatically enforced** by TMDB

### Fantasy Flix Optimization
Fantasy Flix includes built-in optimizations:
- ✅ **Request caching** - Reduces duplicate API calls
- ✅ **Batch processing** - Efficient data fetching
- ✅ **Error handling** - Graceful fallbacks for rate limits
- ✅ **Loading states** - User feedback during API calls

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. "Invalid API Key" Error
**Problem**: API key is incorrect or not set
**Solution**:
- Double-check your `.env.local` file
- Ensure no extra spaces in API key
- Verify key is active in TMDB dashboard

#### 2. "Rate limit exceeded" Error
**Problem**: Too many API requests
**Solution**:
- Wait 10 seconds and try again
- Check TMDB dashboard for usage
- Consider upgrading to paid tier if needed

#### 3. "Network Error" or "Failed to fetch"
**Problem**: API connection issues
**Solution**:
- Check internet connection
- Verify TMDB API is operational
- Check browser console for detailed errors

#### 4. Images not loading
**Problem**: Image URLs not working
**Solution**:
- Verify API key has image access permissions
- Check browser network tab for blocked requests
- Ensure TMDB image servers are accessible

### Debug Mode
To enable detailed API logging:
1. Open browser developer tools (F12)
2. Check Console tab for API calls
3. Check Network tab for request details
4. Look for error messages and response codes

## ✅ Verification Steps

### Test Your Setup
1. **Start the application**: `npm run dev`
2. **Open browser**: Go to `http://localhost:3000`
3. **Check movie data**: Movies should load with posters and details
4. **Test The Vault**: Upcoming movies should display with TMDB data
5. **Try Draft page**: Movie rankings should appear with real data

### Success Indicators
- ✅ **Movie posters display** - Images load from TMDB
- ✅ **Movie details appear** - Titles, descriptions, ratings show
- ✅ **The Vault populated** - Upcoming movies with analysis
- ✅ **Draft board works** - Top 50 movies with projections
- ✅ **No error messages** - Console shows no API errors

### If Something's Wrong
- Check `.env.local` file exists and has correct keys
- Restart the development server (`npm run dev`)
- Clear browser cache and refresh
- Check browser console for error messages

## 🎯 Production Deployment

### For Production Environment
1. **Create production `.env.local`** or use your platform's environment variables
2. **Use same API keys** (TMDB keys work in all environments)
3. **Update NEXT_PUBLIC_APP_URL** to your production domain
4. **Monitor API usage** in TMDB dashboard

### Platform-Specific Setup

#### Vercel
1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Add: `NEXT_PUBLIC_TMDB_API_KEY` and `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`
4. Deploy project

#### Netlify
1. Go to Netlify dashboard
2. Site Settings → Environment Variables
3. Add environment variables
4. Redeploy site

#### Other Platforms
- Add environment variables through your platform's dashboard
- Ensure variables are prefixed with `NEXT_PUBLIC_`
- Restart/redeploy after adding variables

## 🎉 You're Ready!

Once you've completed this setup:
- ✅ **Fantasy Flix will have full movie data**
- ✅ **All features will work properly**
- ✅ **Draft system will show real upcoming movies**
- ✅ **The Vault will display comprehensive movie analysis**
- ✅ **Actor pages will show complete filmographies**

**Your Fantasy Flix platform is ready to deliver the complete movie league experience!**