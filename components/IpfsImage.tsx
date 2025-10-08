'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface IpfsImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  tokenId?: string | number | undefined;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  cacheVersion?: string | number;
  index?: number; // Индекс для staggered loading
}

const MAX_RETRIES = 1; // Пробуем 2 раза: изначально + 1 retry (мягче)
const RETRY_DELAY = 2000; // 2 секунды между попытками (не моргает)

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
  index = 0,
}: Readonly<IpfsImageProps>) {
  const isMountedRef = useRef(false);
  const lastSrcRef = useRef(src);
  const lastVersionRef = useRef(cacheVersion);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadDelayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Используем локальное изображение как основной источник, если доступен tokenId
  const [currentSrc, setCurrentSrc] = useState(() => {
    // Если у нас есть tokenId, используем локальное изображение
    if (tokenId) {
      return `/nft/${tokenId}.webp`;
    }
    
    // Для локальных изображений используем src напрямую
    if (src && (src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:'))) {
      return src;
    }
    
    // В противном случае используем fallback
    return fallbackSrc;
  });
  
  const [isRetrying, setIsRetrying] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority); // Грузим только если priority или в viewport
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastSrcRef.current !== src || lastVersionRef.current !== cacheVersion) {
      lastSrcRef.current = src;
      lastVersionRef.current = cacheVersion;
      
      // Сбрасываем retry счетчик при изменении src
      retryCountRef.current = 0;
      setIsRetrying(false);
      
      // Очищаем таймер если есть
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      
      // При изменении src используем локальное изображение, если доступен tokenId
      if (tokenId) {
        setCurrentSrc(`/nft/${tokenId}.webp`);
      } else if (src && (src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:'))) {
        setCurrentSrc(src);
      } else {
        setCurrentSrc(fallbackSrc);
      }
      
      // reset
      isMountedRef.current = false;
    }
  }, [src, tokenId, fallbackSrc, cacheVersion]);

  // Cleanup retry timer на unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      if (loadDelayTimerRef.current) {
        clearTimeout(loadDelayTimerRef.current);
        loadDelayTimerRef.current = null;
      }
    };
  }, []);

  // Умный lazy loading: батчинг для первых + IntersectionObserver для остальных
  useEffect(() => {
    // Если priority - грузим сразу
    if (priority) {
      setShouldLoad(true);
      return;
    }

    // БАТЧИНГ только для первых 20 изображений (быстрый старт)
    const BATCH_SIZE = 6; // Меньше батч = надежнее
    const BATCH_DELAY = 800; // Больше задержка = стабильнее
    const EAGER_LOAD_LIMIT = 20; // Первые 20 - батчинг, остальные - lazy
    
    if (index < EAGER_LOAD_LIMIT) {
      // Первые 20 - загружаем батчами
      const batchIndex = Math.floor(index / BATCH_SIZE);
      const delay = batchIndex * BATCH_DELAY;

      if (process.env.NODE_ENV === 'development' && index % BATCH_SIZE === 0) {
        console.log(`[Batch ${batchIndex}] Eager loading images ${index}-${index + BATCH_SIZE - 1} with ${delay}ms delay`);
      }

      const loadTimeout = setTimeout(() => {
        setShouldLoad(true);
      }, delay);

      loadDelayTimerRef.current = loadTimeout;

      return () => {
        clearTimeout(loadTimeout);
      };
    }

    // Для остальных (20+) - используем IntersectionObserver (настоящий lazy loading)
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Lazy] Loading image ${index} (in viewport)`);
            }
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Загружаем за 200px до появления в viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority, index]);

  const fallbackWidth = typeof width === 'number' ? width : 320;
  const resolvedSizes =
    sizes ?? (fill ? '100vw' : 'min(' + fallbackWidth + 'px, 100vw)');
  const isLocalAsset =
    typeof currentSrc === 'string' &&
    (currentSrc.startsWith('/') || currentSrc.startsWith('data:') || currentSrc.startsWith('blob:')) &&
    !currentSrc.startsWith('//');

  const handleLoad = () => {
    if (isMountedRef.current) {
      return;
    }
    isMountedRef.current = true;
  };

  const handleError = () => {
    // Если уже в процессе retry, не запускаем еще один (АНТИМИГАНИЕ)
    if (isRetrying) {
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Image] Error loading: ${currentSrc}, retry count: ${retryCountRef.current}`);
    }
    
    // Если это локальное изображение и у нас еще есть попытки
    if (tokenId && currentSrc === `/nft/${tokenId}.webp` && retryCountRef.current < MAX_RETRIES) {
      retryCountRef.current += 1;
      setIsRetrying(true);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Image] Retrying local image for tokenId ${tokenId}, attempt ${retryCountRef.current}/${MAX_RETRIES} (waiting ${RETRY_DELAY}ms)`);
      }
      
      // Ждем подольше чтобы не моргало
      retryTimerRef.current = setTimeout(() => {
        // Проверяем что компонент еще смонтирован
        if (!isMountedRef.current) {
          setIsRetrying(false);
          // Добавляем timestamp чтобы форсировать перезагрузку
          setCurrentSrc(`/nft/${tokenId}.webp?retry=${retryCountRef.current}&t=${Date.now()}`);
        }
      }, RETRY_DELAY);
      
      return;
    }
    
    // Если это локальное изображение и все попытки исчерпаны
    if (tokenId && currentSrc.startsWith(`/nft/${tokenId}.webp`)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Image] All retries failed for tokenId ${tokenId}, showing placeholder`);
      }
      // Используем локальный placeholder (НЕ IPFS!)
      setCurrentSrc('/images/placeholder.webp');
      return;
    }
    
    // Если это уже fallback, то ничего не делаем
    if (currentSrc === fallbackSrc || currentSrc === '/images/placeholder.webp') {
      // final fallback
      return;
    }

    // Все остальные случаи - показываем финальный плейсхолдер
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Image] Showing placeholder for: ${currentSrc}`);
    }
    setCurrentSrc('/images/placeholder.webp');
  };

  const imageDimensionProps = fill
    ? { fill: true as const }
    : { width, height };

  const resolvedLoading = priority ? undefined : loading ?? 'lazy';

  // Показываем placeholder пока не shouldLoad (для IntersectionObserver)
  if (!shouldLoad) {
    return (
      <div 
        ref={imgRef}
        className={className}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          opacity: 0.3,
        }}
      />
    );
  }

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
      unoptimized={false}
      {...imageDimensionProps}
    />
  );
}