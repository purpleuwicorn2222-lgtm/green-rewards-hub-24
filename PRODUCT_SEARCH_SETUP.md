# Product Search Setup Guide

This guide explains how to set up the enhanced product search feature that fetches real product data from retailer websites.

## Features

- ✅ Searches for eco-friendly, certified products using Google Custom Search
- ✅ Extracts product name, image, price, and description from retailer websites
- ✅ Detects environmental certifications (Fair Trade, GOTS, B Corp, etc.)
- ✅ Returns top 10 relevant results matching user's search query
- ✅ Direct purchase links to retailer websites

## Setup Options

### Option 1: Google Custom Search API (Current Implementation)

The current implementation uses Google Custom Search API to find eco-friendly products. This works well but has limitations:
- Product data is extracted from search snippets (may not be complete)
- Prices may not always be available
- Images are from search results, not always the exact product image

**Setup Steps:**

1. Get Google Custom Search API Key:
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing
   - Enable "Custom Search API"
   - Create credentials (API Key)

2. Create a Custom Search Engine:
   - Go to https://cse.google.com/cse/
   - Create a new search engine
   - Set it to search the entire web
   - Get your Search Engine ID (CX)

3. Configure Environment Variables:
   Create a `.env` file in the project root:
   ```
   VITE_GOOGLE_API_KEY=your_api_key_here
   VITE_GOOGLE_CSE_ID=your_search_engine_id_here
   ```

### Option 2: Full Product Extraction (Recommended for Production)

For complete product data extraction (exact images, prices, descriptions from product pages), you need a backend service to bypass CORS restrictions.

#### Backend Service Options:

**A. ScraperAPI (Easiest)**
1. Sign up at https://www.scraperapi.com/
2. Get your API key
3. Add to `.env`:
   ```
   VITE_SCRAPER_API_KEY=your_scraper_api_key
   ```

**B. Custom Backend Service**

Create a backend API endpoint that:
- Accepts product URLs
- Fetches HTML from product pages
- Parses product data (name, image, price, description)
- Extracts certifications
- Returns structured JSON

Example Node.js/Express endpoint:

```javascript
// backend/api/extract-product.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

app.post('/api/extract-product', async (req, res) => {
  const { url } = req.body;
  
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract product data (adjust selectors based on website)
    const product = {
      name: $('h1.product-title, h1').first().text().trim(),
      image: $('img.product-image, meta[property="og:image"]').attr('content') || 
             $('img.product-image').attr('src'),
      price: parseFloat($('.price, [itemprop="price"]').text().replace(/[^0-9.]/g, '')),
      description: $('meta[name="description"]').attr('content') || 
                   $('.product-description').text().trim(),
      certifications: extractCertifications($('body').text())
    };
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to extract product data' });
  }
});
```

Then set in `.env`:
```
VITE_BACKEND_API_URL=http://localhost:3000
```

## How It Works

1. **User Search**: User searches for a product (e.g., "eco-friendly t-shirt")

2. **Google Search**: System searches Google for:
   - Eco-friendly terms (sustainable, organic, certified)
   - Product type (t-shirt)
   - Retailer websites (site:shop OR site:store)

3. **Product Extraction**:
   - Extracts product name, image, price from search results
   - Detects certifications from snippet text
   - Filters results to match search query

4. **Display**: Shows top 10 products with:
   - Product name
   - Product image
   - Price (if available)
   - Eco-friendly description
   - Certifications badges
   - Direct purchase link

## Certification Detection

The system automatically detects these certifications:
- Fair Trade
- GOTS (Global Organic Textile Standard)
- B Corp
- Organic
- Recycled
- FSC (Forest Stewardship Council)
- Carbon Neutral
- Cradle to Cradle
- Bluesign
- OEKO-TEX
- USDA Organic
- Rainforest Alliance

## Search Query Enhancement

The search automatically enhances queries to find certified products:
- Adds eco-friendly terms
- Includes certification keywords
- Targets retailer product pages
- Filters for relevant results

## Limitations

1. **CORS Restrictions**: Direct product page scraping from browser is blocked. Requires backend proxy.

2. **Price Extraction**: Prices may not always be available from search snippets. Full extraction requires backend service.

3. **Image Quality**: Images from search results may not always be the exact product image.

4. **Product Page Parsing**: Different retailers use different HTML structures, making universal parsing difficult.

## Recommendations

For production use:
1. Set up a backend service (ScraperAPI or custom)
2. Implement caching to reduce API calls
3. Add rate limiting
4. Consider using product APIs from major retailers
5. Implement fallback to curated product database

## Testing

Test the search with various queries:
- "eco-friendly t-shirt"
- "recycled sneakers"
- "sustainable water bottle"
- "organic toothbrush"
- "fair trade coffee"

Each should return 10 relevant, certified eco-friendly products.

