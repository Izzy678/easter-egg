'use client';

import Link from 'next/link';
import { MovieCard } from './MovieCard';

interface MoviesGridProps {
  movies: any[];
}

export function MoviesGrid({ movies }: MoviesGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No movies found. Try adjusting your filters.
      </div>
    );
  }

  return (
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
  );
}
