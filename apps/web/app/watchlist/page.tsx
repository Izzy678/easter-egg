'use client';

import { useState, useEffect } from 'react';
import { WatchlistGrid } from '@/components/watchlist/WatchlistGrid';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';

// For MVP, using a simple userId - can be replaced with actual auth later
const USER_ID = 'user-1';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'watched' | 'unwatched'>('all');

  useEffect(() => {
    fetchWatchlist();
  }, [filter]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ userId: USER_ID });
      if (filter === 'watched') params.append('watched', 'true');
      if (filter === 'unwatched') params.append('watched', 'false');

      const response = await fetch(`http://localhost:3000/api/watchlist?${params}`);
      const data = await response.json();
      setWatchlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/watchlist/${id}`, {
        method: 'DELETE',
      });
      fetchWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleToggleWatched = async (id: number, watched: boolean) => {
    try {
      await fetch(`http://localhost:3000/api/watchlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watched }),
      });
      fetchWatchlist();
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">My Watchlist</h1>

          <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unwatched">Unwatched</TabsTrigger>
              <TabsTrigger value="watched">Watched</TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="text-center py-12">Loading watchlist...</div>
          ) : (
            <WatchlistGrid
              items={watchlist}
              onRemove={handleRemove}
              onToggleWatched={handleToggleWatched}
            />
          )}

          {!loading && watchlist.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Your watchlist is empty. Start adding movies and series!
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
