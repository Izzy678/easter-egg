'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { RecapMarkdown } from '@/components/recap/RecapMarkdown';

interface RecapViewProps {
  season: any;
  recap: any;
}

export function RecapView({ season, recap }: RecapViewProps) {
  if (!recap) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Season {season.seasonNumber} Recap</CardTitle>
          <CardDescription>No recap available yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Season {season.seasonNumber} Recap</CardTitle>
          {season.name && <CardDescription>{season.name}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          <RecapMarkdown content={recap.content} />

          {recap.keyPlotPoints && recap.keyPlotPoints.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Key Plot Points</h3>
              <ul className="list-disc list-inside space-y-2">
                {recap.keyPlotPoints.map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
