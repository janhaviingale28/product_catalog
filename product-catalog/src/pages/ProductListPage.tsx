import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllProducts } from '../api/products';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import StatusMessage from '../components/StatusMessage';
import { useAsync } from '../hooks/useAsync';
import type { ProductFilters, SortKey } from '../types';
import { DEFAULT_FILTERS, filterProducts, getCategories } from '../utils/products';

const SORT_KEYS: SortKey[] = ['featured', 'price-asc', 'price-desc', 'rating'];

export default function ProductListPage() {
  const { state, retry } = useAsync((signal) => fetchAllProducts(signal), []);
  const [params, setParams] = useSearchParams();

  // Filters live in the URL so they survive navigation, refresh and sharing.
  const sortParam = params.get('sort') as SortKey | null;
  const filters: ProductFilters = {
    category: params.get('category') ?? DEFAULT_FILTERS.category,
    query: params.get('q') ?? DEFAULT_FILTERS.query,
    sort: sortParam && SORT_KEYS.includes(sortParam) ? sortParam : DEFAULT_FILTERS.sort,
  };

  const updateFilters = (next: Partial<ProductFilters>) => {
    const merged = { ...filters, ...next };
    const nextParams = new URLSearchParams();
    if (merged.query) nextParams.set('q', merged.query);
    if (merged.category !== 'all') nextParams.set('category', merged.category);
    if (merged.sort !== 'featured') nextParams.set('sort', merged.sort);
    setParams(nextParams, { replace: true });
  };

  const products = state.status === 'success' ? state.data : [];
  const categories = useMemo(() => getCategories(products), [products]);
  const visible = useMemo(() => filterProducts(products, filters), [products, filters.category, filters.query, filters.sort]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="page-head">
        <h1>All products</h1>
        {state.status === 'success' && (
          <p className="page-head__count" aria-live="polite">
            {visible.length} of {products.length} items
          </p>
        )}
      </div>

      {state.status === 'loading' && <ProductSkeleton />}

      {state.status === 'error' && (
        <StatusMessage tone="error" title="Products did not load" message={state.error.message}>
          <button type="button" className="btn" onClick={retry}>Try again</button>
        </StatusMessage>
      )}

      {state.status === 'success' && (
        <>
          <FilterBar filters={filters} categories={categories} onChange={updateFilters} />

          {visible.length === 0 ? (
            <StatusMessage title="No matching products" message="Try a different search or choose another category.">
              <button type="button" className="btn" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </button>
            </StatusMessage>
          ) : (
            <ul className="grid">
              {visible.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
