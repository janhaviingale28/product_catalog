import { Link, useLocation } from 'react-router-dom';
import type { Product } from '../types';
import { capitalize } from '../utils/format';
import ImageWithFallback from './ImageWithFallback';
import PriceTag from './PriceTag';

export default function ProductCard({ product }: { product: Product }) {
  const location = useLocation();

  return (
    <li className="card">
      {/* `from` lets the detail page return to the same filters/search */}
      <Link to={`/products/${product._id}`} state={{ from: location.search }} className="card__link">
        <div className="card__media">
          <ImageWithFallback src={product.image} alt={product.title} className="card__img" />
          {product.isNew && <span className="badge">New</span>}
        </div>
        <div className="card__body">
          <p className="card__category">{capitalize(product.category)}</p>
          <h2 className="card__title">{product.title}</h2>
          <PriceTag product={product} />
        </div>
      </Link>
    </li>
  );
}
