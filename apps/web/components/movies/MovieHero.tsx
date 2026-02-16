'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

interface MovieHeroProps {
  movie: any;
}

export function MovieHero({ movie }: MovieHeroProps) {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px]">
      {/* Backdrop */}
      {movie.backdropUrl && (
        <div className="absolute inset-0">
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
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
              src={movie.posterUrl || '/static/images/1.jpg'}
              alt={movie.title}
              width={250}
              height={375}
              className="rounded-lg shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
            {movie.plot && (
              <p className="text-lg text-muted-foreground mb-4 max-w-2xl">{movie.plot}</p>
            )}
            
            <div className="flex flex-wrap gap-4 items-center">
              {movie.year && (
                <span className="text-muted-foreground">{movie.year}</span>
              )}
              {movie.runtime && (
                <span className="text-muted-foreground">{movie.runtime} min</span>
              )}
              {movie.imdbRating && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{movie.imdbRating.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">IMDb</span>
                </div>
              )}
              {movie.rottenTomatoesRating && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{movie.rottenTomatoesRating}%</span>
                  <span className="text-muted-foreground text-sm">Rotten Tomatoes</span>
                </div>
              )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((genre: string) => (
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
