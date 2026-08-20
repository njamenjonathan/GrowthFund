import React, { useEffect, useMemo, useState } from 'react';
import { Category } from '../types';
import { opportunityArt } from '../lib/opportunityArt';

interface OpportunityImageProps {
  src?: string;
  category: Category;
  /** Varies the generated artwork between offerings of one category. */
  seed: string;
  className?: string;
  /** Decorative by default: the offering name sits beside it in the DOM. */
  alt?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

/**
 * An offering image that always renders something.
 *
 * The generated artwork paints immediately as the backdrop, and the
 * photograph fades in over it once decoded. If the photo fails — blocked
 * host, no network, dead URL — the artwork simply stays. There is no
 * state in which the card shows an empty box.
 */
export const OpportunityImage: React.FC<OpportunityImageProps> = ({
  src,
  category,
  seed,
  className = '',
  alt = '',
  loading = 'lazy',
  sizes,
}) => {
  const art = useMemo(() => opportunityArt(category, seed), [category, seed]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  // Reset when the offering changes, or a cached "loaded" state would
  // carry over to a different photo.
  useEffect(() => {
    setHasLoaded(false);
    setHasFailed(false);
  }, [src]);

  return (
    <span
      className={`block relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}
      style={{ backgroundImage: `url("${art}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {src && !hasFailed && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          sizes={sizes}
          referrerPolicy="no-referrer"
          onLoad={() => setHasLoaded(true)}
          onError={() => setHasFailed(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            hasLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </span>
  );
};
