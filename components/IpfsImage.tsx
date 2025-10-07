'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { resolveIpfsUrl } from '@/lib/ipfs';

interface IpfsImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  tokenId?: string | number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  cacheVersion?: string | number;
}

export function IpfsImage({
  src,
  alt,
  width = 200,
  height = 200,
  className = '',
  fallbackSrc = '/images/placeholder.webp',
  tokenId,
  fill = false,
  sizes,
  priority = false,
  loading = 'lazy',
  cacheVersion,
}: Readonly<IpfsImageProps>) {
  const isMountedRef = useRef(false);
  const lastSrcRef = useRef(src);
  const lastVersionRef = useRef(cacheVersion);

  // Используем локальное изображение как основной источник, если доступен tokenId
  const [currentSrc, setCurrentSrc] = useState(() => {
    // Если у нас есть tokenId, используем локальное изображение
    if (tokenId) {
      return `/nft/${tokenId}.webp`;
    }
    
    // Normalize external/IPFS URLs so next/image receives http(s) or local paths
    const normalized = resolveIpfsUrl(src || fallbackSrc);
    return normalized || fallbackSrc;
  });
  
  // hasError not needed (we use currentSrc state to track fallback)

  useEffect(() => {
    if (lastSrcRef.current !== src || lastVersionRef.current !== cacheVersion) {
      lastSrcRef.current = src;
      lastVersionRef.current = cacheVersion;
      
      // При изменении src используем локальное изображение, если доступен tokenId
      if (tokenId) {
        setCurrentSrc(`/nft/${tokenId}.webp`);
      } else {
        setCurrentSrc(resolveIpfsUrl(src || fallbackSrc));
      }
      
  // reset
      isMountedRef.current = false;
    }
  }, [src, tokenId, fallbackSrc, cacheVersion]);

  const fallbackWidth = typeof width === 'number' ? width : 320;
  const resolvedSizes =
    sizes ?? (fill ? '100vw' : 'min(' + fallbackWidth + 'px, 100vw)');
  const isLocalAsset =
    typeof currentSrc === 'string' &&
    currentSrc.startsWith('/') &&
    !currentSrc.startsWith('//');

  const handleLoad = () => {
    if (isMountedRef.current) {
      return;
    }
    isMountedRef.current = true;
  };

  const handleError = () => {
    console.log(`[Image] Handling error for: ${currentSrc}`);
    
    // Если мы пробовали локальное изображение и оно не загрузилось, 
    // показываем финальный плейсхолдер
    if (tokenId && currentSrc === `/nft/${tokenId}.webp`) {
      console.log(`[Image] Local image failed, showing fallback: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
  // switch to fallback
      return;
    }
    
    // Если это уже fallback, то ничего не делаем
    if (currentSrc === fallbackSrc) {
  // final fallback
      return;
    }

    // Все остальные случаи - показываем финальный плейсхолдер
    console.log(`[Image] All sources failed, showing fallback: ${fallbackSrc}`);
    setCurrentSrc(fallbackSrc);
  // final fallback
  };

  const imageDimensionProps = fill
    ? { fill: true as const }
    : { width, height };

  const resolvedLoading = priority ? undefined : loading ?? 'lazy';

  return (
    <Image
      src={currentSrc}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      sizes={resolvedSizes}
      priority={priority}
      {...(resolvedLoading ? { loading: resolvedLoading } : {})}
      placeholder="empty"
      unoptimized={isLocalAsset}
      {...imageDimensionProps}
    />
  );
}
