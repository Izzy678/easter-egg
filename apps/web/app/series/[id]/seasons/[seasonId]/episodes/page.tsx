'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { EpisodeList } from '@/components/series/EpisodeList';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import { Button } from '@/components/shared/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EpisodesPage() {
  const params = useParams();
  const seriesId = params.id as string;
  const seasonId = params.seasonId as string;
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEpisodes();
  }, [seriesId, seasonId]);

  const fetchEpisodes = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/series/${seriesId}/seasons/${seasonId}/episodes`
      );
      const data = await response.json();
      setEpisodes(data);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button asChild variant="ghost" className="mb-6">
            <Link href={`/series/${seriesId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Series
            </Link>
          </Button>

          {loading ? (
            <div>Loading episodes...</div>
          ) : (
            <EpisodeList episodes={episodes} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
