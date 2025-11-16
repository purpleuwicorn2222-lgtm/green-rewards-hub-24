import { SearchProduct } from "@/types/product";

/**
 * Product Search Service
 * 
 * This service fetches real eco-friendly, certified products from retailer websites
 * using a Selenium-based backend that scrapes Google search results.
 * 
 * Features:
 * - Searches for eco-friendly, certified products using Selenium web scraping
 * - Extracts product data (name, image, price, description) from search results
 * - Detects environmental certifications (Fair Trade, GOTS, B Corp, etc.)
 * - Returns top 10 relevant results matching user's search query
 * - Provides direct purchase links to retailer websites
 * 
 * Setup:
 * 1. Install backend dependencies: cd server && npm install
 * 2. Start the backend server: npm run dev (in server directory)
 * 3. The frontend will automatically connect to http://localhost:3001
 * 
 * To use a different backend URL, set VITE_BACKEND_API_URL environment variable.
 * 
 * See SERVER_README.md for detailed backend setup instructions.
 */

// Backend API URL (defaults to localhost:3001)
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

/**
 * Product Search Service - Real-time Dynamic Search using Selenium Backend
 * 
 * This service uses a Selenium-based backend to scrape Google search results.
 * All results are dynamically fetched from the web - no hardcoded products.
 * 
 * IMPORTANT: The backend server must be running for this to work.
 * Start the backend with: cd server && npm install && npm run dev
 */

/**
 * Search for eco-friendly products using Selenium backend
 */
const searchWithBackend = async (query: string): Promise<SearchProduct[]> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Cannot connect to backend server at ${BACKEND_API_URL}. ` +
        `Please make sure the backend server is running. ` +
        `Start it with: cd server && npm install && npm run dev`
      );
    }
    throw error;
  }
};


/**
 * Main search function - Real-time dynamic search using Selenium backend
 * 
 * This function uses a Selenium-based backend to scrape Google search results.
 * No hardcoded fallback data is used. The backend server must be running.
 * 
 * @param query - User's search query
 * @returns Promise<SearchProduct[]> - Array of up to 10 real-time product results
 * @throws Error if backend server is not running or search fails
 */
export const searchEcoProducts = async (query: string): Promise<SearchProduct[]> => {
  if (!query.trim()) {
    return [];
  }

  // Use Selenium backend - the only source of product data
  try {
    const results = await searchWithBackend(query);
    
    // If no results found, return empty array (don't throw error)
    if (results.length === 0) {
      return [];
    }
    
    return results;
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw error; // Error message already includes helpful context
    }
    throw error;
  }
};
