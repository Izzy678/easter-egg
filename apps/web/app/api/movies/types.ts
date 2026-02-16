/**
 * API response types for /api/movies/* routes.
 * All movie/TV API integration types are declared here.
 */

/** Season option for TV scope (season selector). */
export interface TvSeasonOption {
  season_number: number;
  name: string;
  episode_count: number;
}

/** Scope page response for a movie. */
export interface MovieScopeResponse {
  type: 'movie';
  title: string;
  year?: string;
  posterPath: string | null;
  backdropPath: string | null;
  runtime?: number;
  genres: string[];
  overview: string | null;
}

/** Scope page response for a TV series. */
export interface TvScopeResponse {
  type: 'tv';
  title: string;
  year?: string;
  posterPath: string | null;
  backdropPath: string | null;
  runtime?: number;
  genres: string[];
  overview: string | null;
  seasons: TvSeasonOption[];
}

export type ScopeResponse = MovieScopeResponse | TvScopeResponse;

/** Episode line for season detail (TvRecapOptions). */
export interface TvEpisodeOption {
  episode_number: number;
  name: string;
}

/** Response from GET /api/movies/tv/:id/seasons/:seasonNumber */
export interface TvSeasonDetailResponse {
  episodes: TvEpisodeOption[];
}

/** Item shape for search/trending lists (catch-up page cards). */
export interface MoviesListItem {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
}

/** Response from search, trending-all, tv/popular, tv/on-the-air */
export interface MoviesListResponse {
  results: MoviesListItem[];
}
