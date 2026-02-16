'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';

interface EpisodeListProps {
  episodes: any[];
}

export function EpisodeList({ episodes }: EpisodeListProps) {
  if (episodes.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No episodes found</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6">Episodes</h2>
      {episodes.map((episode) => (
        <Card key={episode.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>
                  Episode {episode.episodeNumber}: {episode.name}
                </CardTitle>
                {episode.airDate && (
                  <CardDescription>
                    Aired: {new Date(episode.airDate).toLocaleDateString()}
                  </CardDescription>
                )}
              </div>
              {episode.runtime && (
                <span className="text-sm text-muted-foreground">{episode.runtime} min</span>
              )}
            </div>
          </CardHeader>
          {episode.overview && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{episode.overview}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
