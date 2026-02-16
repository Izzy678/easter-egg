'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MovieHero } from '@/components/movies/MovieHero';
import { MovieDetails } from '@/components/movies/MovieDetails';
import { RelatedMovies } from '@/components/movies/RelatedMovies';
import { WatchlistToggle } from '@/components/watchlist/WatchlistToggle';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id as string;
  const [movie, setMovie] = useState<any>(null);
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
    fetchRelatedMovies();
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${movieId}`);
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedMovies = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/movies/${movieId}/related`);
      const data = await response.json();
      setRelatedMovies(data);
    } catch (error) {
      console.error('Error fetching related movies:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div>Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!movie) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div>Movie not found</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <MovieHero movie={movie} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <WatchlistToggle itemType="movie" itemId={movie.id} />
          </div>
          <MovieDetails movie={movie} />
          {relatedMovies.length > 0 && (
            <div className="mt-12">
              <RelatedMovies movies={relatedMovies} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
