import { SearchProduct, CertificationType } from "@/types/product";

/**
 * Product Extractor Service
 * 
 * This service extracts product information from retailer websites.
 * 
 * NOTE: Due to CORS restrictions, this requires a backend proxy service.
 * Options:
 * 1. Create a backend API endpoint that scrapes product pages
 * 2. Use a service like ScraperAPI (https://www.scraperapi.com/)
 * 3. Use a CORS proxy service
 * 
 * For production, implement a backend service that:
 * - Fetches the product page HTML
 * - Parses product data (name, image, price, description)
 * - Extracts certifications from page content
 * - Returns structured product data
 */

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || "";
const SCRAPER_API_KEY = import.meta.env.VITE_SCRAPER_API_KEY || "";

/**
 * Extract certifications from text content
 */
export const extractCertifications = (text: string): CertificationType[] => {
  const certifications: CertificationType[] = [];
  const normalizedText = text.toLowerCase();

  const certPatterns: Record<CertificationType, RegExp[]> = {
    "Fair Trade": [/fair trade/i, /fairtrade/i],
    "GOTS": [/gots/i, /global organic textile standard/i],
    "B Corp": [/b corp/i, /b-corp/i, /bcorp/i],
    "Organic": [/organic certified/i, /certified organic/i],
    "Recycled": [/recycled materials/i, /made from recycled/i],
    "FSC": [/fsc certified/i, /forest stewardship council/i],
    "Carbon Neutral": [/carbon neutral/i, /carbon-neutral/i],
    "Cradle to Cradle": [/cradle to cradle/i, /c2c/i],
    "Bluesign": [/bluesign/i],
    "OEKO-TEX": [/oeko-tex/i, /oekotex/i],
    "USDA Organic": [/usda organic/i],
    "Rainforest Alliance": [/rainforest alliance/i],
  };

  for (const [cert, patterns] of Object.entries(certPatterns)) {
    if (patterns.some(pattern => pattern.test(normalizedText))) {
      certifications.push(cert as CertificationType);
    }
  }

  return certifications;
};

/**
 * Extract product data from HTML content
 * This is a basic parser - in production, use a proper HTML parser like Cheerio
 */
export const extractProductData = (html: string, url: string): Partial<SearchProduct> => {
  // Extract product name (common patterns)
  const nameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>|"name":\s*"([^"]+)"/i);
  const name = nameMatch ? (nameMatch[1] || nameMatch[2]) : "";

  // Extract product image (common patterns)
  const imageMatch = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*class=["'][^"']*product[^"']*["']/i) ||
    html.match(/"image":\s*"([^"]+)"/i) ||
    html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  const image = imageMatch ? imageMatch[1] : "";

  // Extract price (common patterns)
  const priceMatch = html.match(/"price":\s*"?(\d+\.?\d*)"?/i) ||
    html.match(/\$(\d+\.?\d*)/) ||
    html.match(/<span[^>]*class=["'][^"']*price[^"']*["'][^>]*>.*?\$(\d+\.?\d*)/i);
  const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

  // Extract description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<p[^>]*class=["'][^"']*description[^"']*["'][^>]*>([^<]+)<\/p>/i);
  const description = descMatch ? descMatch[1] : "";

  // Extract certifications
  const certifications = extractCertifications(html);

  return {
    name: name.trim(),
    image: image.startsWith("http") ? image : (image.startsWith("//") ? `https:${image}` : image),
    price,
    description: description.trim(),
    certifications,
  };
};

/**
 * Fetch and extract product data from a URL
 * Requires a backend proxy due to CORS restrictions
 */
export const fetchProductData = async (url: string): Promise<Partial<SearchProduct>> => {
  try {
    let response: Response;

    if (SCRAPER_API_KEY) {
      // Use ScraperAPI if available
      const scraperUrl = `https://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(url)}`;
      response = await fetch(scraperUrl);
    } else if (BACKEND_API_URL) {
      // Use custom backend API
      response = await fetch(`${BACKEND_API_URL}/api/extract-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } else {
      // Try direct fetch (will fail due to CORS, but useful for same-origin)
      response = await fetch(url, {
        mode: "cors",
        headers: {
          "Accept": "text/html",
        },
      });
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch product page: ${response.statusText}`);
    }

    const html = await response.text();
    return extractProductData(html, url);
  } catch (error) {
    console.error("Error fetching product data:", error);
    return {};
  }
};

/**
 * Batch fetch product data from multiple URLs
 */
export const fetchMultipleProductData = async (
  urls: string[]
): Promise<Array<Partial<SearchProduct>>> => {
  const results = await Promise.allSettled(
    urls.map(url => fetchProductData(url))
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return {
        ...result.value,
        sourceUrl: urls[index],
      };
    }
    return { sourceUrl: urls[index] };
  });
};

