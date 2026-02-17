'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

interface SeriesHeaderProps {
  series: any;
}

export function SeriesHeader({ series }: SeriesHeaderProps) {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px]">
      {/* Backdrop */}
      {series.backdropUrl && (
        <div className="absolute inset-0">
          <Image
            src={series.backdropUrl}
            alt={series.title ? `${series.title} backdrop` : 'Series backdrop'}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-12">
        <div className="flex gap-6">
          {/* Poster */}
          <div className="hidden md:block flex-shrink-0">
            <Image
              src={series.posterUrl || '/static/images/1.jpg'}
              alt={series.title || 'Series poster'}
              width={200}
              height={300}
              className="rounded-lg shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{series.title}</h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-2xl">{series.plot}</p>
            
            <div className="flex flex-wrap gap-4 items-center">
              {series.imdbRating && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{series.imdbRating.toFixed(1)}</span>
                </div>
              )}
              <span className="text-muted-foreground">
                {series.numberOfSeasons} {series.numberOfSeasons === 1 ? 'Season' : 'Seasons'}
              </span>
              <span className="text-muted-foreground">
                {series.numberOfEpisodes} Episodes
              </span>
              {series.firstAirDate && (
                <span className="text-muted-foreground">
                  {new Date(series.firstAirDate).getFullYear()}
                </span>
              )}
            </div>

            {series.genres && series.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {series.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
