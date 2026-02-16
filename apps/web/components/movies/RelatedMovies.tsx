'use client';

import Link from 'next/link';
import { MovieCard } from './MovieCard';

interface RelatedMoviesProps {
  movies: any[];
}

export function RelatedMovies({ movies }: RelatedMoviesProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Related Movies</h2>
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
