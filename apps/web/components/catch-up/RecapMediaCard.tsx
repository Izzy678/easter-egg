'use client';

import Image from 'next/image';
import { Film, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

export interface RecapMediaCardItem {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
}

interface RecapMediaCardProps {
  item: RecapMediaCardItem;
  className?: string;
  onClick?: () => void;
}

function getTitle(item: RecapMediaCardItem): string {
  if (item.media_type === 'person') return item.name ?? 'Unknown';
  return item.title ?? item.name ?? 'Unknown';
}

function getYear(item: RecapMediaCardItem): string | undefined {
  const date = item.release_date ?? item.first_air_date;
  if (!date) return undefined;
  return date.slice(0, 4);
}

function getPosterUrl(item: RecapMediaCardItem): string | null {
  const path = item.poster_path ?? item.profile_path;
  if (!path) return null;
  return `${TMDB_POSTER_BASE}${path}`;
}

export function RecapMediaCard({ item, className, onClick }: RecapMediaCardProps) {
  const title = getTitle(item);
  const year = getYear(item);
  const posterUrl = getPosterUrl(item);
  const isTv = item.media_type === 'tv';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-36 sm:w-40 flex-shrink-0 rounded-xl overflow-hidden relative group',
        'text-left transition-all duration-200 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      <div className="aspect-[2/3] w-full relative bg-muted">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 144px, 160px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            {isTv ? <Tv className="w-12 h-12" /> : <Film className="w-12 h-12" />}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="absolute top-2 left-2">
        <span
          className={cn(
            'px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm',
            isTv ? 'bg-primary-500/90 text-white' : 'bg-secondary-500/90 text-white'
          )}
        >
          {isTv ? 'TV' : 'Movie'}
        </span>
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2">{title}</h3>
        {year && <p className="text-xs text-muted-foreground mt-0.5">{year}</p>}
      </div>
    </button>
  );
}
