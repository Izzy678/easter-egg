'use client';

import Link from 'next/link';
import { Button } from '@/components/shared/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shared/ui/card';
import Image from 'next/image';

interface SeasonCardProps {
  season: any;
  seriesId: string;
}

export function SeasonCard({ season, seriesId }: SeasonCardProps) {
  return (
    <Card className="overflow-hidden">
      {season.posterUrl && (
        <div className="relative w-full h-48">
          <Image
            src={season.posterUrl}
            alt={`Season ${season.seasonNumber}`}
            fill
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>Season {season.seasonNumber}</CardTitle>
        {season.name && <CardDescription>{season.name}</CardDescription>}
      </CardHeader>
      <CardContent>
        {season.overview && (
          <p className="text-sm text-muted-foreground line-clamp-3">{season.overview}</p>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          {season.episodeCount} {season.episodeCount === 1 ? 'Episode' : 'Episodes'}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/series/${seriesId}/seasons/${season.id}/recap`}>
            View Recap
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/series/${seriesId}/seasons/${season.id}/episodes`}>
            Episodes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
