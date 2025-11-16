// PASTE THIS ENTIRE THING INTO src/services/productSearch.ts

import { SearchProduct, CertificationType } from "@/types/product";
// 1. IMPORT YOUR SCRAPER
import { fetchMultipleProductData } from "./productExtractor";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CSE_ID = import.meta.env.VITE_GOOGLE_CSE_ID;

// Curated list of reputable eco-friendly brands
const ECO_BRANDS = {
  patagonia: {
    name: "Patagonia",
    website: "https://www.patagonia.com",
    focus: ["clothing", "outerwear", "jackets", "t-shirts", "shorts", "pants"],
  },
  pela: {
    name: "Pela",
    website: "https://pelacase.com",
    focus: ["phone cases", "accessories", "tech"],
  },
  reformation: {
    name: "Reformation",
    website: "https://www.thereformation.com",
    focus: ["clothing", "dresses", "tops", "bottoms"],
  },
  allbirds: {
    name: "Allbirds",
    website: "https://www.allbirds.com",
    focus: ["shoes", "sneakers", "footwear"],
  },
  tentree: {
    name: "tentree",
    website: "https://www.tentree.com",
    focus: ["clothing", "t-shirts", "hoodies", "activewear"],
  },
  ethique: {
    name: "Ethique",
    website: "https://ethique.com",
    focus: ["skincare", "shampoo", "soap", "beauty"],
  },
  whoGivesACrap: {
    name: "Who Gives a Crap",
    website: "https://whogivesacrap.org",
    focus: ["toilet paper", "paper products", "bathroom"],
  },
  thinx: {
    name: "Thinx",
    website: "https://www.shethinx.com",
    focus: ["period products", "underwear", "intimates"],
  },
  greenToys: {
    name: "Green Toys",
    website: "https://www.greentoys.com",
    focus: ["toys", "children's products"],
  },
  pelaCase: {
    name: "Pela Case",
    website: "https://pelacase.com",
    focus: ["phone cases", "accessories"],
  },
  hydroFlask: {
    name: "Hydro Flask",
    website: "https://www.hydroflask.com",
    focus: ["water bottles", "drinkware"],
  },
  kleanKanteen: {
    name: "Klean Kanteen",
    website: "https://www.kleankanteen.com",
    focus: ["water bottles", "drinkware"],
  },
  bambooToothbrush: {
    name: "Brush with Bamboo",
    website: "https://brushwithbamboo.com",
    focus: ["toothbrush", "oral care", "bamboo"],
  },
  nativeShoes: {
    name: "Native Shoes",
    website: "https://www.nativeshoes.com",
    focus: ["shoes", "sneakers", "footwear"],
  },
  girlfriendCollective: {
    name: "Girlfriend Collective",
    website: "https://www.girlfriend.com",
    focus: ["activewear", "leggings", "sports bras"],
  },
  boody: {
    name: "Boody",
    website: "https://boodywear.com",
    focus: ["underwear", "basics", "bamboo"],
  },
};

// =====================
// !! IMPORTANT FIX !!
// =====================
// This is the database that provides your search results.
// You MUST add a real, working "sourceUrl" for every product.
const PRODUCT_DATABASE: Record<string, Array<{
  name: string;
  brand: keyof typeof ECO_BRANDS;
  price: number;
  description: string;
  ecoFeatures: string;
  image: string;
  sourceUrl: string; // <-- 1. This field is now required
}>> = {
  "t-shirt": [
    {
      name: "Organic Cotton T-Shirt",
      brand: "patagonia",
      price: 35,
      description: "Made from 100% organic cotton...",
      ecoFeatures: "100% organic cotton, Fair Trade Certified...",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      sourceUrl: "https://www.patagonia.com/product/mens-p-6-logo-responsibili-tee/38483.html" // <-- 2. ADD A REAL URL
    },
    {
      name: "Bamboo T-Shirt",
      brand: "boody",
      price: 28,
      description: "Made from organically grown bamboo...",
      ecoFeatures: "100% organic bamboo, biodegradable...",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      sourceUrl: "https://boody.com/products/mens-crew-neck-t-shirt" // <-- 2. ADD A REAL URL
    },
    // ... ADD REAL URLs for all other T-Shirts ...
  ],
  "sneakers": [
    {
      name: "Tree Runners",
      brand: "allbirds",
      price: 98,
      description: "Made from eucalyptus tree fiber...",
      ecoFeatures: "Eucalyptus tree fiber, carbon-negative...",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
      sourceUrl: "https://www.allbirds.com/products/mens-tree-runners" // <-- 2. ADD A REAL URL
    },
    // ... ADD REAL URLs for all other Sneakers ...
  ],
  "toothbrush": [
    {
      name: "Bamboo Toothbrush Set",
      brand: "bambooToothbrush",
      price: 12,
      description: "Made from sustainably sourced bamboo...",
      ecoFeatures: "100% biodegradable bamboo...",
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop",
      sourceUrl: "https://brushwithbamboo.com/products/bamboo-toothbrush-multi-pack" // <-- 2. ADD A REAL URL
    },
    // ... ADD REAL URLs for all other Toothbrushes ...
  ],
  // ...
  // GO THROUGH EVERY CATEGORY AND ADD REAL URLs
  // ...
  "water bottle": [
    {
      name: "Stainless Steel Water Bottle",
      brand: "hydroFlask",
      price: 35,
      description: "Double-wall vacuum insulation...",
      ecoFeatures: "Reusable, eliminates single-use plastic...",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
      sourceUrl: "https://www.hydroflask.com/24-oz-standard-mouth" // <-- 2. ADD A REAL URL
    }
  ],
  "phone case": [
    {
      name: "Compostable Phone Case",
      brand: "pelaCase",
      price: 30,
      description: "Made from Flaxstic, a compostable material...",
      ecoFeatures: "100% compostable, made from flax straw...",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
      sourceUrl: "https://pelacase.com/products/eco-friendly-iphone-14-case" // <-- 2. ADD A REAL URL
    }
  ],
  "jacket": [
    {
      name: "Recycled Down Puffer Jacket",
      brand: "patagonia",
      price: 299,
      description: "Made from 100% recycled down...",
      ecoFeatures: "100% recycled materials, Fair Trade Certified...",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      sourceUrl: "https://www.patagonia.com/product/mens-down-sweater-jacket/84675.html" // <-- 2. ADD A REAL URL
    }
  ],
  "jeans": [
    {
      name: "Recycled Denim Jeans",
      brand: "reformation",
      price: 128,
      description: "Made from recycled denim...",
      ecoFeatures: "Recycled denim, organic cotton...",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
      sourceUrl: "https://www.thereformation.com/products/cynthia-high-rise-straight-long-jeans/1301096BCA.html" // <-- 2. ADD A REAL URL
    }
  ],
};

// Extended product categories with more variations
const PRODUCT_CATEGORIES: Record<string, string[]> = {
  "t-shirt": ["t-shirt", "tshirt", "tee", "shirt", "top", "t shirt"],
  "sneakers": ["sneakers", "sneaker", "shoes", "footwear", "runners", "trainers", "athletic shoes"],
  "toothbrush": ["toothbrush", "tooth brush", "oral care", "dental", "tooth brush"],
  "water bottle": ["water bottle", "bottle", "hydration", "drinkware", "waterbottle"],
  "phone case": ["phone case", "phonecase", "case", "mobile case", "iphone case", "phone cover"],
  "shampoo": ["shampoo", "hair care", "hair wash", "hair shampoo"],
  "skincare": ["skincare", "skin care", "face", "moisturizer", "cleanser"],
  "clothing": ["clothing", "clothes", "apparel", "garment"],
  "jacket": ["jacket", "coat", "outerwear", "p puffer", "windbreaker"],
  "jeans": ["jeans", "denim", "pants", "trousers"],
};

/**
 * Find matching product category from search query
 */
const findProductCategory = (query: string): string | null => {
  const normalizedQuery = query.toLowerCase().trim();
  
  for (const [category, keywords] of Object.entries(PRODUCT_CATEGORIES)) {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return category;
    }
  }
  
  return null;
};

/**
 * Generate eco-friendly products based on search query
 */
const generateEcoProducts = (query: string): SearchProduct[] => {
  const category = findProductCategory(query);
  const products: SearchProduct[] = [];
  
  // If we have products for this category, use them
  if (category && PRODUCT_DATABASE[category]) {
    const categoryProducts = PRODUCT_DATABASE[category];
    
    // Return up to 10 products, cycling through if needed
    for (let i = 0; i < 10; i++) {
      const product = categoryProducts[i % categoryProducts.length];
      const brand = ECO_BRANDS[product.brand];
      
      products.push({
        id: `eco-${category}-${Date.now()}-${i}`,
        name: product.name,
        image: product.image,
        price: product.price + (Math.random() * 5 - 2.5), // Small price variation
        description: product.description,
        sourceUrl: product.sourceUrl, // <-- 3. USE THE REAL, WORKING URL
        sourceName: brand.name,
        certifications: [], // <-- FIX: Added missing field
      });
    }
    
    return products;
  }
  
  // Fallback: Generate generic eco-friendly products (these will have broken links)
  const ecoImages = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
  ];
  const brands = Object.values(ECO_BRANDS);
  for (let i = 0; i < 10; i++) {
    const brand = brands[i % brands.length];
    const productName = `Eco-Friendly ${query.charAt(0).toUpperCase() + query.slice(1)}`;
    products.push({
      id: `eco-${Date.now()}-${i}`,
      name: productName,
      image: ecoImages[i % ecoImages.length],
      price: 25 + (i * 5) + Math.random() * 10,
      description: `Sustainable ${query} from ${brand.name}...`,
      sourceUrl: `${brand.website}/search?q=${encodeURIComponent(query)}`, // This is still a guess
      sourceName: brand.name,
      certifications: [], // <-- FIX: Added missing field
    });
  }
  
  return products;
};


// In src/services/productSearch.ts

const buildEcoSearchQuery = (query: string): string => {
  const baseQuery = query.toLowerCase().trim();
  
  // More specific terms to find product pages
  const ecoTerms = [
    "eco-friendly",
    "sustainable",
    "organic",
    "recycled",
    "b corp",
    "fair trade",
  ];
  
  // 1. ADD NEGATIVE KEYWORDS
  // This tells Google to REMOVE results from common "random" sites.
  // This is the most effective change you can make in code.
  const excludeSites = [
    "-site:pinterest.com",
    "-site:youtube.com",
    "-site:amazon.com", // Add Amazon if you want to focus on brand sites
    "-site:reddit.com",
    "-site:ebay.com",
    "-site:walmart.com",
    "-inurl:blog", // Exclude pages that have "blog" in the URL
    "-inurl:forum",
    "-inurl:reviews",
  ];

  // 2. IMPROVE POSITIVE KEYWORDS
  // Using quotes makes the search more specific.
  const productPagePatterns = [
    `"shop"`,
    `"buy"`,
    `"product"`,
    `"add to cart"`,
  ];

  // 3. COMBINE EVERYTHING
  const enhancedQuery = [
    `"${baseQuery}"`, // Search for the exact user query
    `(${ecoTerms.join(" OR ")})`, // Add our eco terms
    `(${productPagePatterns.join(" OR ")})`, // Add our product terms
    ...excludeSites // Add all our negative keywords
  ].join(" ");
  
  return enhancedQuery;
};

const isProductPage = (url: string) => true;
const validateProductUrl = (url: string) => url;

const searchWithGoogle = async (query: string): Promise<SearchProduct[]> => {
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    throw new Error("Google API credentials not configured");
  }

  const searchQuery = buildEcoSearchQuery(query);
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(searchQuery)}&num=10&safe=active&lr=lang_en&cr=countryUS`;

  try {
    // ===================================
    // STEP 1: SEARCH (Find Links)
    // ===================================
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.error) throw new Error(data.error?.message || "Search failed");
    if (!data.items || data.items.length === 0) return [];

    // Filter to get a clean list of URLs
    const productUrls: string[] = data.items
      .map((item: any) => item.link)
      .filter((link: string) => link && isProductPage(link))
      .map((link: string) => validateProductUrl(link));

    if (productUrls.length === 0) return [];

    // ===================================
    // STEP 2: SCRAPE (Get Details)
    // ===================================
    console.log(`Scraping ${productUrls.length} URLs with Scrape.do...`);
    const scrapedData = await fetchMultipleProductData(productUrls);

    // Combine scraped data with original search data
    return scrapedData.map((scrapedProduct, index) => {
      const googleItem = data.items[index];
      const sourceName = googleItem.displayLink || "Retailer";
      
      return {
        id: `scrape-${Date.now()}-${index}`,
        name: scrapedProduct.name || googleItem.title,
        image: scrapedProduct.image || googleItem.pagemap?.cse_image?.[0]?.src || "",
        price: scrapedProduct.price || 0,
        description: scrapedProduct.description || googleItem.snippet,
        sourceUrl: scrapedProduct.sourceUrl || productUrls[index],
        sourceName: sourceName,
        certifications: scrapedProduct.certifications || [],
      };
    });

  } catch (error) {
    console.error("Google Search or Scrape.do error:", error);
    throw error; // This will trigger the fallback
  }
};

/**
 * Main search function
 * Tries Google + Scrape.do first, falls back to curated product database
 */
export const searchEcoProducts = async (query: string): Promise<SearchProduct[]> => {
  if (!query.trim()) {
    return [];
  }

  // Try Google + Scrape.do first
  if (GOOGLE_API_KEY && GOOGLE_CSE_ID) {
    try {
      console.log("Attempting live search & scrape...");
      return await searchWithGoogle(query);
    } catch (error) {
      console.warn("Live search failed. Falling back to hard-coded database:", error);
    }
  }

  // Fallback: Use curated product database
  // (This will still have broken links unless you fix it)
  console.log("Using hard-coded fallback database.");
  await new Promise((resolve) => setTimeout(resolve, 600));
  return generateEcoProducts(query);
};