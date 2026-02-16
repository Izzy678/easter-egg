'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SeriesHeader } from '@/components/series/SeriesHeader';
import { SeasonCard } from '@/components/series/SeasonCard';
import { WatchlistToggle } from '@/components/watchlist/WatchlistToggle';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function SeriesDetailPage() {
  const params = useParams();
  const seriesId = params.id as string;
  const [series, setSeries] = useState<any>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeries();
    fetchSeasons();
  }, [seriesId]);

  const fetchSeries = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/series/${seriesId}`);
      const data = await response.json();
      setSeries(data);
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeasons = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/series/${seriesId}/seasons`);
      const data = await response.json();
      setSeasons(data);
    } catch (error) {
      console.error('Error fetching seasons:', error);
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

  if (!series) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div>Series not found</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <SeriesHeader series={series} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <WatchlistToggle itemType="series" itemId={series.id} />
          </div>
          <h2 className="text-3xl font-bold mb-6">Seasons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasons.map((season) => (
              <SeasonCard
                key={season.id}
                season={season}
                seriesId={seriesId}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
