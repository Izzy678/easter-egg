'use client';

import { MovieCard } from './MovieCard';
import Link from 'next/link';

interface RecommendationsGridProps {
  movies: any[];
}

export function RecommendationsGrid({ movies }: RecommendationsGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No recommendations found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">
        Recommendations ({movies.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <MovieCard
              title={movie.title}
              poster={movie.posterUrl || '/static/images/1.jpg'}
              year={movie.year?.toString()}
              rating={movie.imdbRating}
              genres={movie.genres || []}
              size="md"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
