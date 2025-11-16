export interface SearchProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  sourceUrl: string;
  sourceName?: string;
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

