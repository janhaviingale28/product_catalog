import type { ProductFilters, SortKey } from '../types';
import { capitalize } from '../utils/format';

interface Props {
  filters: ProductFilters;
  categories: string[];
  onChange: (next: Partial<ProductFilters>) => void;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

export default function FilterBar({ filters, categories, onChange }: Props) {
  return (
    <section className="filters" aria-label="Filter products">
      <div className="filters__row">
        <label className="field field--search">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            placeholder="Search by name, brand or type"
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
          />
        </label>

        <label className="field field--sort">
          <span className="field__label">Sort by</span>
          <select value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as SortKey })}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="chips" role="group" aria-label="Category">
        {['all', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={filters.category === c}
            onClick={() => onChange({ category: c })}
          >
            {c === 'all' ? 'All' : capitalize(c)}
          </button>
        ))}
      </div>
    </section>
  );
}
