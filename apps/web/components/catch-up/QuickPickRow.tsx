'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecapMediaCard, type RecapMediaCardItem } from './RecapMediaCard';
import { RecapMediaCardSkeleton } from './RecapMediaCardSkeleton';
import { cn } from '@/lib/utils';

interface QuickPickRowProps {
  title: string;
  items: RecapMediaCardItem[];
  loading?: boolean;
  onSelect: (item: RecapMediaCardItem) => void;
  className?: string;
}

function filterDisplayable(item: RecapMediaCardItem): boolean {
  return item.media_type === 'movie' || item.media_type === 'tv';
}

const SCROLL_AMOUNT = 320;

export function QuickPickRow({
  title,
  items,
  loading = false,
  onSelect,
  className,
}: QuickPickRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const threshold = 2;
    setCanScrollLeft(scrollLeft > threshold);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - threshold);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    el.addEventListener('scroll', updateScrollState);
    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', updateScrollState);
    };
  }, [updateScrollState, loading, items.length]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const displayItems = items.filter(filterDisplayable);
  const showArrows = !loading && displayItems.length > 0;

  return (
    <section className={cn('space-y-3', className)}>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="relative">
        {showArrows && canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 z-10 flex h-full w-10 min-w-10 items-center justify-center bg-gradient-to-r from-background/90 to-transparent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <ChevronLeft className="h-6 w-6" />
            </span>
          </button>
        )}
        {showArrows && canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 z-10 flex h-full w-10 min-w-10 items-center justify-center bg-gradient-to-l from-background/90 to-transparent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll right"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <ChevronRight className="h-6 w-6" />
            </span>
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden pb-2 px-4 scrollbar-hide"
        >
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <RecapMediaCardSkeleton key={i} />
              ))}
            </>
          ) : displayItems.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nothing to show yet.</p>
          ) : (
            displayItems.map((item) => (
              <RecapMediaCard
                key={`${item.media_type}-${item.id}`}
                item={item}
                onClick={() => onSelect(item)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
