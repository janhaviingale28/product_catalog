/** Placeholder grid shown while products load. */
export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul className="grid" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="card card--skeleton" aria-hidden="true">
          <div className="skeleton skeleton--media" />
          <div className="card__body">
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
          </div>
        </li>
      ))}
    </ul>
  );
}
