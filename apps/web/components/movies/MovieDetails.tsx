'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/shared/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/shared/ui/button';

interface MovieDetailsProps {
  movie: any;
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  const [plotExpanded, setPlotExpanded] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Plot */}
        {movie.fullPlot && (
          <Card>
            <CardHeader>
              <CardTitle>Plot</CardTitle>
            </CardHeader>
            <CardContent>
              <Collapsible open={plotExpanded} onOpenChange={setPlotExpanded}>
                <div className="space-y-4">
                  {movie.plot && (
                    <p className="text-muted-foreground">{movie.plot}</p>
                  )}
                  {movie.fullPlot && movie.fullPlot !== movie.plot && (
                    <>
                      <CollapsibleContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{movie.fullPlot}</p>
                      </CollapsibleContent>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full">
                          {plotExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Show Full Plot
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </>
                  )}
                </div>
              </Collapsible>
            </CardContent>
          </Card>
        )}

        {/* Cast & Characters */}
        {movie.cast && (
          <Card>
            <CardHeader>
              <CardTitle>Cast & Characters</CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(movie.cast) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movie.cast.map((actor: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      {actor.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                          alt={actor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{actor.name}</p>
                        {actor.character && (
                          <p className="text-sm text-muted-foreground">as {actor.character}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify(movie.cast, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        )}

        {/* Trivia */}
        {movie.trivia && movie.trivia.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Trivia & Facts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {movie.trivia.map((fact: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{fact}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {movie.imdbRating && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">IMDb</span>
                  <span className="text-sm font-semibold">{movie.imdbRating.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${(movie.imdbRating / 10) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {movie.rottenTomatoesRating && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Rotten Tomatoes</span>
                  <span className="text-sm font-semibold">{movie.rottenTomatoesRating}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${movie.rottenTomatoesRating}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Release Info */}
        <Card>
          <CardHeader>
            <CardTitle>Release Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {movie.releaseDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Release Date:</span>
                <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
              </div>
            )}
            {movie.year && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Year:</span>
                <span>{movie.year}</span>
              </div>
            )}
            {movie.runtime && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Runtime:</span>
                <span>{movie.runtime} minutes</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
