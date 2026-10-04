import type { Product, ProductFilters } from '../types';

export const DEFAULT_FILTERS: ProductFilters = { category: 'all', query: '', sort: 'featured' };

export const getCategories = (products: Product[]): string[] =>
  [...new Set(products.map((p) => p.category))].sort();

/** Applies category filter, text search (title/brand/type/category) and sorting. */
export function filterProducts(products: Product[], { category, query, sort }: ProductFilters): Product[] {
  const q = query.trim().toLowerCase();

  const result = products.filter((p) => {
    if (category !== 'all' && p.category !== category) return false;
    if (!q) return true;
    return [p.title, p.brand, p.type, p.category].some((field) => field.toLowerCase().includes(q));
  });

  switch (sort) {
    case 'price-asc':
      return [...result].sort((a, b) => a.discountedPrice - b.discountedPrice);
    case 'price-desc':
      return [...result].sort((a, b) => b.discountedPrice - a.discountedPrice);
    case 'rating':
      return [...result].sort((a, b) => b.rating - a.rating);
    default:
      return result;
  }
}
