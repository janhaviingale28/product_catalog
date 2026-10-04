import type { Product } from '../types';
import { filterProducts, getCategories } from './products';

const make = (over: Partial<Product>): Product => ({
  _id: 1, title: 'Item', isNew: false, oldPrice: '10', price: 10, discountedPrice: 10,
  description: '', category: 'men', type: 'shirt', stock: 1, brand: 'Acme', size: ['M'], image: '', rating: 3,
  ...over,
});

const products = [
  make({ _id: 1, title: 'Yellow Hoody', category: 'men', discountedPrice: 30, rating: 4, type: 'hoodie' }),
  make({ _id: 2, title: 'Blue jeans', category: 'women', discountedPrice: 20, rating: 5, brand: 'DenimCo' }),
  make({ _id: 3, title: 'Kids set', category: 'kids', discountedPrice: 10, rating: 2 }),
];
const base = { category: 'all', query: '', sort: 'featured' } as const;

describe('filterProducts', () => {
  it('returns everything by default', () => {
    expect(filterProducts(products, base)).toHaveLength(3);
  });

  it('filters by category', () => {
    expect(filterProducts(products, { ...base, category: 'women' }).map((p) => p._id)).toEqual([2]);
  });

  it('searches title, brand and type case-insensitively', () => {
    expect(filterProducts(products, { ...base, query: 'HOODIE' }).map((p) => p._id)).toEqual([1]);
    expect(filterProducts(products, { ...base, query: 'denimco' }).map((p) => p._id)).toEqual([2]);
  });

  it('sorts by price and rating without mutating the input', () => {
    expect(filterProducts(products, { ...base, sort: 'price-asc' }).map((p) => p._id)).toEqual([3, 2, 1]);
    expect(filterProducts(products, { ...base, sort: 'price-desc' }).map((p) => p._id)).toEqual([1, 2, 3]);
    expect(filterProducts(products, { ...base, sort: 'rating' }).map((p) => p._id)).toEqual([2, 1, 3]);
    expect(products.map((p) => p._id)).toEqual([1, 2, 3]);
  });

  it('lists unique sorted categories', () => {
    expect(getCategories(products)).toEqual(['kids', 'men', 'women']);
  });
});
