'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArtType, ColorKey } from '@/types';
import { ProductArt } from './ProductArt';

interface ProductImageProps {
  src?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackArt?: {
    type: ArtType;
    color?: ColorKey;
    view?: 0 | 1 | 2 | 3 | 'bare';
  };
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  fill = true,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  fallbackArt,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) {
    if (fallbackArt) {
      return (
        <div className={`relative w-full h-full flex items-center justify-center p-4 ${className}`}>
          <ProductArt
            type={fallbackArt.type}
            color={fallbackArt.color || 'brand'}
            view={fallbackArt.view ?? 0}
          />
        </div>
      );
    }
    return (
      <div className={`relative w-full h-full bg-[var(--surface2)] flex items-center justify-center ${className}`}>
        <span className="text-xs font-semibold tracking-wider text-[var(--mute)]">EVC NIGERIA</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface2)] via-[var(--pill)] to-[var(--surface2)] animate-pulse" />
      )}

      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`object-cover object-center transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 400}
          height={height || 400}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`object-cover object-center transition-all duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
