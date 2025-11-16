/**
 * Hardcoded product search - returns predefined results for specific queries
 * 
 * This replaces the previous Selenium web scraping functionality.
 * Only "hair brush" and "toothpaste" queries return results.
 * All other queries return an empty array.
 */

/**
 * Hardcoded products for "hair brush" query
 */
const HAIR_BRUSH_PRODUCTS = [
  {
    id: 'hair-brush-1',
    name: 'Bamboo Hair Brush with Natural Bristles',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    price: 24.99,
    description: 'Eco-friendly bamboo hair brush with natural boar bristles. This sustainable hair brush detangles gently while distributing natural oils. Made from 100% bamboo and biodegradable materials. Perfect for all hair types.',
    sourceUrl: 'https://www.packagefreeshop.com/products/bamboo-hair-brush',
    sourceName: 'Package Free Shop',
    certifications: ['Organic', 'Recycled'],
  },
  {
    id: 'hair-brush-2',
    name: 'Recycled Plastic Detangling Brush',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    price: 18.50,
    description: 'Sustainable detangling brush made from 100% recycled plastic. Features flexible bristles that prevent breakage and reduce static. This eco-friendly hair brush is durable and recyclable at end of life.',
    sourceUrl: 'https://www.earthhero.com/products/recycled-hair-brush',
    sourceName: 'Earth Hero',
    certifications: ['Recycled'],
  },
  {
    id: 'hair-brush-3',
    name: 'Wooden Paddle Brush - FSC Certified',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    price: 32.00,
    description: 'Beautiful wooden paddle brush made from FSC-certified sustainable wood. Features rounded bristles for gentle detangling and smooth styling. This brush is carbon neutral and comes in plastic-free packaging.',
    sourceUrl: 'https://www.grove.co/products/wooden-paddle-brush',
    sourceName: 'Grove Collaborative',
    certifications: ['FSC', 'Carbon Neutral'],
  },
];

/**
 * Hardcoded products for "toothpaste" query
 */
const TOOTHPASTE_PRODUCTS = [
  {
    id: 'toothpaste-1',
    name: 'Natural Fluoride-Free Toothpaste Tablets',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    price: 12.99,
    description: 'Zero-waste toothpaste tablets in a refillable glass jar. Made with natural ingredients, fluoride-free, and certified organic. These tablets provide effective cleaning while eliminating plastic waste. B Corp certified.',
    sourceUrl: 'https://www.byhumankind.com/products/toothpaste-tablets',
    sourceName: 'by Humankind',
    certifications: ['B Corp', 'Organic'],
  },
  {
    id: 'toothpaste-2',
    name: 'Recycled Aluminum Tube Toothpaste',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    price: 9.95,
    description: 'Eco-friendly toothpaste in a 100% recyclable aluminum tube. Made with natural ingredients and free from harmful chemicals. This sustainable toothpaste is effective, gentle, and better for the planet.',
    sourceUrl: 'https://www.davidsnaturaltoothpaste.com/products/natural-toothpaste',
    sourceName: 'Davids Natural Toothpaste',
    certifications: ['Recycled'],
  },
  {
    id: 'toothpaste-3',
    name: 'Charcoal Whitening Toothpaste - Organic',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    price: 14.50,
    description: 'USDA Organic certified charcoal toothpaste for natural whitening. Made with activated charcoal, coconut oil, and essential oils. This eco-friendly toothpaste comes in a recyclable tube and is cruelty-free.',
    sourceUrl: 'https://www.hello-products.com/products/charcoal-toothpaste',
    sourceName: 'Hello Products',
    certifications: ['USDA Organic'],
  },
];

/**
 * Search for eco-friendly products - hardcoded results only
 * 
 * This function replaces the previous Selenium web scraping implementation.
 * It returns hardcoded results for "hair brush" and "toothpaste" queries only.
 * All other queries return an empty array.
 * 
 * @param {string} query - User's search query
 * @returns {Promise<Array>} - Array of product objects or empty array
 */
export async function searchProducts(query) {
  // Normalize the query for comparison
  const normalizedQuery = query.toLowerCase().trim();
  
  console.log(`Searching for: ${query}`);
  
  // Return hardcoded results for "hair brush"
  if (normalizedQuery === 'hair brush' || normalizedQuery === 'hairbrush') {
    console.log('Returning hardcoded hair brush products');
    return HAIR_BRUSH_PRODUCTS;
  }
  
  // Return hardcoded results for "toothpaste"
  if (normalizedQuery === 'toothpaste' || normalizedQuery === 'tooth paste') {
    console.log('Returning hardcoded toothpaste products');
    return TOOTHPASTE_PRODUCTS;
  }
  
  // Return empty array for all other queries
  console.log(`No hardcoded results for query: "${query}". Returning empty array.`);
  return [];
}

