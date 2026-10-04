/** A product as returned by https://fakestoreapi.noksha.dev/api/products */
export interface Product {
  _id: number;
  title: string;
  isNew: boolean;
  /** Original list price (the API sends it as a string). */
  oldPrice: string;
  price: number;
  discountedPrice: number;
  description: string;
  category: string;
  type: string;
  stock: number;
  brand: string;
  size: string[];
  image: string;
  rating: number;
}

/** Paginated list response. */
export interface ProductsResponse {
  data: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export interface ProductFilters {
  category: string; // 'all' or a category name
  query: string;
  sort: SortKey;
}
