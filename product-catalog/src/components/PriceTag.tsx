import type { Product } from '../types';
import { discountPercent, formatPrice } from '../utils/format';

/** Current price, with the struck-through list price and % saved when discounted. */
export default function PriceTag({ product, large }: { product: Product; large?: boolean }) {
  const saved = discountPercent(product.price, product.discountedPrice);
  return (
    <p className={large ? 'price price--large' : 'price'}>
      <span className="price__now">{formatPrice(product.discountedPrice)}</span>
      {saved > 0 && (
        <>
          <s className="price__was" aria-label={`Was ${formatPrice(product.price)}`}>{formatPrice(product.price)}</s>
          <span className="price__save">Save {saved}%</span>
        </>
      )}
    </p>
  );
}
