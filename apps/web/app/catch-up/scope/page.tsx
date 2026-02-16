'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/movies/Sidebar';
import { MoviesHeader } from '@/components/movies/MoviesHeader';
import { SetupPageHero } from '@/components/catch-up/SetupPageHero';
import { MovieRecapOptions } from '@/components/catch-up/MovieRecapOptions';
import { TvRecapOptions } from '@/components/catch-up/TvRecapOptions';
import { Skeleton } from '@/components/shared/ui/skeleton';
import { Alert, AlertDescription } from '@/components/shared/ui/alert';
import { Label } from '@/components/shared/ui/label';
import { Switch } from '@/components/shared/ui/switch';
import { AlertTriangle } from 'lucide-react';
import { RecapMarkdown } from '@/components/recap/RecapMarkdown';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/shared/ui/sheet';
import type { ScopeResponse } from '@/app/api/movies/types';
import type { RecapResponse } from '@/app/api/recap/types';

type RecapParams = {
  title: string;
  subtitle: string;
  type: 'movie' | 'tv';
};

type MovieRecapOptionsState = {
  type: 'movie';
  recapType: 'quick' | 'full';
  includeEnding: boolean;
};

type TvRecapOptionsState = {
  type: 'tv';
  seasonNumber: number;
  episodeFrom: number;
  episodeTo: number;
};

type RecapOptionsState = MovieRecapOptionsState | TvRecapOptionsState;

export default function CatchUpScopePage() {
  const searchParams = useSearchParams();
  const type = (searchParams.get('type') ?? 'movie') as 'movie' | 'tv';
  const tmdbId = searchParams.get('tmdbId') ?? '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<ScopeResponse | null>(null);
  const [generating, setGenerating] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);
  const [recapParams, setRecapParams] = useState<RecapParams | null>(null);
  const [recapOptions, setRecapOptions] = useState<RecapOptionsState | null>(null);
  const [recapResult, setRecapResult] = useState<RecapResponse | null>(null);
  const [recapError, setRecapError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [useEnrichedContext, setUseEnrichedContext] = useState(false);
  const lastRecapRequestKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!tmdbId) {
      setError('Missing title. Go back and pick a movie or series.');
      setLoading(false);
      return;
    }
    const id = parseInt(tmdbId, 10);
    if (Number.isNaN(id)) {
      setError('Invalid title.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const path = type === 'tv' ? `/api/movies/tv/${id}` : `/api/movies/movie/${id}`;
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(setDetail)
      .catch(() => setError('Could not load details. Try again.'))
      .finally(() => setLoading(false));
  }, [type, tmdbId]);

  useEffect(() => {
    if (!recapOpen || !recapParams || !recapOptions || !detail) return;
    const id = parseInt(tmdbId, 10);
    if (Number.isNaN(id)) return;

    const requestKey =
      recapParams.type === 'movie' && recapOptions.type === 'movie'
        ? `movie:${id}:${recapOptions.recapType}:${recapOptions.includeEnding}:${useEnrichedContext}`
        : recapParams.type === 'tv' && recapOptions.type === 'tv'
          ? `tv:${id}:${recapOptions.seasonNumber}:${recapOptions.episodeFrom}-${recapOptions.episodeTo}:${useEnrichedContext}`
          : '';
    if (!requestKey) return;

    if (lastRecapRequestKeyRef.current === requestKey) return;
    lastRecapRequestKeyRef.current = requestKey;
    setGenerating(true);
    setRecapError(null);

    if (recapParams.type === 'movie' && recapOptions.type === 'movie') {
      fetch(`/api/recap/movie/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recapType: recapOptions.recapType,
          includeEnding: recapOptions.includeEnding,
          useEnrichedContext: useEnrichedContext || undefined,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to generate recap');
          return res.json() as Promise<RecapResponse>;
        })
        .then(setRecapResult)
        .catch(() => setRecapError('Could not generate recap. Try again.'))
        .finally(() => setGenerating(false));
    } else if (recapParams.type === 'tv' && recapOptions.type === 'tv') {
      const season = recapOptions.seasonNumber;
      const episodeFrom = recapOptions.episodeFrom;
      const episodeTo = recapOptions.episodeTo;
      const seriesUrl = new URL(`/api/recap/series/${id}`, window.location.origin);
      seriesUrl.searchParams.set('season', String(season));
      seriesUrl.searchParams.set('episodeFrom', String(episodeFrom));
      seriesUrl.searchParams.set('episodeTo', String(episodeTo));
      if (useEnrichedContext) seriesUrl.searchParams.set('useEnrichedContext', 'true');
      fetch(seriesUrl.toString(), { method: 'POST' })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to generate recap');
          return res.json() as Promise<RecapResponse>;
        })
        .then(setRecapResult)
        .catch(() => setRecapError('Could not generate recap. Try again.'))
        .finally(() => setGenerating(false));
    }
  }, [recapOpen, recapParams, recapOptions, detail, tmdbId, useEnrichedContext]);

  const handleMovieGenerate = (options: {
    recapType: 'quick' | 'full';
    includeEnding: boolean;
  }) => {
    const title = detail?.type === 'movie' ? detail.title : 'Movie';
    const subtitle =
      options.recapType === 'quick' ? 'Quick Recap (2–3 min)' : 'Full Story Recap';
    setRecapOptions({
      type: 'movie',
      recapType: options.recapType,
      includeEnding: options.includeEnding,
    });
    setRecapParams({ title, subtitle, type: 'movie' });
    setRecapResult(null);
    setRecapError(null);
    setRecapOpen(true);
  };

  const handleTvGenerate = (options: {
    seasonNumber: number;
    episodeFrom: number;
    episodeTo: number;
  }) => {
    const title = detail?.type === 'tv' ? detail.title : 'Series';
    const subtitle =
      options.episodeFrom === options.episodeTo
        ? `Season ${options.seasonNumber} · Episode ${options.episodeFrom}`
        : `Season ${options.seasonNumber} · Episodes ${options.episodeFrom}–${options.episodeTo}`;
    setRecapOptions({
      type: 'tv',
      seasonNumber: options.seasonNumber,
      episodeFrom: options.episodeFrom,
      episodeTo: options.episodeTo,
    });
    setRecapParams({ title, subtitle, type: 'tv' });
    setRecapResult(null);
    setRecapError(null);
    setRecapOpen(true);
  };

  const handleRecapOpenChange = (open: boolean) => {
    setRecapOpen(open);
    if (!open) {
      lastRecapRequestKeyRef.current = null;
      setRecapResult(null);
      setRecapError(null);
      setRecapOptions(null);
    }
  };

  if (error) {
    return (
      <div className="w-full min-h-screen bg-background text-foreground">
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 min-w-0 lg:ml-64">
            <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 py-8">
              <p className="text-muted-foreground">{error}</p>
              <a href="/catch-up" className="text-primary-500 hover:underline mt-2 inline-block">
                Back to Catch Up
              </a>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (loading || !detail) {
    return (
      <div className="w-full min-h-screen bg-background text-foreground">
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 min-w-0 relative lg:ml-64">
            <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />
            <div
              className="absolute inset-0 bg-muted/30 opacity-50"
              style={{ filter: 'blur(60px)' }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-background/80" aria-hidden />
            <div className="relative max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 py-8 flex flex-col gap-10">
              <div className="min-w-0 space-y-4">
                <Skeleton className="h-9 w-36" />
                <div className="flex flex-col sm:flex-row gap-6">
                  <Skeleton className="w-full sm:w-48 aspect-[2/3] rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-5 w-10" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
              <div className="w-full max-w-lg space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-10 w-[180px] rounded-md" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-10 w-[200px] rounded-md" />
                </div>
                <Skeleton className="h-10 w-40 rounded-md" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isTv = detail.type === 'tv';
  const title = detail.title;
  const year = detail.year;
  const posterPath = detail.posterPath;
  const backdropPath = detail.backdropPath;
  const runtime = detail.runtime;
  const genres = detail.genres;
  const overview = detail.overview;
  const seasons = isTv ? detail.seasons : [];

  const backdropUrl =
    backdropPath || posterPath
      ? `https://image.tmdb.org/t/p/w1280${backdropPath || posterPath}`
      : null;

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 relative lg:ml-64">
          <MoviesHeader onMenuClick={() => setSidebarOpen(true)} />
          {backdropUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage: `url(${backdropUrl})`,
                filter: 'blur(40px)',
              }}
              aria-hidden
            />
          )}
          <div className="absolute inset-0 bg-background/80" aria-hidden />
          <div className="relative max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 py-8 flex flex-col gap-10">
            <div className="min-w-0">
              <SetupPageHero
                type={type}
                title={title}
                year={year}
                posterPath={posterPath}
                backdropPath={backdropPath}
                runtime={runtime}
                genres={genres}
                overview={overview}
              />
            </div>
            <div className="w-full max-w-lg space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                <Label htmlFor="use-enriched-context" className="text-foreground font-medium">
                  Use detailed sources (e.g. Fandom) for better recaps
                </Label>
                <Switch
                  id="use-enriched-context"
                  checked={useEnrichedContext}
                  onCheckedChange={setUseEnrichedContext}
                />
              </div>
              {isTv ? (
                <TvRecapOptions
                  seriesId={parseInt(tmdbId, 10)}
                  seasons={seasons}
                  onGenerate={handleTvGenerate}
                  generating={generating}
                />
              ) : (
                <MovieRecapOptions
                  onGenerate={handleMovieGenerate}
                  generating={generating}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      <Sheet open={recapOpen} onOpenChange={handleRecapOpenChange}>
        <SheetContent
          side="right"
          className="flex w-full flex-col overflow-hidden sm:max-w-xl"
        >
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>{recapParams?.title ?? 'Recap'}</SheetTitle>
            {recapParams?.subtitle && (
              <SheetDescription>{recapParams.subtitle}</SheetDescription>
            )}
          </SheetHeader>
          <div className="mt-6 flex min-h-0 flex-1 flex-col overflow-hidden">
            {generating && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            )}
            {!generating && recapError && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 space-y-3">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{recapError}</AlertDescription>
                </Alert>
              </div>
            )}
            {!generating && recapResult && (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
                    <RecapMarkdown content={recapResult.content} />
                    {recapResult.keyPlotPoints &&
                      recapResult.keyPlotPoints.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-xl font-semibold mb-3">
                            Key Plot Points
                          </h3>
                          <ul className="list-disc list-inside space-y-2">
                            {recapResult.keyPlotPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
