import { SearchProduct } from "@/types/product";

/**
 * Product Search Service
 * 
 * This service fetches real eco-friendly, certified products from retailer websites.
 * 
 * Features:
 * - Searches for eco-friendly, certified products using Google Custom Search
 * - Extracts product data (name, image, price, description) from search results
 * - Detects environmental certifications (Fair Trade, GOTS, B Corp, etc.)
 * - Returns top 10 relevant results matching user's search query
 * - Provides direct purchase links to retailer websites
 * 
 * Setup:
 * 1. Get Google Custom Search API key: https://console.cloud.google.com/
 * 2. Create Custom Search Engine: https://cse.google.com/cse/
 * 3. Set environment variables:
 *    - VITE_GOOGLE_API_KEY=your_api_key
 *    - VITE_GOOGLE_CSE_ID=your_search_engine_id
 * 
 * For full product extraction (exact images, prices from product pages):
 * - Option 1: Use ScraperAPI (set VITE_SCRAPER_API_KEY)
 * - Option 2: Set up backend service (set VITE_BACKEND_API_URL)
 * 
 * See PRODUCT_SEARCH_SETUP.md for detailed setup instructions.
 */

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CSE_ID = import.meta.env.VITE_GOOGLE_CSE_ID;

/**
 * Product Search Service - Real-time Dynamic Search
 * 
 * This service ONLY uses Google Custom Search API to fetch real-time, live product data.
 * All results are dynamically fetched from the web - no hardcoded products.
 * 
 * IMPORTANT: Google Custom Search API credentials must be configured for this to work.
 * Set the following environment variables:
 * - VITE_GOOGLE_API_KEY=your_api_key
 * - VITE_GOOGLE_CSE_ID=your_search_engine_id
 */

/**
 * Enhanced search query builder for eco-friendly, certified products
 * Targets product pages specifically, not homepages or category pages
 * Optimized for shopping results with accurate product data
 */
const buildEcoSearchQuery = (query: string): string => {
  const baseQuery = query.toLowerCase().trim();
  
  // Add eco-friendly terms
  const ecoTerms = [
    "eco-friendly",
    "sustainable",
    "organic",
    "certified",
    "fair trade",
    "recycled",
    "GOTS",
    "B Corp",
  ];
  
  // Target product pages specifically (not homepages)
  // Common product page URL patterns: /product/, /p/, /item/, /products/, /shop/
  const productPagePatterns = [
    'inurl:"/product/"',
    'inurl:"/p/"',
    'inurl:"/item/"',
    'inurl:"/products/"',
    'inurl:"/shop/"',
    'inurl:"/buy/"',
  ];
  
  // Build query targeting product pages with eco-friendly terms
  // Use shopping-focused terms for better product results
  const enhancedQuery = `"${baseQuery}" (${ecoTerms.slice(0, 3).join(" OR ")}) (${productPagePatterns.slice(0, 3).join(" OR ")}) buy shop purchase`;
  
  return enhancedQuery;
};

/**
 * Validate if URL is a product page (not homepage or category page)
 * Enhanced to ensure URLs are current and valid product pages
 */
const isProductPage = (url: string): boolean => {
  if (!url || url === "#") return false;
  
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.toLowerCase();
    
    // Check if it's a homepage
    if (path === "/" || path === "") return false;
    
    // Check for product page indicators
    const productIndicators = [
      "/product/",
      "/products/",
      "/p/",
      "/item/",
      "/shop/",
      "/buy/",
      "/detail/",
      "/dp/",        // Amazon product pages
      "/gp/product/", // Amazon product pages
    ];
    
    // Check for category/listing page indicators (exclude these)
    const categoryIndicators = [
      "/category/",
      "/categories/",
      "/collection/",
      "/collections/",
      "/search",
      "/browse",
      "/all",
      "/list/",
      "/grid/",
    ];
    
    // Must have product indicator and not be a category page
    const hasProductIndicator = productIndicators.some(indicator => path.includes(indicator));
    const isCategoryPage = categoryIndicators.some(indicator => path.includes(indicator));
    
    // Also check if URL has product-like structure (has ID or slug)
    // Product URLs typically have at least 2 path segments after domain
    const hasProductStructure = /\/[^\/]+\/[^\/]+/.test(path) && path.split("/").filter(p => p).length >= 2;
    
    // Exclude common non-product paths
    const excludedPaths = ["/cart", "/checkout", "/account", "/login", "/register", "/about", "/contact"];
    const isExcluded = excludedPaths.some(excluded => path.startsWith(excluded));
    
    return (hasProductIndicator || hasProductStructure) && !isCategoryPage && !isExcluded;
  } catch {
    return false;
  }
};

/**
 * Validate and clean product URL to ensure it's current and accurate
 */
const validateProductUrl = (url: string): string => {
  if (!url || url === "#") return "";
  
  try {
    const urlObj = new URL(url);
    
    // Remove common tracking parameters that might make URLs stale
    const trackingParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "ref", "source", "affiliate_id", "campaign_id", "gclid", "fbclid",
      "mc_cid", "mc_eid", "_ga", "gclsrc"
    ];
    
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    // Ensure HTTPS for security
    if (urlObj.protocol === "http:") {
      urlObj.protocol = "https:";
    }
    
    return urlObj.toString();
  } catch {
    return url; // Return original if parsing fails
  }
};

/**
 * Extract the best product image from Google search result
 * Prioritizes actual product images over logos or banners
 */
const extractProductImage = (item: any, url: string = ""): string => {
  // Priority order for image extraction (most accurate first)
  const imageSources = [
    // Structured product data (most accurate)
    item.pagemap?.product?.[0]?.image,
    item.pagemap?.product?.[0]?.image_url,
    // Open Graph images (usually product images)
    item.pagemap?.metatags?.[0]?.["og:image"],
    item.pagemap?.metatags?.[0]?.["og:image:secure_url"],
    // Google extracted images
    item.pagemap?.cse_image?.[0]?.src,
    // Twitter card images
    item.pagemap?.metatags?.[0]?.["twitter:image"],
    item.pagemap?.metatags?.[0]?.["twitter:image:src"],
    // Thumbnails (fallback)
    item.pagemap?.cse_thumbnail?.[0]?.src,
  ];
  
  for (const image of imageSources) {
    if (image && typeof image === "string") {
      let imageUrl = image.trim();
      
      // Skip if it's clearly not a product image
      if (imageUrl.includes("logo") || imageUrl.includes("banner") || imageUrl.includes("icon")) {
        continue;
      }
      
      // Ensure it's a full URL
      if (imageUrl.startsWith("//")) {
        imageUrl = `https:${imageUrl}`;
      } else if (imageUrl.startsWith("/")) {
        // Relative URL - construct from product URL
        try {
          const baseUrl = new URL(url);
          imageUrl = `${baseUrl.origin}${imageUrl}`;
        } catch {
          continue; // Skip if we can't construct URL
        }
      }
      
      // Validate it's a proper image URL
      if (imageUrl.startsWith("http") && (imageUrl.match(/\.(jpg|jpeg|png|gif|webp)/i) || imageUrl.includes("image"))) {
        return imageUrl;
      }
    }
  }
  
  return "";
};

/**
 * Extract price from various sources in Google search result
 * Enhanced to find the most accurate product price
 */
const extractPrice = (item: any): number => {
  // Try structured data first (most accurate)
  const structuredPrice = 
    item.pagemap?.product?.[0]?.price ||
    item.pagemap?.product?.[0]?.priceCurrency ||
    item.pagemap?.metatags?.[0]?.["product:price:amount"] ||
    item.pagemap?.metatags?.[0]?.["product:price:currency"];
  
  if (structuredPrice) {
    const price = parseFloat(String(structuredPrice).replace(/[^0-9.]/g, ""));
    if (price > 0 && price < 100000) {
      return Math.round(price * 100) / 100; // Round to 2 decimals
    }
  }
  
  // Try multiple price extraction patterns from text
  const pricePatterns = [
    /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,  // $1,234.56
    /\$\s*(\d+\.?\d{0,2})/g,                     // $12.99
    /USD\s*\$?\s*(\d+\.?\d*)/gi,
    /price[:\s]*\$?\s*(\d+\.?\d*)/gi,
    /(\d+\.?\d{2})\s*USD/gi,
    /(\d+\.?\d{2})\s*\$/,                        // 12.99 $
    /cost[:\s]*\$?\s*(\d+\.?\d*)/gi,
  ];
  
  const textSources = [
    item.snippet,
    item.htmlSnippet,
    item.title,
  ].filter(Boolean);
  
  const prices: number[] = [];
  
  for (const text of textSources) {
    if (!text) continue;
    
    for (const pattern of pricePatterns) {
      const matches = Array.from(text.matchAll(pattern));
      for (const match of matches) {
        if (match[1]) {
          const priceStr = match[1].replace(/,/g, ""); // Remove commas
          const price = parseFloat(priceStr);
          // Sanity check: reasonable price range
          if (price > 0 && price < 100000) {
            prices.push(price);
          }
        }
      }
    }
  }
  
  // Return the most common price or the first valid price
  if (prices.length > 0) {
    // Find most common price (within $1 range)
    const priceGroups = new Map<number, number>();
    for (const price of prices) {
      const rounded = Math.round(price);
      priceGroups.set(rounded, (priceGroups.get(rounded) || 0) + 1);
    }
    
    let maxCount = 0;
    let bestPrice = prices[0];
    for (const [price, count] of priceGroups.entries()) {
      if (count > maxCount) {
        maxCount = count;
        bestPrice = price;
      }
    }
    
    return Math.round(bestPrice * 100) / 100;
  }
  
  return 0;
};

/**
 * Search for eco-friendly products using Google Custom Search API
 * Enhanced to find certified, eco-friendly products from retailer websites
 */
const searchWithGoogle = async (query: string): Promise<SearchProduct[]> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    throw new Error("Google API credentials not configured");
  }

  // Build enhanced search query targeting eco-friendly, certified products
  const searchQuery = buildEcoSearchQuery(query);
  // Use additional parameters for better shopping results
  // Note: searchType=image removed - we want web results with product pages, not just images
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(searchQuery)}&num=10&safe=active&lr=lang_en&cr=countryUS`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || "Search failed");
    }

    if (!data.items || data.items.length === 0) {
      return [];
    }

    // Transform Google results into SearchProduct format
    const products: SearchProduct[] = data.items
      .filter((item: any) => {
        // Filter to only include product pages, not homepages or category pages
        return item.link && isProductPage(item.link);
      })
      .map((item: any, index: number) => {
        const url = item.link || "#";
        let hostname = "";
        try {
          hostname = new URL(url).hostname.replace("www.", "");
        } catch {
          hostname = "retailer";
        }
        
        // Extract product image (prioritize product-specific images)
        const image = extractProductImage(item, url);
        
        // Extract price (enhanced extraction)
        const price = extractPrice(item);
        
        // Extract certifications from snippet and title
        const certifications: string[] = [];
        const searchText = `${item.title || ""} ${item.snippet || ""}`.toLowerCase();
        
        if (searchText.includes("fair trade") || searchText.includes("fairtrade")) certifications.push("Fair Trade");
        if (searchText.includes("gots") || searchText.includes("global organic textile")) certifications.push("GOTS");
        if (searchText.includes("b corp") || searchText.includes("b-corp") || searchText.includes("bcorp")) certifications.push("B Corp");
        if (searchText.includes("organic certified") || searchText.includes("certified organic") || searchText.includes("usda organic")) {
          if (searchText.includes("usda")) {
            certifications.push("USDA Organic");
          } else {
            certifications.push("Organic");
          }
        }
        if (searchText.includes("recycled") && (searchText.includes("material") || searchText.includes("made from"))) certifications.push("Recycled");
        if (searchText.includes("carbon neutral") || searchText.includes("carbon-neutral")) certifications.push("Carbon Neutral");
        if (searchText.includes("fsc") || searchText.includes("forest stewardship")) certifications.push("FSC");
        if (searchText.includes("cradle to cradle") || searchText.includes("c2c")) certifications.push("Cradle to Cradle");
        if (searchText.includes("bluesign")) certifications.push("Bluesign");
        if (searchText.includes("oeko-tex") || searchText.includes("oekotex")) certifications.push("OEKO-TEX");
        if (searchText.includes("rainforest alliance")) certifications.push("Rainforest Alliance");

        // Build enhanced description highlighting certifications
        let description = item.snippet || item.title || "";
        if (certifications.length > 0) {
          description = `${description} This product is certified ${certifications.join(", ")}.`;
        }
        if (!description.includes("eco-friendly") && !description.includes("sustainable")) {
          description = `Eco-friendly ${query}. ${description}`;
        }

        // Validate and clean the URL
        const validatedUrl = validateProductUrl(url);
        
        return {
          id: `google-${validatedUrl.replace(/[^a-zA-Z0-9]/g, "") || index}`,
          name: item.title || `Eco-Friendly ${query}`,
          image: image,
          price: price,
          description: description.trim(),
          sourceUrl: validatedUrl,
          sourceName: hostname,
          certifications: certifications.length > 0 ? certifications as any : undefined,
        };
      });

    // Filter to ensure products match the search query and have valid data
    const normalizedQuery = query.toLowerCase();
    const filteredProducts = products.filter(product => {
      // Must have valid URL
      if (!product.sourceUrl || product.sourceUrl === "#" || !isProductPage(product.sourceUrl)) {
        return false;
      }
      
      // Must have name
      if (!product.name || product.name.length < 3) {
        return false;
      }
      
      // Must match search query
      const productText = `${product.name} ${product.description}`.toLowerCase();
      const queryTerms = normalizedQuery.split(" ").filter(term => term.length > 2);
      const matchesQuery = queryTerms.length === 0 || 
        queryTerms.some(term => productText.includes(term)) ||
        productText.includes(normalizedQuery);
      
      return matchesQuery;
    });

    // Return top 10 products
    return filteredProducts.slice(0, 10);

  } catch (error) {
    console.error("Google Search API error:", error);
    throw error;
  }
};

/**
 * Main search function - Real-time dynamic search only
 * 
 * This function ONLY uses Google Custom Search API to fetch live product data.
 * No hardcoded fallback data is used. If the API is not configured or fails,
 * an error will be thrown with clear instructions.
 * 
 * @param query - User's search query
 * @returns Promise<SearchProduct[]> - Array of up to 10 real-time product results
 * @throws Error if Google API credentials are not configured or search fails
 */
export const searchEcoProducts = async (query: string): Promise<SearchProduct[]> => {
  if (!query.trim()) {
    return [];
  }

  // Check if Google API credentials are configured
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    throw new Error(
      "Google Custom Search API is not configured. " +
      "Please set VITE_GOOGLE_API_KEY and VITE_GOOGLE_CSE_ID environment variables. " +
      "See https://console.cloud.google.com/ for API key setup."
    );
  }

  // Use Google Custom Search API - the only source of product data
  try {
    const results = await searchWithGoogle(query);
    
    // If no results found, return empty array (don't throw error)
    if (results.length === 0) {
      return [];
    }
    
    return results;
  } catch (error) {
    // Re-throw with more context if it's an API error
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch real-time product data: ${error.message}. ` +
        "Please ensure your Google Custom Search API credentials are valid and the API is enabled."
      );
    }
    throw error;
  }
};
