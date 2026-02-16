'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/shared/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

export interface SetupPageHeroProps {
  type: 'movie' | 'tv';
  title: string;
  year?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  /** Optional: runtime in minutes (movie) or one-line text (TV) */
  runtime?: number;
  /** Optional: max 2 genre names */
  genres?: string[];
  /** Optional: short one-line overview */
  overview?: string | null;
}

export function SetupPageHero({
  type,
  title,
  year,
  posterPath,
  backdropPath,
  runtime,
  genres = [],
  overview,
}: SetupPageHeroProps) {
  const posterUrl = posterPath ? `${TMDB_POSTER_BASE}${posterPath}` : null;
  const backdropUrl = backdropPath ? `${TMDB_BACKDROP_BASE}${backdropPath}` : null;
  const isTv = type === 'tv';

  return (
    <header className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
        <Link href="/catch-up">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Catch Up
        </Link>
      </Button>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative w-full sm:w-48 aspect-[2/3] flex-shrink-0 rounded-xl overflow-hidden bg-muted">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 160px"
              priority
            />
          ) : backdropUrl ? (
            <Image
              src={backdropUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 160px"
              priority
            />
          ) : null}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span
            className={cn(
              'inline-flex w-fit px-2 py-0.5 rounded text-xs font-medium mb-2',
              isTv ? 'bg-primary-500/90 text-white' : 'bg-secondary-500/90 text-white'
            )}
          >
            {isTv ? 'TV' : 'Movie'}
          </span>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {year && <p className="text-muted-foreground text-sm mt-0.5">{year}</p>}
          {runtime != null && type === 'movie' && (
            <p className="text-muted-foreground text-sm mt-1">{runtime} min</p>
          )}
          {genres.length > 0 && (
            <p className="text-muted-foreground text-sm mt-1">
              {genres.slice(0, 2).join(' · ')}
            </p>
          )}
          {overview && (
            <p className="text-muted-foreground text-sm mt-2">{overview}</p>
          )}
        </div>
      </div>
    </header>
  );
}
