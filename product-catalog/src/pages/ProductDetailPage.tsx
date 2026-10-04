import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { fetchProduct, getCachedProduct } from '../api/products';
import ImageWithFallback from '../components/ImageWithFallback';
import PriceTag from '../components/PriceTag';
import Rating from '../components/Rating';
import StatusMessage from '../components/StatusMessage';
import { useAsync } from '../hooks/useAsync';
import { capitalize } from '../utils/format';
import type { Product } from '../types';

export default function ProductDetailPage() {
  const { id = '' } = useParams();
  const location = useLocation();
  // Return to the list with the same filters the visitor had applied.
  const backTo = `/${(location.state as { from?: string } | null)?.from ?? ''}`;

  const { state, retry } = useAsync((signal) => fetchProduct(id, signal), [id]);
  // If the list was already loaded, show that data instantly and while retrying.
  const product: Product | undefined = state.status === 'success' ? state.data : getCachedProduct(id);

  const back = (
    <Link to={backTo} className="back-link">
      <span aria-hidden="true">←</span> Back to Products
    </Link>
  );

  if (!product) {
    if (state.status === 'loading') {
      return (
        <>
          {back}
          <div className="detail" aria-busy="true" aria-label="Loading product">
            <div className="skeleton skeleton--detail-media" />
            <div className="detail__info">
              <div className="skeleton skeleton--line skeleton--short" />
              <div className="skeleton skeleton--line skeleton--title" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </div>
          </div>
        </>
      );
    }

    const notFound = state.status === 'error' && (state.error as { status?: number }).status === 404;
    return (
      <>
        {back}
        <StatusMessage
          tone={notFound ? 'neutral' : 'error'}
          title={notFound ? 'Product not found' : 'Product did not load'}
          message={state.status === 'error' ? state.error.message : undefined}
        >
          {!notFound && <button type="button" className="btn" onClick={retry}>Try again</button>}
          <Link to="/" className="btn btn--ghost">Browse all products</Link>
        </StatusMessage>
      </>
    );
  }

  return <ProductDetail product={product} back={back} stale={state.status === 'error'} onRetry={retry} />;
}

interface DetailProps {
  product: Product;
  back: React.ReactNode;
  /** True when we are showing cached data because the live request failed. */
  stale: boolean;
  onRetry: () => void;
}

function ProductDetail({ product, back, stale, onRetry }: DetailProps) {
  const [size, setSize] = useState<string | null>(null);
  const inStock = product.stock > 0;

  return (
    <>
      {back}
      {stale && (
        <div className="notice" role="status">
          Showing saved details. We could not refresh this item.{' '}
          <button type="button" className="link-btn" onClick={onRetry}>Try again</button>
        </div>
      )}

      <article className="detail">
        <div className="detail__media">
          <ImageWithFallback src={product.image} alt={product.title} className="detail__img" eager />
          {product.isNew && <span className="badge">New</span>}
        </div>

        <div className="detail__info">
          <p className="detail__meta">
            {capitalize(product.category)}, {capitalize(product.type)}, {product.brand}
          </p>
          <h1 className="detail__title">{product.title}</h1>
          <Rating value={product.rating} />
          <PriceTag product={product} large />

          <h2 className="detail__heading">Description</h2>
          <p className="detail__desc">{product.description}</p>

          {product.size?.length > 0 && (
            <>
              <h2 className="detail__heading">Size</h2>
              <div className="chips" role="group" aria-label="Choose a size">
                {product.size.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="chip"
                    aria-pressed={size === s}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          <p className={inStock ? 'stock stock--in' : 'stock stock--out'}>
            {inStock ? `In stock (${product.stock} available)` : 'Out of stock'}
          </p>
        </div>
      </article>
    </>
  );
}
