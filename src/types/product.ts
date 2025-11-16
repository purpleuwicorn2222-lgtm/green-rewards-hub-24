export type CertificationType = 
  | "Fair Trade"
  | "GOTS"
  | "B Corp"
  | "Organic"
  | "Recycled"
  | "FSC"
  | "Carbon Neutral"
  | "Cradle to Cradle"
  | "Bluesign"
  | "OEKO-TEX"
  | "USDA Organic"
  | "Rainforest Alliance";

export interface SearchProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  sourceUrl: string;
  sourceName?: string;
  certifications?: CertificationType[];
  ecoFeatures?: string;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  sourceUrl: string;
  quantity: number;
}

