'use client';

import Link from 'next/link';
import { MovieCard } from '@/components/movies/MovieCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Trash2, Check, X } from 'lucide-react';
import Image from 'next/image';

interface WatchlistGridProps {
  items: any[];
  onRemove: (id: number) => void;
  onToggleWatched: (id: number, watched: boolean) => void;
}

export function WatchlistGrid({ items, onRemove, onToggleWatched }: WatchlistGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No items in your watchlist
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const itemData = item.movie || item.series;
        if (!itemData) return null; // Skip if data not loaded
        
        const itemType = item.itemType;
        const itemUrl = itemType === 'movie' ? `/movies/${item.itemId}` : `/series/${item.itemId}`;
        const year = itemData.year || (itemData.firstAirDate ? new Date(itemData.firstAirDate).getFullYear() : null);

        return (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative w-full h-64">
              <Image
                src={itemData.posterUrl || '/static/images/1.jpg'}
                alt={itemData.title || 'Item'}
                fill
                className="object-cover"
              />
              {item.watched && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Watched
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2">
                <Link href={itemUrl} className="hover:text-primary">
                  {itemData.title}
                </Link>
              </CardTitle>
              {year && (
                <p className="text-sm text-muted-foreground">{year}</p>
              )}
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button
                variant={item.watched ? 'outline' : 'default'}
                size="sm"
                className="flex-1"
                onClick={() => onToggleWatched(item.id, !item.watched)}
              >
                {item.watched ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Mark Unwatched
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Mark Watched
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
