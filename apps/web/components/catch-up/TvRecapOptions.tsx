'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shared/ui/select';
import type { TvSeasonOption } from '@/app/api/movies/types';

export type { TvSeasonOption };

export interface TvRecapOptionsProps {
  seriesId: number;
  seasons: TvSeasonOption[];
  onGenerate: (options: {
    seasonNumber: number;
    episodeFrom: number;
    episodeTo: number;
  }) => void;
  generating?: boolean;
}

export function TvRecapOptions({
  seriesId,
  seasons,
  onGenerate,
  generating = false,
}: TvRecapOptionsProps) {
  const [seasonNumber, setSeasonNumber] = useState<number>(1);
  const [episodes, setEpisodes] = useState<{ episode_number: number; name: string }[]>([]);
  const [episodeFrom, setEpisodeFrom] = useState<number>(1);
  const [episodeTo, setEpisodeTo] = useState<number>(1);
  const [episodesLoading, setEpisodesLoading] = useState(false);

  const sortedSeasons = [...seasons].filter((s) => s.season_number >= 1).sort(
    (a, b) => a.season_number - b.season_number
  );

  useEffect(() => {
    if (sortedSeasons.length === 0) return;
    const first = sortedSeasons[0];
    setSeasonNumber(first.season_number);
  }, [sortedSeasons.length]);

  useEffect(() => {
    if (!seriesId || !seasonNumber) return;
    setEpisodesLoading(true);
    fetch(`/api/movies/tv/${seriesId}/seasons/${seasonNumber}`)
      .then((res) => res.json())
      .then((data: { episodes?: { episode_number: number; name: string }[] }) => {
        const eps = (data?.episodes ?? []).map((e) => ({
          episode_number: e.episode_number,
          name: e.name,
        }));
        setEpisodes(eps);
        const first = eps.length > 0 ? eps[0].episode_number : 1;
        const last = eps.length > 0 ? eps[eps.length - 1].episode_number : 1;
        setEpisodeFrom(first);
        setEpisodeTo(last);
      })
      .catch(() => setEpisodes([]))
      .finally(() => setEpisodesLoading(false));
  }, [seriesId, seasonNumber]);

  const handleSubmit = () => {
    onGenerate({
      seasonNumber,
      episodeFrom,
      episodeTo,
    });
  };

  const episodeOptions = episodes.map((e) => ({
    value: String(e.episode_number),
    label: `Episode ${e.episode_number}${e.name ? ` · ${e.name}` : ''}`,
  }));

  const handleFromChange = (value: string) => {
    const n = parseInt(value, 10);
    setEpisodeFrom(n);
    if (n > episodeTo) setEpisodeTo(n);
  };
  const handleToChange = (value: string) => {
    const n = parseInt(value, 10);
    setEpisodeTo(n);
    if (n < episodeFrom) setEpisodeFrom(n);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={String(seasonNumber)}
            onValueChange={(v) => setSeasonNumber(parseInt(v, 10))}
          >
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              {sortedSeasons.map((s) => (
                <SelectItem key={s.season_number} value={String(s.season_number)}>
                  Season {s.season_number}
                  {s.name && s.name !== `Season ${s.season_number}` ? ` · ${s.name}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">·</span>
          <Select
            value={String(episodeFrom)}
            onValueChange={handleFromChange}
            disabled={episodesLoading || episodes.length === 0}
          >
            <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
              <SelectValue placeholder="From episode" />
            </SelectTrigger>
            <SelectContent>
              {episodeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">to</span>
          <Select
            value={String(episodeTo)}
            onValueChange={handleToChange}
            disabled={episodesLoading || episodes.length === 0}
          >
            <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
              <SelectValue placeholder="To episode" />
            </SelectTrigger>
            <SelectContent>
              {episodeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {episodesLoading && (
          <p className="text-sm text-muted-foreground mt-1">Loading episodes…</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">
          Shorter episode ranges often produce clearer, more focused recaps.
        </p>
      </div>

      <Button
        size="lg"
        className="w-full sm:w-auto min-w-[200px]"
        onClick={handleSubmit}
        disabled={generating || episodesLoading}
      >
        {generating ? 'Generating…' : 'Generate Recap'}
      </Button>
    </div>
  );
}
