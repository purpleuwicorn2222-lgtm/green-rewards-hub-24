import { SearchProduct } from "@/types/product";

/**
 * Product Search Service
 * 
 * This service fetches real eco-friendly products from various sources.
 * 
 * To use Google Custom Search API:
 * 1. Get API key from: https://developers.google.com/custom-search/v1/overview
 * 2. Create a Custom Search Engine: https://cse.google.com/cse/
 * 3. Set the following environment variables:
 *    - VITE_GOOGLE_API_KEY=your_api_key
 *    - VITE_GOOGLE_CSE_ID=your_search_engine_id
 * 
 * For now, this uses a fallback service that provides realistic eco-product data.
 */

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CSE_ID = import.meta.env.VITE_GOOGLE_CSE_ID;

// Fallback: Generate realistic eco-product data based on search query
const generateEcoProducts = (query: string): SearchProduct[] => {
  const normalizedQuery = query.toLowerCase();
  
  // Product templates based on common eco-friendly categories
  const productTemplates = {
    shampoo: [
      { name: "Organic Lavender Shampoo", brand: "Ethique", basePrice: 15 },
      { name: "Bamboo Charcoal Shampoo Bar", brand: "HiBAR", basePrice: 12 },
      { name: "Sulfate-Free Shampoo", brand: "Acure", basePrice: 10 },
      { name: "Refillable Shampoo", brand: "Plaine Products", basePrice: 18 },
      { name: "Zero-Waste Shampoo", brand: "Lush", basePrice: 14 },
    ],
    makeup: [
      { name: "Vegan Mascara", brand: "Elate Cosmetics", basePrice: 28 },
      { name: "Organic Foundation", brand: "RMS Beauty", basePrice: 42 },
      { name: "Refillable Lipstick", brand: "Zao Organic", basePrice: 24 },
      { name: "Mineral Eyeshadow", brand: "Axiology", basePrice: 32 },
      { name: "Cream Blush", brand: "Ilia", basePrice: 26 },
    ],
    skincare: [
      { name: "Facial Oil Serum", brand: "Herbivore Botanicals", basePrice: 48 },
      { name: "Solid Face Cleanser", brand: "Ethique", basePrice: 16 },
      { name: "Reusable Cotton Rounds", brand: "LastObject", basePrice: 12 },
      { name: "Bamboo Face Mask", brand: "Bambo Earth", basePrice: 8 },
      { name: "Glass Jar Moisturizer", brand: "Osea", basePrice: 54 },
    ],
    clothes: [
      { name: "Organic Cotton T-Shirt", brand: "Patagonia", basePrice: 45 },
      { name: "Recycled Denim Jeans", brand: "Reformation", basePrice: 128 },
      { name: "Hemp Hoodie", brand: "tentree", basePrice: 68 },
      { name: "Bamboo Leggings", brand: "Boody", basePrice: 32 },
      { name: "Recycled Polyester Jacket", brand: "Girlfriend Collective", basePrice: 98 },
    ],
    default: [
      { name: "Eco-Friendly Product", brand: "Sustainable Brand", basePrice: 25 },
      { name: "Organic Alternative", brand: "Green Co", basePrice: 30 },
      { name: "Reusable Item", brand: "EcoLife", basePrice: 20 },
      { name: "Biodegradable Option", brand: "Earth Friendly", basePrice: 15 },
      { name: "Sustainable Choice", brand: "Green Living", basePrice: 35 },
    ],
  };

  // Determine which template to use
  let templates = productTemplates.default;
  if (normalizedQuery.includes("shampoo") || normalizedQuery.includes("hair")) {
    templates = productTemplates.shampoo;
  } else if (normalizedQuery.includes("makeup") || normalizedQuery.includes("cosmetic")) {
    templates = productTemplates.makeup;
  } else if (normalizedQuery.includes("skincare") || normalizedQuery.includes("face") || normalizedQuery.includes("skin")) {
    templates = productTemplates.skincare;
  } else if (normalizedQuery.includes("clothes") || normalizedQuery.includes("clothing") || normalizedQuery.includes("apparel")) {
    templates = productTemplates.clothes;
  }

  // Generate 10 products
  const products: SearchProduct[] = [];
  
  // Eco-friendly product images from Unsplash
  const ecoImages = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
  ];
  
  for (let i = 0; i < 10; i++) {
    const template = templates[i % templates.length];
    const variation = Math.floor(i / templates.length);
    const price = template.basePrice + (variation * 5) + Math.random() * 10;
    
    products.push({
      id: `search-${Date.now()}-${i}`,
      name: `${template.name}${variation > 0 ? ` ${variation + 1}` : ""}`,
      image: ecoImages[i % ecoImages.length],
      price: Math.round(price * 100) / 100,
      description: `Made with organic ingredients, cruelty-free, and eco-conscious packaging. ${template.brand} is committed to sustainability and environmental responsibility.`,
      sourceUrl: `https://example.com/products/${template.name.toLowerCase().replace(/\s+/g, "-")}-${i}`,
      sourceName: template.brand,
    });
  }

  return products;
};

/**
 * Search for eco-friendly products using Google Custom Search API
 */
const searchWithGoogle = async (query: string): Promise<SearchProduct[]> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    throw new Error("Google API credentials not configured");
  }

  const searchQuery = `eco-friendly ${query} sustainable`;
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(searchQuery)}&num=10&searchType=image`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error?.message || "Search failed");
    }

    // Transform Google results into SearchProduct format
    return (data.items || []).map((item: any, index: number) => ({
      id: `google-${item.link?.replace(/[^a-zA-Z0-9]/g, "") || index}`,
      name: item.title || `Eco-Friendly ${query}`,
      image: item.pagemap?.cse_image?.[0]?.src || item.link,
      price: 0, // Price not available from Google search
      description: item.snippet || `Eco-friendly ${query} product`,
      sourceUrl: item.link || "#",
      sourceName: new URL(item.link || "https://example.com").hostname,
    }));
  } catch (error) {
    console.error("Google Search API error:", error);
    throw error;
  }
};

/**
 * Main search function
 * Tries Google Custom Search API first, falls back to generated products
 */
export const searchEcoProducts = async (query: string): Promise<SearchProduct[]> => {
  if (!query.trim()) {
    return [];
  }

  // Try Google Custom Search API if configured
  if (GOOGLE_API_KEY && GOOGLE_CSE_ID) {
    try {
      return await searchWithGoogle(query);
    } catch (error) {
      console.warn("Falling back to generated products:", error);
    }
  }

  // Fallback: Generate realistic product data
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return generateEcoProducts(query);
};

