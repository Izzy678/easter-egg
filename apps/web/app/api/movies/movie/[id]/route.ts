import { NextRequest } from 'next/server';
import { getMoviesUrl } from '../../config';
import type { MovieScopeResponse } from '../../types';

function getYearFromDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;
  return dateStr.slice(0, 4);
}

function getGenreNames(genres: { name: string }[] | undefined): string[] {
  if (!Array.isArray(genres)) return [];
  return genres.slice(0, 2).map((g) => g.name);
}

function shapeMovieDetail(raw: any): MovieScopeResponse {
  return {
    type: 'movie',
    title: raw.title ?? 'Movie',
    year: getYearFromDate(raw.release_date),
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    runtime: raw.runtime ?? undefined,
    genres: getGenreNames(raw.genres),
    overview: raw.overview ?? null,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) {
    return new Response(JSON.stringify({ error: 'Invalid movie id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = getMoviesUrl(`/movies/movie/${numId}`);
  const res = await fetch(url);
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to load movie details' }),
      { status: res.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const raw = await res.json();
  const data = shapeMovieDetail(raw);
  return Response.json(data);
}
