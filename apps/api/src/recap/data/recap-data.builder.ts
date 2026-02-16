import { Injectable, NotFoundException } from '@nestjs/common';
import { TmdbService } from '../../tmdb/service/tmdb.service';

import type { MovieRecapContext } from '../prompt/recap.prompt.builder';
import type { SeriesEpisodeContext, SeriesRecapContext } from '../prompt/recap.prompt.builder';
import { CanonFetcherService } from 'src/canon/canon-fetcher.service';

interface TmdbMovieDetail {
  title?: string;
  overview?: string;
  tagline?: string;
}

interface TmdbTvDetail {
  name?: string;
}

interface TmdbEpisode {
  episode_number?: number;
  name?: string;
  overview?: string;
}

interface TmdbSeasonDetail {
  episodes?: TmdbEpisode[];
}

@Injectable()
export class RecapDataBuilder {
  constructor(
    private readonly tmdbService: TmdbService,
    private readonly canonFetcher: CanonFetcherService,
  ) {}

  async buildMovieContext(movieId: number): Promise<MovieRecapContext> {
    try {
      const data = await this.tmdbService.getfullMovieDetail(movieId) as TmdbMovieDetail;
      if (!data) {
        throw new NotFoundException(`Movie ${movieId} not found`);
      }
      return {
        title: data.title ?? 'Unknown',
        overview: data.overview ?? '',
        tagline: data.tagline,
      };
    } catch (err: unknown) {
      if (this.isNotFoundError(err)) {
        throw new NotFoundException(`Movie ${movieId} not found`);
      }
      throw err;
    }
  }

  /** Enriched context: TMDB + optional canon (Fandom). Canon is merged when fetcher is available. */
  async buildMovieContextEnriched(movieId: number): Promise<MovieRecapContext> {
    const context = await this.buildMovieContext(movieId);
    try {
      const canonSummary = await this.canonFetcher.getMovieCanonSummary(
        movieId,
        context.title,
      );
      if (canonSummary) context.canonSummary = canonSummary;
    } catch {
      // fallback to TMDB-only context
    }
    return context;
  }

  private isNotFoundError(err: unknown): boolean {
    const status = (err as { response?: { status?: number } })?.response?.status;
    return status === 404;
  }

  async buildSeriesContext(
    seriesId: number,
    season: number,
    episodeFrom: number,
    episodeTo: number,
  ): Promise<SeriesRecapContext> {
    try {
      const [show, seasonDetail] = await Promise.all([
        this.tmdbService.getTvDetail(seriesId) as Promise<TmdbTvDetail>,
        this.tmdbService.getTvSeasonDetail(seriesId, season) as Promise<TmdbSeasonDetail>,
      ]);

      if (!show) {
        throw new NotFoundException(`Series ${seriesId} not found`);
      }
      if (!seasonDetail?.episodes?.length) {
        throw new NotFoundException(
          `Season ${season} not found for series ${seriesId}`
        );
      }

      const episodes: SeriesEpisodeContext[] = seasonDetail.episodes
        .filter(
          (ep) =>
            ep.episode_number != null &&
            ep.episode_number >= episodeFrom &&
            ep.episode_number <= episodeTo,
        )
        .map((ep) => ({
          seasonNumber: season,
          episodeNumber: ep.episode_number!,
          name: ep.name ?? 'Unknown',
          overview: ep.overview ?? '',
        }));

      return {
        seriesName: show.name ?? 'Unknown',
        season,
        episodeFrom,
        episodeTo,
        episodes,
      };
    } catch (err: unknown) {
      if (this.isNotFoundError(err)) {
        throw new NotFoundException(
          `Series ${seriesId} or season ${season} not found`
        );
      }
      throw err;
    }
  }

  /** Enriched context: TMDB + optional canon (Fandom). Canon is merged when fetcher is available. */
  async buildSeriesContextEnriched(
    seriesId: number,
    season: number,
    episodeFrom: number,
    episodeTo: number,
  ): Promise<SeriesRecapContext> {
    const context = await this.buildSeriesContext(
      seriesId,
      season,
      episodeFrom,
      episodeTo,
    );
    try {
      const canonSummary = await this.canonFetcher.getSeriesCanonSummary(
        seriesId,
        context.seriesName,
        season,
        context.episodes.map((e) => ({ episodeNumber: e.episodeNumber, name: e.name })),
      );
      if (canonSummary) context.canonSummary = canonSummary;
    } catch {
      // fallback to TMDB-only context
    }
    return context;
  }

  /**
   * Build context for all seasons from 1 up to and including the target season,
   * with episodes limited to the target episode in the target season.
   */
  async buildSeriesContextUpTo(
    seriesId: number,
    targetSeason: number,
    targetEpisode: number,
  ): Promise<SeriesRecapContext> {
    try {
      const show = await this.tmdbService.getTvDetail(seriesId) as TmdbTvDetail;
      if (!show) {
        throw new NotFoundException(`Series ${seriesId} not found`);
      }

      const allEpisodes: SeriesEpisodeContext[] = [];

      for (let s = 1; s <= targetSeason; s++) {
        const seasonDetail = await this.tmdbService.getTvSeasonDetail(
          seriesId,
          s,
        ) as TmdbSeasonDetail;
        const episodes = seasonDetail?.episodes ?? [];
        const maxEp = s === targetSeason ? targetEpisode : Number.MAX_SAFE_INTEGER;
        for (const ep of episodes) {
          if (ep.episode_number != null && ep.episode_number <= maxEp) {
            allEpisodes.push({
              seasonNumber: s,
              episodeNumber: ep.episode_number,
              name: ep.name ?? 'Unknown',
              overview: ep.overview ?? '',
            });
          }
        }
      }

      return {
        seriesName: show.name ?? 'Unknown',
        season: targetSeason,
        episodeFrom: targetEpisode,
        episodeTo: targetEpisode,
        episodes: allEpisodes,
      };
    } catch (err: unknown) {
      if (this.isNotFoundError(err)) {
        throw new NotFoundException(`Series ${seriesId} not found`);
      }
      throw err;
    }
  }

  /** Last episode number in a season (for chunking). */
  async getSeasonLastEpisodeNumber(
    seriesId: number,
    season: number,
  ): Promise<number> {
    try {
      const detail = await this.tmdbService.getTvSeasonDetail(
        seriesId,
        season,
      ) as TmdbSeasonDetail;
      const episodes = detail?.episodes ?? [];
      if (episodes.length === 0) return 0;
      const max = Math.max(
        ...episodes.map((ep) => ep.episode_number ?? 0),
      );
      return max;
    } catch (err: unknown) {
      if (this.isNotFoundError(err)) {
        throw new NotFoundException(
          `Season ${season} not found for series ${seriesId}`
        );
      }
      throw err;
    }
  }
}
