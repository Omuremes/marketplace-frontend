export interface Money {
  amount: number;
  currency: string;
}

export interface ProductAttribute {
  key: string;
  value: string;
}

export interface SellerPublic {
  id: string;
  name: string;
  rating: number;
}

export interface Offer {
  id: string;
  seller: SellerPublic;
  price: Money;
  delivery_date: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  thumbnail_url?: string;
  price: Money;
  stock: number;
  nearest_delivery_date?: string;
}

export interface ProductDetails {
  id: string;
  name: string;
  image_url?: string;
  attributes: ProductAttribute[];
  offers: Offer[];
}

export interface PaginatedProducts {
  items: ProductListItem[];
  next_cursor?: string | null;
}
