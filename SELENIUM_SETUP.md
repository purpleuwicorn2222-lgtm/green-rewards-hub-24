# Selenium Setup Guide - Quick Start

This guide will help you set up the Selenium-based product search (free alternative to Google API).

## Quick Setup (5 minutes)

### Step 1: Install Backend Dependencies

```bash
npm run server:install
```

Or manually:
```bash
cd server
npm install
```

### Step 2: Install Chrome Browser

The scraper needs Chrome to run. If you don't have it:

**macOS:**
```bash
brew install --cask google-chrome
```

**Linux:**
```bash
sudo apt-get install google-chrome-stable
```

**Windows:**
Download from https://www.google.com/chrome/

### Step 3: Start the Backend Server

In a separate terminal, run:
```bash
npm run server:dev
```

Or manually:
```bash
cd server
npm run dev
```

You should see:
```
🚀 Eco Shopping Backend running on http://localhost:3001
📡 Ready to handle product searches
```

### Step 4: Start the Frontend

In another terminal (keep the backend running), start the frontend:
```bash
npm run dev
```

### Step 5: Test the Search

1. Open your browser to the frontend URL (usually http://localhost:5173)
2. Try searching for "eco-friendly t-shirt"
3. You should see real-time product results!

## Running Both Servers

You need **two terminals**:

**Terminal 1 - Backend:**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Troubleshooting

### "Cannot connect to backend server"

- Make sure the backend is running on port 3001
- Check that you see the "🚀 Eco Shopping Backend running" message
- Try accessing http://localhost:3001/health in your browser

### "ChromeDriver not found"

- Make sure Chrome is installed
- Try: `google-chrome --version` to verify
- Selenium should auto-download ChromeDriver, but if it fails, download from https://chromedriver.chromium.org/

### "Selenium search error"

- Check the backend terminal for error messages
- Google may have changed their HTML structure
- Try a different search query

### Slow search results

- This is normal! Selenium scraping takes 5-15 seconds
- Much slower than API calls, but it's free!

## How It Works

1. Frontend sends search query to backend API
2. Backend uses Selenium to open Chrome (headless)
3. Navigates to Google search with eco-friendly query
4. Scrapes search results (titles, links, descriptions)
5. Extracts product data (prices, certifications)
6. Returns top 10 products to frontend

## Production Notes

For production, consider:
- Running backend on a separate server
- Using environment variable `VITE_BACKEND_API_URL` to point to production backend
- Adding caching to reduce scraping
- Implementing rate limiting

## Need Help?

See `server/README.md` for detailed backend documentation.

