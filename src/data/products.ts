export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  description: string;
  ecoFeature: string;
}

export const productCategories = [
  "makeup",
  "skincare",
  "clothes",
  "tampons & pads",
  "furniture",
  "toilet paper",
  "jackets",
  "shoes",
  "toys",
  "straws"
] as const;

export type ProductCategory = typeof productCategories[number];

export const products: Record<ProductCategory, Product[]> = {
  "makeup": [
    {
      id: "makeup-1",
      name: "Natural Mascara",
      brand: "Elate Cosmetics",
      price: 28.00,
      image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400",
      category: "makeup",
      description: "Vegan, cruelty-free mascara with natural ingredients",
      ecoFeature: "Refillable packaging, plastic-free"
    },
    {
      id: "makeup-2",
      name: "Mineral Foundation",
      brand: "RMS Beauty",
      price: 42.00,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      category: "makeup",
      description: "Organic, non-toxic mineral foundation",
      ecoFeature: "Zero-waste, compostable packaging"
    },
    {
      id: "makeup-3",
      name: "Lipstick Refill",
      brand: "Zao Organic",
      price: 24.00,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
      category: "makeup",
      description: "Certified organic lipstick with bamboo case",
      ecoFeature: "Refillable bamboo packaging"
    }
  ],
  "skincare": [
    {
      id: "skincare-1",
      name: "Facial Oil Serum",
      brand: "Herbivore Botanicals",
      price: 48.00,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
      category: "skincare",
      description: "100% natural and organic facial oil",
      ecoFeature: "Glass bottle, recyclable packaging"
    },
    {
      id: "skincare-2",
      name: "Solid Face Cleanser",
      brand: "Ethique",
      price: 16.00,
      image: "https://images.unsplash.com/photo-1556228841-b5b6e5d6065f?w=400",
      category: "skincare",
      description: "Zero-waste solid cleanser bar",
      ecoFeature: "Plastic-free, compostable packaging"
    },
    {
      id: "skincare-3",
      name: "Reusable Cotton Rounds",
      brand: "LastObject",
      price: 12.00,
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400",
      category: "skincare",
      description: "Washable, reusable makeup remover pads",
      ecoFeature: "Replaces 1,750+ disposable cotton pads"
    }
  ],
  "clothes": [
    {
      id: "clothes-1",
      name: "Organic Cotton T-Shirt",
      brand: "Patagonia",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      category: "clothes",
      description: "100% organic cotton, Fair Trade certified",
      ecoFeature: "Carbon-neutral shipping"
    },
    {
      id: "clothes-2",
      name: "Recycled Denim Jeans",
      brand: "Reformation",
      price: 128.00,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      category: "clothes",
      description: "Made from recycled denim and organic cotton",
      ecoFeature: "Water-saving production process"
    },
    {
      id: "clothes-3",
      name: "Hemp Hoodie",
      brand: "tentree",
      price: 68.00,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
      category: "clothes",
      description: "Sustainable hemp blend sweatshirt",
      ecoFeature: "10 trees planted per purchase"
    }
  ],
  "tampons & pads": [
    {
      id: "tampons-1",
      name: "Organic Cotton Tampons",
      brand: "Natracare",
      price: 8.00,
      image: "https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=400",
      category: "tampons & pads",
      description: "100% organic cotton tampons",
      ecoFeature: "Biodegradable, plastic-free"
    },
    {
      id: "tampons-2",
      name: "Period Underwear",
      brand: "Thinx",
      price: 35.00,
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400",
      category: "tampons & pads",
      description: "Reusable period-proof underwear",
      ecoFeature: "Replaces 10+ disposable products"
    },
    {
      id: "tampons-3",
      name: "Menstrual Cup",
      brand: "DivaCup",
      price: 32.00,
      image: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=400",
      category: "tampons & pads",
      description: "Medical-grade silicone menstrual cup",
      ecoFeature: "Lasts up to 10 years"
    }
  ],
  "furniture": [
    {
      id: "furniture-1",
      name: "Reclaimed Wood Table",
      brand: "West Elm",
      price: 599.00,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      category: "furniture",
      description: "Dining table made from reclaimed wood",
      ecoFeature: "FSC-certified, zero deforestation"
    },
    {
      id: "furniture-2",
      name: "Bamboo Chair",
      brand: "Greenington",
      price: 289.00,
      image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400",
      category: "furniture",
      description: "Modern chair crafted from sustainable bamboo",
      ecoFeature: "Rapidly renewable material"
    },
    {
      id: "furniture-3",
      name: "Recycled Plastic Outdoor Set",
      brand: "Loll Designs",
      price: 1200.00,
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400",
      category: "furniture",
      description: "Outdoor furniture from recycled milk jugs",
      ecoFeature: "Made from 100% recycled plastic"
    }
  ],
  "toilet paper": [
    {
      id: "tp-1",
      name: "100% Bamboo Toilet Paper",
      brand: "Who Gives a Crap",
      price: 48.00,
      image: "https://images.unsplash.com/photo-1584556326561-c8c2d7d6f88d?w=400",
      category: "toilet paper",
      description: "48 rolls of sustainable bamboo TP",
      ecoFeature: "50% of profits donated to sanitation"
    },
    {
      id: "tp-2",
      name: "Recycled Paper TP",
      brand: "Seventh Generation",
      price: 24.00,
      image: "https://images.unsplash.com/photo-1585738791028-c7f0c5c6c8dd?w=400",
      category: "toilet paper",
      description: "100% recycled paper toilet tissue",
      ecoFeature: "No trees harmed, chlorine-free"
    },
    {
      id: "tp-3",
      name: "Tree-Free Toilet Paper",
      brand: "Caboo",
      price: 32.00,
      image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=400",
      category: "toilet paper",
      description: "Made from bamboo and sugarcane",
      ecoFeature: "Rapidly renewable resources"
    }
  ],
  "jackets": [
    {
      id: "jacket-1",
      name: "Recycled Down Puffer",
      brand: "Patagonia",
      price: 299.00,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      category: "jackets",
      description: "Insulated jacket with recycled down",
      ecoFeature: "Fair Trade certified, recyclable"
    },
    {
      id: "jacket-2",
      name: "Organic Denim Jacket",
      brand: "Nudie Jeans",
      price: 180.00,
      image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400",
      category: "jackets",
      description: "Classic denim jacket, organic cotton",
      ecoFeature: "Free lifetime repairs offered"
    },
    {
      id: "jacket-3",
      name: "Recycled Fleece",
      brand: "Girlfriend Collective",
      price: 98.00,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
      category: "jackets",
      description: "Cozy fleece from recycled bottles",
      ecoFeature: "Made from 100% post-consumer waste"
    }
  ],
  "shoes": [
    {
      id: "shoes-1",
      name: "Tree Runners",
      brand: "Allbirds",
      price: 98.00,
      image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400",
      category: "shoes",
      description: "Sneakers made from eucalyptus tree fiber",
      ecoFeature: "Carbon-negative production"
    },
    {
      id: "shoes-2",
      name: "Vegan Leather Boots",
      brand: "Native Shoes",
      price: 110.00,
      image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400",
      category: "shoes",
      description: "Animal-free leather alternative boots",
      ecoFeature: "100% recyclable materials"
    },
    {
      id: "shoes-3",
      name: "Recycled Ocean Plastic Sneakers",
      brand: "Adidas x Parley",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      category: "shoes",
      description: "Sneakers made from ocean plastic waste",
      ecoFeature: "Each pair removes 11 plastic bottles"
    }
  ],
  "toys": [
    {
      id: "toys-1",
      name: "Recycled Plastic Truck",
      brand: "Green Toys",
      price: 24.00,
      image: "https://images.unsplash.com/photo-1587912781100-bb9cfbb81956?w=400",
      category: "toys",
      description: "Durable toy truck from recycled materials",
      ecoFeature: "Made from 100% recycled milk jugs"
    },
    {
      id: "toys-2",
      name: "Wooden Building Blocks",
      brand: "Plan Toys",
      price: 38.00,
      image: "https://images.unsplash.com/photo-1596461200811-f6d54b0ba0f6?w=400",
      category: "toys",
      description: "Natural wood construction set",
      ecoFeature: "FSC-certified rubberwood"
    },
    {
      id: "toys-3",
      name: "Organic Cotton Plush",
      brand: "Under the Nile",
      price: 28.00,
      image: "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=400",
      category: "toys",
      description: "Soft stuffed animal, organic cotton",
      ecoFeature: "GOTS certified organic"
    }
  ],
  "straws": [
    {
      id: "straws-1",
      name: "Stainless Steel Straws",
      brand: "FinalStraw",
      price: 20.00,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      category: "straws",
      description: "Collapsible reusable metal straws with case",
      ecoFeature: "Replaces 2000+ plastic straws"
    },
    {
      id: "straws-2",
      name: "Bamboo Straw Set",
      brand: "Brush with Bamboo",
      price: 12.00,
      image: "https://images.unsplash.com/photo-1582802982180-0f9e9c06b69a?w=400",
      category: "straws",
      description: "Natural bamboo drinking straws, pack of 12",
      ecoFeature: "100% biodegradable"
    },
    {
      id: "straws-3",
      name: "Glass Straws",
      brand: "Hummingbird",
      price: 18.00,
      image: "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=400",
      category: "straws",
      description: "Durable borosilicate glass straws",
      ecoFeature: "Dishwasher safe, lifetime guarantee"
    }
  ]
};

export const getCategoryProducts = (category: string): Product[] => {
  const normalizedCategory = category.toLowerCase().trim();
  return products[normalizedCategory as ProductCategory] || [];
};

export const searchCategories = (query: string): ProductCategory | null => {
  const normalizedQuery = query.toLowerCase().trim();
  const found = productCategories.find(cat => 
    cat.toLowerCase() === normalizedQuery || 
    cat.toLowerCase().includes(normalizedQuery)
  );
  return found || null;
};
