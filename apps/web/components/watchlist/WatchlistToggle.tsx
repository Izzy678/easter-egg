'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Heart, HeartOff } from 'lucide-react';

// For MVP, using a simple userId - can be replaced with actual auth later
const USER_ID = 'user-1';

interface WatchlistToggleProps {
  itemType: 'movie' | 'series';
  itemId: number;
}

export function WatchlistToggle({ itemType, itemId }: WatchlistToggleProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistId, setWatchlistId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkWatchlistStatus();
  }, [itemType, itemId]);

  const checkWatchlistStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/watchlist?userId=${USER_ID}`
      );
      const data = await response.json();
      const items = Array.isArray(data) ? data : [];
      const existingItem = items.find(
        (item: any) => item.itemType === itemType && item.itemId === itemId
      );
      setIsInWatchlist(!!existingItem);
      setWatchlistId(existingItem?.id || null);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (isInWatchlist && watchlistId) {
      // Remove from watchlist
      try {
        await fetch(`http://localhost:3000/api/watchlist/${watchlistId}`, {
          method: 'DELETE',
        });
        setIsInWatchlist(false);
        setWatchlistId(null);
      } catch (error) {
        console.error('Error removing from watchlist:', error);
      }
    } else {
      // Add to watchlist
      try {
        const response = await fetch('http://localhost:3000/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: USER_ID,
            itemType,
            itemId,
          }),
        });
        const data = await response.json();
        setIsInWatchlist(true);
        setWatchlistId(data.id);
      } catch (error) {
        console.error('Error adding to watchlist:', error);
      }
    }
  };

  if (loading) {
    return <Button variant="outline" disabled>Loading...</Button>;
  }

  return (
    <Button
      variant={isInWatchlist ? 'default' : 'outline'}
      onClick={handleToggle}
    >
      {isInWatchlist ? (
        <>
          <HeartOff className="w-4 h-4 mr-2" />
          Remove from Watchlist
        </>
      ) : (
        <>
          <Heart className="w-4 h-4 mr-2" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}
