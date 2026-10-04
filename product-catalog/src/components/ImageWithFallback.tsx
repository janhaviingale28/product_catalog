import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** Lazy-loaded image that swaps to a neutral placeholder if the URL fails. */
export default function ImageWithFallback({ src, alt, className, eager }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`img-fallback ${className ?? ''}`} role="img" aria-label={`${alt} (image unavailable)`}>
        Image unavailable
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
