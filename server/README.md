# Eco Shopping Backend - Selenium Web Scraper

This backend service uses Selenium to scrape Google search results for eco-friendly products. It's a free alternative to the Google Custom Search API.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Chrome Browser** (for Selenium WebDriver)
3. **ChromeDriver** (automatically managed by Selenium, but you may need to install Chrome)

### Install Chrome (if not already installed)

- **macOS**: `brew install --cask google-chrome`
- **Linux**: `sudo apt-get install google-chrome-stable`
- **Windows**: Download from https://www.google.com/chrome/

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3001` by default.

## API Endpoints

### POST `/api/search`

Search for eco-friendly products.

**Request Body:**
```json
{
  "query": "eco-friendly t-shirt"
}
```

**Response:**
```json
{
  "products": [
    {
      "id": "selenium-1234567890-0",
      "name": "Organic Cotton T-Shirt",
      "image": "https://example.com/image.jpg",
      "price": 35.99,
      "description": "Made from 100% organic cotton...",
      "sourceUrl": "https://retailer.com/product/123",
      "sourceName": "retailer.com",
      "certifications": ["Fair Trade", "GOTS"]
    }
  ]
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Eco Shopping Backend is running"
}
```

## How It Works

1. **Receives search query** from frontend
2. **Builds enhanced query** with eco-friendly terms (sustainable, organic, certified, etc.)
3. **Uses Selenium** to navigate to Google search
4. **Scrapes search results** to extract:
   - Product titles
   - Product URLs
   - Descriptions/snippets
   - Images (when available)
   - Prices (extracted from text)
   - Certifications (detected from text)
5. **Filters results** to only include actual product pages
6. **Returns top 10 products** matching the search query

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3001)

### Chrome Options

The scraper runs Chrome in headless mode with these options:
- `--headless` - Run without GUI
- `--no-sandbox` - Required for some environments
- `--disable-dev-shm-usage` - Prevents crashes
- `--disable-gpu` - Better compatibility

## Troubleshooting

### "ChromeDriver not found" error

Make sure Chrome is installed. Selenium will try to find ChromeDriver automatically, but if it fails:

1. Check Chrome version: `google-chrome --version`
2. Download matching ChromeDriver from https://chromedriver.chromium.org/
3. Add to PATH or place in project directory

### "Cannot connect to backend" error

1. Make sure the backend server is running
2. Check the port (default: 3001)
3. Verify CORS is enabled (it should be by default)
4. Check firewall settings

### Slow search results

Selenium scraping is slower than API calls. Typical response time: 5-15 seconds per search.

### Google blocking requests

If Google starts blocking requests:
1. Add delays between requests
2. Use rotating user agents
3. Consider using proxies
4. Implement rate limiting

## Limitations

1. **Speed**: Selenium scraping is slower than API calls (5-15 seconds vs <1 second)
2. **Reliability**: Google may change their HTML structure, breaking the scraper
3. **Rate Limiting**: Too many requests may trigger Google's anti-bot measures
4. **Resource Usage**: Each search opens a Chrome instance (uses memory)

## Production Considerations

For production use, consider:
1. **Caching**: Cache search results to reduce scraping
2. **Rate Limiting**: Limit requests per user/IP
3. **Queue System**: Use a job queue for search requests
4. **Monitoring**: Monitor for failures and update selectors if Google changes HTML
5. **Alternative**: Consider using a paid API for better reliability

## Development

The server uses ES modules (`"type": "module"` in package.json).

To modify the scraper:
- Edit `src/services/seleniumSearch.js`
- The server will auto-reload in dev mode

## License

Same as the main project.

