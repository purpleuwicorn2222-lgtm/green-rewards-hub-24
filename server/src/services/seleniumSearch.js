import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { Options } from 'selenium-webdriver/chrome.js';

/**
 * Build enhanced search query for eco-friendly products
 */
function buildEcoSearchQuery(query) {
  const baseQuery = query.toLowerCase().trim();
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
  
  // Build query with eco-friendly terms
  const enhancedQuery = `${baseQuery} ${ecoTerms.slice(0, 3).join(" OR ")} buy shop purchase`;
  return enhancedQuery;
}

/**
 * Extract product data from Google search result element
 */
function extractProductData(element, index) {
  try {
    // Try to get title
    const titleElement = element.findElement(By.css('h3'));
    const title = titleElement ? titleElement.getText() : '';
    
    // Try to get link
    const linkElement = element.findElement(By.css('a'));
    const link = linkElement ? linkElement.getAttribute('href') : '';
    
    // Try to get snippet/description
    const snippetElement = element.findElement(By.css('.VwiC3b, .s'));
    const snippet = snippetElement ? snippetElement.getText() : '';
    
    // Try to get image
    const imageElement = element.findElement(By.css('img'));
    const image = imageElement ? imageElement.getAttribute('src') : '';
    
    return {
      title: title || '',
      link: link || '',
      snippet: snippet || '',
      image: image || '',
      index
    };
  } catch (error) {
    console.error(`Error extracting product data for element ${index}:`, error);
    return null;
  }
}

/**
 * Validate if URL is a product page
 */
function isProductPage(url) {
  if (!url || url === "#" || !url.startsWith('http')) return false;
  
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.toLowerCase();
    
    if (path === "/" || path === "") return false;
    
    const productIndicators = [
      "/product/", "/products/", "/p/", "/item/", "/shop/", "/buy/", "/detail/",
      "/dp/", "/gp/product/", // Amazon
    ];
    
    const categoryIndicators = [
      "/category/", "/categories/", "/collection/", "/collections/", "/search",
      "/browse", "/all", "/list/", "/grid/",
    ];
    
    const hasProductIndicator = productIndicators.some(ind => path.includes(ind));
    const isCategoryPage = categoryIndicators.some(ind => path.includes(ind));
    const hasProductStructure = /\/[^\/]+\/[^\/]+/.test(path) && 
                                 path.split("/").filter(p => p).length >= 2;
    
    const excludedPaths = ["/cart", "/checkout", "/account", "/login", "/register", 
                           "/about", "/contact"];
    const isExcluded = excludedPaths.some(excluded => path.startsWith(excluded));
    
    return (hasProductIndicator || hasProductStructure) && 
           !isCategoryPage && 
           !isExcluded;
  } catch {
    return false;
  }
}

/**
 * Extract price from text
 */
function extractPrice(text) {
  if (!text) return 0;
  
  const pricePatterns = [
    /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g,
    /\$\s*(\d+\.?\d{0,2})/g,
    /USD\s*\$?\s*(\d+\.?\d*)/gi,
    /price[:\s]*\$?\s*(\d+\.?\d*)/gi,
    /(\d+\.?\d{2})\s*USD/gi,
    /(\d+\.?\d{2})\s*\$/, 
    /cost[:\s]*\$?\s*(\d+\.?\d*)/gi,
  ];
  
  const prices = [];
  for (const pattern of pricePatterns) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      if (match[1]) {
        const priceStr = match[1].replace(/,/g, "");
        const price = parseFloat(priceStr);
        if (price > 0 && price < 100000) {
          prices.push(price);
        }
      }
    }
  }
  
  if (prices.length > 0) {
    // Return most common price
    const priceGroups = new Map();
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
}

/**
 * Extract certifications from text
 */
function extractCertifications(text) {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const certifications = [];
  
  if (lowerText.includes("fair trade") || lowerText.includes("fairtrade")) {
    certifications.push("Fair Trade");
  }
  if (lowerText.includes("gots") || lowerText.includes("global organic textile")) {
    certifications.push("GOTS");
  }
  if (lowerText.includes("b corp") || lowerText.includes("b-corp") || lowerText.includes("bcorp")) {
    certifications.push("B Corp");
  }
  if (lowerText.includes("organic certified") || lowerText.includes("certified organic")) {
    if (lowerText.includes("usda")) {
      certifications.push("USDA Organic");
    } else {
      certifications.push("Organic");
    }
  }
  if (lowerText.includes("recycled") && (lowerText.includes("material") || lowerText.includes("made from"))) {
    certifications.push("Recycled");
  }
  if (lowerText.includes("carbon neutral") || lowerText.includes("carbon-neutral")) {
    certifications.push("Carbon Neutral");
  }
  if (lowerText.includes("fsc") || lowerText.includes("forest stewardship")) {
    certifications.push("FSC");
  }
  if (lowerText.includes("cradle to cradle") || lowerText.includes("c2c")) {
    certifications.push("Cradle to Cradle");
  }
  if (lowerText.includes("bluesign")) {
    certifications.push("Bluesign");
  }
  if (lowerText.includes("oeko-tex") || lowerText.includes("oekotex")) {
    certifications.push("OEKO-TEX");
  }
  if (lowerText.includes("rainforest alliance")) {
    certifications.push("Rainforest Alliance");
  }
  
  return certifications;
}

/**
 * Search for eco-friendly products using Selenium
 */
export async function searchProducts(query) {
  let driver = null;
  
  try {
    // Setup Chrome options for headless browsing
    const chromeOptions = new Options();
    chromeOptions.addArguments('--headless');
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--disable-gpu');
    chromeOptions.addArguments('--window-size=1920,1080');
    chromeOptions.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Create driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
    
    // Build search query
    const searchQuery = buildEcoSearchQuery(query);
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&num=20`;
    
    console.log(`Navigating to: ${googleSearchUrl}`);
    await driver.get(googleSearchUrl);
    
    // Wait for search results to load
    await driver.wait(until.elementsLocated(By.css('.g, .tF2Cxc')), 10000);
    
    // Get all search result elements
    const resultElements = await driver.findElements(By.css('.g, .tF2Cxc'));
    console.log(`Found ${resultElements.length} search results`);
    
    const products = [];
    
    // Extract data from each result
    for (let i = 0; i < Math.min(resultElements.length, 20); i++) {
      try {
        const element = resultElements[i];
        
        // Get title
        let title = '';
        try {
          const titleElement = await element.findElement(By.css('h3'));
          title = await titleElement.getText();
        } catch (e) {
          // Try alternative selector
          try {
            const altTitle = await element.findElement(By.css('h3.LC20lb'));
            title = await altTitle.getText();
          } catch (e2) {
            console.log(`Could not extract title for result ${i}`);
          }
        }
        
        // Get link
        let link = '';
        try {
          const linkElement = await element.findElement(By.css('a'));
          link = await linkElement.getAttribute('href');
        } catch (e) {
          console.log(`Could not extract link for result ${i}`);
        }
        
        // Get snippet
        let snippet = '';
        try {
          const snippetElement = await element.findElement(By.css('.VwiC3b, .s, .IsZvec'));
          snippet = await snippetElement.getText();
        } catch (e) {
          // Try alternative
          try {
            const altSnippet = await element.findElement(By.css('.aCOpRe'));
            snippet = await altSnippet.getText();
          } catch (e2) {
            console.log(`Could not extract snippet for result ${i}`);
          }
        }
        
        // Get image (if available)
        let image = '';
        try {
          const imgElement = await element.findElement(By.css('img'));
          image = await imgElement.getAttribute('src');
        } catch (e) {
          // Image not available
        }
        
        // Validate and process product
        if (link && isProductPage(link)) {
          const price = extractPrice(`${title} ${snippet}`);
          const certifications = extractCertifications(`${title} ${snippet}`);
          
          let hostname = '';
          try {
            const urlObj = new URL(link);
            hostname = urlObj.hostname.replace('www.', '');
          } catch (e) {
            hostname = 'retailer';
          }
          
          // Build description
          let description = snippet || title || '';
          if (certifications.length > 0) {
            description = `${description} This product is certified ${certifications.join(", ")}.`;
          }
          if (!description.toLowerCase().includes("eco-friendly") && 
              !description.toLowerCase().includes("sustainable")) {
            description = `Eco-friendly ${query}. ${description}`;
          }
          
          products.push({
            id: `selenium-${Date.now()}-${i}`,
            name: title || `Eco-Friendly ${query}`,
            image: image || '',
            price: price,
            description: description.trim(),
            sourceUrl: link,
            sourceName: hostname,
            certifications: certifications.length > 0 ? certifications : undefined,
          });
        }
      } catch (error) {
        console.error(`Error processing result ${i}:`, error.message);
        continue;
      }
    }
    
    // Filter to ensure products match query
    const normalizedQuery = query.toLowerCase();
    const filteredProducts = products.filter(product => {
      const productText = `${product.name} ${product.description}`.toLowerCase();
      const queryTerms = normalizedQuery.split(" ").filter(term => term.length > 2);
      return queryTerms.length === 0 || 
             queryTerms.some(term => productText.includes(term)) ||
             productText.includes(normalizedQuery);
    });
    
    // Return top 10 products
    return filteredProducts.slice(0, 10);
    
  } catch (error) {
    console.error('Selenium search error:', error);
    throw new Error(`Failed to search products: ${error.message}`);
  } finally {
    // Always close the driver
    if (driver) {
      try {
        await driver.quit();
      } catch (error) {
        console.error('Error closing driver:', error);
      }
    }
  }
}

