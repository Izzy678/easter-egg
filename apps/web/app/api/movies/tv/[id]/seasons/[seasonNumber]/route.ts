import { NextRequest } from 'next/server';
import { getMoviesUrl } from '../../../../config';
import type { TvSeasonDetailResponse, TvEpisodeOption } from '../../../../types';

function shapeSeasonDetail(raw: any): TvSeasonDetailResponse {
  const episodes: TvEpisodeOption[] = Array.isArray(raw.episodes)
    ? raw.episodes.map((e: any) => ({
        episode_number: e.episode_number,
        name: e.name ?? '',
      }))
    : [];
  return { episodes };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; seasonNumber: string }> }
) {
  const { id, seasonNumber } = await params;
  const numId = parseInt(id, 10);
  const numSeason = parseInt(seasonNumber, 10);
  if (Number.isNaN(numId) || Number.isNaN(numSeason)) {
    return new Response(JSON.stringify({ error: 'Invalid id or season' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = getMoviesUrl(`/movies/tv/${numId}/seasons/${numSeason}`);
  const res = await fetch(url);
  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to load season' }),
      { status: res.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const raw = await res.json();
  const data = shapeSeasonDetail(raw);
  return Response.json(data);
}
