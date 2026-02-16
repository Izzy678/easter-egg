import { NextRequest } from 'next/server';
import { getMoviesUrl } from '../../config';
import type { TvScopeResponse, TvSeasonOption } from '../../types';

function getYearFromDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  return dateStr.slice(0, 4);
}

function getGenreNames(genres: { name: string }[] | undefined): string[] {
  if (!Array.isArray(genres)) return [];
  return genres.slice(0, 2).map((g) => g.name);
}

function shapeTvDetail(raw: any): TvScopeResponse {
  const seasons: TvSeasonOption[] = Array.isArray(raw.seasons)
    ? raw.seasons.map((s: any) => ({
        season_number: s.season_number,
        name: s.name ?? '',
        episode_count: s.episode_count ?? 0,
      }))
    : [];

  return {
    type: 'tv',
    title: raw.name ?? 'Series',
    year: getYearFromDate(raw.first_air_date),
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    runtime: undefined,
    genres: getGenreNames(raw.genres),
    overview: raw.overview ?? null,
    seasons,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) {
    return new Response(JSON.stringify({ error: 'Invalid TV id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = getMoviesUrl(`/movies/tv/${numId}`);
  const res = await fetch(url);
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to load TV details' }),
      { status: res.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const raw = await res.json();
  const data = shapeTvDetail(raw);
  return Response.json(data);
}
