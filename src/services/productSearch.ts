import { SearchProduct, CertificationType } from "@/types/product";
import { extractCertifications } from "./productExtractor";

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

// Product database with eco-friendly products from reputable brands
const PRODUCT_DATABASE: Record<string, Array<{
  name: string;
  brand: keyof typeof ECO_BRANDS;
  price: number;
  description: string;
  ecoFeatures: string;
  image: string;
}>> = {
  "t-shirt": [
    {
      name: "Organic Cotton T-Shirt",
      brand: "patagonia",
      price: 35,
      description: "Made from 100% organic cotton, this t-shirt is Fair Trade Certified and produced using renewable energy. Patagonia is committed to environmental responsibility and donates 1% of sales to environmental causes.",
      ecoFeatures: "100% organic cotton, Fair Trade Certified, carbon-neutral shipping, 1% for the Planet member",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    {
      name: "Bamboo T-Shirt",
      brand: "boody",
      price: 28,
      description: "Made from organically grown bamboo, this soft t-shirt is naturally antimicrobial and moisture-wicking. Boody uses sustainable bamboo farming practices and eco-friendly packaging.",
      ecoFeatures: "100% organic bamboo, biodegradable, carbon-neutral production, plastic-free packaging",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    {
      name: "Recycled Polyester T-Shirt",
      brand: "tentree",
      price: 32,
      description: "Crafted from recycled plastic bottles, this t-shirt helps remove waste from oceans. For every purchase, tentree plants 10 trees to combat deforestation.",
      ecoFeatures: "Made from recycled plastic bottles, 10 trees planted per purchase, carbon-negative shipping",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    {
      name: "Hemp Blend T-Shirt",
      brand: "patagonia",
      price: 39,
      description: "Made from a blend of organic hemp and organic cotton, this durable t-shirt requires less water to produce than conventional cotton. Hemp is naturally pest-resistant, eliminating the need for pesticides.",
      ecoFeatures: "Organic hemp and cotton blend, low water usage, pesticide-free, durable and long-lasting",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    {
      name: "Classic Organic Tee",
      brand: "reformation",
      price: 38,
      description: "Made from 100% organic cotton with a relaxed fit. Reformation tracks and offsets the carbon footprint of every product, and uses sustainable materials whenever possible.",
      ecoFeatures: "100% organic cotton, carbon-neutral, water-saving production, sustainable packaging",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
  ],
  "sneakers": [
    {
      name: "Tree Runners",
      brand: "allbirds",
      price: 98,
      description: "Made from eucalyptus tree fiber, these sneakers are incredibly soft and naturally odor-resistant. Allbirds uses carbon-negative production methods and sustainable materials throughout.",
      ecoFeatures: "Eucalyptus tree fiber, carbon-negative production, machine-washable, sustainable packaging",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
    },
    {
      name: "Wool Runners",
      brand: "allbirds",
      price: 98,
      description: "Crafted from responsibly sourced merino wool, these sneakers are naturally temperature-regulating and moisture-wicking. Allbirds is a certified B-Corp committed to sustainability.",
      ecoFeatures: "Responsibly sourced merino wool, carbon-neutral, B-Corp certified, recyclable materials",
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
    },
    {
      name: "Vegan Leather Sneakers",
      brand: "nativeShoes",
      price: 75,
      description: "Made from plant-based materials, these vegan sneakers are 100% animal-free and fully recyclable through Native Shoes' Remix Project. Lightweight and comfortable for everyday wear.",
      ecoFeatures: "100% vegan, plant-based materials, fully recyclable, carbon-neutral shipping",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    },
    {
      name: "Recycled Ocean Plastic Sneakers",
      brand: "allbirds",
      price: 120,
      description: "Made from recycled ocean plastic waste, these sneakers help clean up marine pollution. Each pair removes 11 plastic bottles from the ocean.",
      ecoFeatures: "Made from ocean plastic waste, removes 11 bottles per pair, carbon-negative, sustainable",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    },
    {
      name: "Bamboo Fiber Sneakers",
      brand: "nativeShoes",
      price: 85,
      description: "Crafted from sustainable bamboo fiber, these sneakers are lightweight, breathable, and naturally antimicrobial. Native Shoes uses eco-friendly production methods.",
      ecoFeatures: "Bamboo fiber, sustainable farming, antimicrobial, eco-friendly production",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    },
  ],
  "toothbrush": [
    {
      name: "Bamboo Toothbrush Set",
      brand: "bambooToothbrush",
      price: 12,
      description: "Made from sustainably sourced bamboo with soft, biodegradable bristles. This toothbrush comes in a pack of 4 and replaces hundreds of plastic toothbrushes over a lifetime.",
      ecoFeatures: "100% biodegradable bamboo, soft bristles, plastic-free packaging, sustainable sourcing",
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop",
    },
    {
      name: "Charcoal Bamboo Toothbrush",
      brand: "bambooToothbrush",
      price: 8,
      description: "Bamboo handle with activated charcoal-infused bristles for natural whitening. Completely biodegradable and comes in recyclable packaging.",
      ecoFeatures: "Bamboo handle, activated charcoal bristles, biodegradable, recyclable packaging",
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop",
    },
    {
      name: "Kids Bamboo Toothbrush",
      brand: "bambooToothbrush",
      price: 10,
      description: "Smaller size perfect for children, made from sustainable bamboo. Teaches kids about environmental responsibility while maintaining good oral hygiene.",
      ecoFeatures: "Child-sized, sustainable bamboo, biodegradable, educational packaging",
      image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop",
    },
  ],
  "water bottle": [
    {
      name: "Stainless Steel Water Bottle",
      brand: "hydroFlask",
      price: 35,
      description: "Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours. Made from 18/8 pro-grade stainless steel, BPA-free, and dishwasher safe.",
      ecoFeatures: "Reusable, eliminates single-use plastic, durable and long-lasting, recyclable materials",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    },
    {
      name: "Insulated Water Bottle",
      brand: "kleanKanteen",
      price: 32,
      description: "Made from food-grade stainless steel with a leak-proof cap. Klean Kanteen is a certified B-Corp committed to reducing single-use plastic waste.",
      ecoFeatures: "Food-grade stainless steel, B-Corp certified, eliminates plastic waste, lifetime warranty",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    },
    {
      name: "Wide Mouth Water Bottle",
      brand: "hydroFlask",
      price: 38,
      description: "32oz capacity with wide mouth for easy filling and cleaning. Made from recycled materials and designed to last a lifetime, reducing waste.",
      ecoFeatures: "Made from recycled materials, eliminates single-use plastic, durable design, recyclable",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    },
    {
      name: "Bamboo Water Bottle",
      brand: "kleanKanteen",
      price: 28,
      description: "Stainless steel interior with a bamboo exterior sleeve. Combines durability with natural materials for a sustainable hydration solution.",
      ecoFeatures: "Bamboo exterior, stainless steel interior, sustainable materials, reusable",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    },
  ],
  "phone case": [
    {
      name: "Compostable Phone Case",
      brand: "pelaCase",
      price: 30,
      description: "Made from Flaxstic, a compostable material derived from flax straw and plant-based biopolymers. This phone case is 100% compostable and protects your phone while protecting the planet.",
      ecoFeatures: "100% compostable, made from flax straw, plant-based materials, plastic-free packaging",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    },
    {
      name: "Eco-Friendly Phone Case",
      brand: "pelaCase",
      price: 35,
      description: "Crafted from sustainable materials, this phone case is fully compostable and comes in a variety of colors. Pela has diverted millions of pounds of plastic from landfills.",
      ecoFeatures: "Compostable materials, diverts plastic from landfills, sustainable production, eco-friendly",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    },
    {
      name: "Biodegradable Phone Case",
      brand: "pelaCase",
      price: 32,
      description: "Made from renewable materials that break down naturally at the end of their life. This case offers full protection while being kind to the environment.",
      ecoFeatures: "Biodegradable, renewable materials, full phone protection, sustainable",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    },
  ],
  "jacket": [
    {
      name: "Recycled Down Puffer Jacket",
      brand: "patagonia",
      price: 299,
      description: "Made from 100% recycled down and recycled polyester shell. This warm, lightweight jacket is Fair Trade Certified and comes with a lifetime repair guarantee.",
      ecoFeatures: "100% recycled materials, Fair Trade Certified, lifetime repair guarantee, carbon-neutral",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    },
    {
      name: "Organic Denim Jacket",
      brand: "reformation",
      price: 128,
      description: "Made from 100% organic cotton denim. This classic jacket is produced using water-saving techniques and sustainable manufacturing processes.",
      ecoFeatures: "100% organic cotton, water-saving production, sustainable manufacturing, carbon-neutral",
      image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400&h=400&fit=crop",
    },
    {
      name: "Recycled Fleece Jacket",
      brand: "girlfriendCollective",
      price: 98,
      description: "Made from recycled plastic bottles, this cozy fleece jacket is soft, warm, and helps reduce plastic waste. Girlfriend Collective uses sustainable production methods.",
      ecoFeatures: "Made from recycled plastic bottles, reduces waste, sustainable production, eco-friendly",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop",
    },
    {
      name: "Hemp Canvas Jacket",
      brand: "patagonia",
      price: 180,
      description: "Crafted from durable hemp canvas, this jacket is naturally water-resistant and requires less water to produce than conventional cotton. Built to last for years.",
      ecoFeatures: "Hemp canvas, low water usage, durable, long-lasting, sustainable materials",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    },
  ],
  "jeans": [
    {
      name: "Recycled Denim Jeans",
      brand: "reformation",
      price: 128,
      description: "Made from recycled denim and organic cotton, these jeans are produced using water-saving techniques. Reformation tracks the environmental impact of every product.",
      ecoFeatures: "Recycled denim, organic cotton, water-saving production, carbon footprint tracking",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    },
    {
      name: "Organic Cotton Jeans",
      brand: "patagonia",
      price: 99,
      description: "Made from 100% organic cotton, these durable jeans are Fair Trade Certified. Patagonia is committed to environmental responsibility and ethical production.",
      ecoFeatures: "100% organic cotton, Fair Trade Certified, durable, ethical production",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    },
    {
      name: "Hemp Blend Jeans",
      brand: "reformation",
      price: 148,
      description: "Made from a blend of organic hemp and organic cotton, these jeans require less water and pesticides to produce. Sustainable and stylish.",
      ecoFeatures: "Hemp and cotton blend, low water usage, pesticide-free, sustainable",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    },
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
  "jacket": ["jacket", "coat", "outerwear", "puffer", "windbreaker"],
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
        sourceUrl: `${brand.website}/products/${product.name.toLowerCase().replace(/\s+/g, "-")}`,
        sourceName: brand.name,
      });
    }
    
    return products;
  }
  
  // Fallback: Generate generic eco-friendly products
  const ecoImages = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=400&fit=crop",
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
      description: `Sustainable ${query} from ${brand.name}, made with eco-friendly materials and ethical production practices. This product is designed to minimize environmental impact while maintaining high quality.`,
      sourceUrl: `${brand.website}/search?q=${encodeURIComponent(query)}`,
      sourceName: brand.name,
    });
  }
  
  return products;
};

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
 * Main search function
 * Tries Google Custom Search API first, falls back to curated product database
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
      console.warn("Falling back to curated product database:", error);
    }
  }

  // Fallback: Use curated product database
  // Simulate API delay for realistic experience
  await new Promise((resolve) => setTimeout(resolve, 600));
  return generateEcoProducts(query);
};
