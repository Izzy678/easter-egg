'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { RecapView } from '@/components/series/RecapView';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import { Button } from '@/components/shared/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SeasonRecapPage() {
  const params = useParams();
  const seriesId = params.id as string;
  const seasonId = params.seasonId as string;
  const [recapData, setRecapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecap();
  }, [seriesId, seasonId]);

  const fetchRecap = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/series/${seriesId}/seasons/${seasonId}/recap`
      );
      const data = await response.json();
      setRecapData(data);
    } catch (error) {
      console.error('Error fetching recap:', error);
    } finally {
      setLoading(false);
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

  if (!recapData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div>Recap not found</div>
        </div>
        <Footer />
      </>
    );
  }

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

          <RecapView
            season={recapData.season}
            recap={recapData.recap}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
