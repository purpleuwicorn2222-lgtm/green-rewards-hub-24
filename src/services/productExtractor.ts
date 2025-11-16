import { SearchProduct, CertificationType } from "@/types/product";

const SCRAPEDO_API_KEY = import.meta.env.VITE_SCRAPEDO_API_KEY || "";

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

export const fetchProductData = async (url: string): Promise<Partial<SearchProduct>> => {
  if (!SCRAPEDO_API_KEY) {
    console.error("Scrape.do API key not configured");
    return { sourceUrl: url, name: "API Key Missing", price: 0 };
  }
  try {
    const scrapeDoUrl = `https://api.scrape.do?token=${SCRAPEDO_API_KEY}&url=${encodeURIComponent(url)}`;
    const response = await fetch(scrapeDoUrl);
    if (!response.ok) throw new Error(`Scrape.do failed: ${response.statusText}`);
    const html = await response.text();
    return extractProductData(html, url);
  } catch (error) {
    console.error("Error fetching product data:", error);
    return { sourceUrl: url, name: "Scrape Failed", price: 0 };
  }
};

export const fetchMultipleProductData = async (
  urls: string[]
): Promise<Array<Partial<SearchProduct>>> => {
  const results = await Promise.allSettled(
    urls.map(url => fetchProductData(url))
  );
  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return { ...result.value, sourceUrl: urls[index] };
    }
    return { sourceUrl: urls[index], name: "Scrape Failed" };
  });
};