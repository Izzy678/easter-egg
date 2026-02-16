import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../../llm/service/llm.service';
import { CacheService } from '../../cache/service/cache.service';
import { RecapDataBuilder } from '../data/recap-data.builder';
import {
  buildMoviePrompt,
  buildMovieQuickPrompt,
  buildSeriesPromptStructured,
} from '../prompt/recap.prompt.builder';
import type { MovieRecapOptionsDto } from '../dto/recap.dto';
import type { RecapResponseDto } from '../dto/recap.dto';
import fs from 'fs';

const LLM_RETRIES = 3;

const recapCacheKey = {
  movie: (movieId: number, enriched?: boolean) =>
    enriched ? `recap:movie:${movieId}:enriched` : `recap:movie:${movieId}`,
  series: (
    seriesId: number,
    season: number,
    episodeFrom: number,
    episodeTo: number,
    enriched?: boolean,
  ) =>
    enriched
      ? `recap:series:${seriesId}:s${season}:e${episodeFrom}-${episodeTo}:enriched`
      : `recap:series:${seriesId}:s${season}:e${episodeFrom}-${episodeTo}`,
};

@Injectable()
export class RecapService {
  private readonly logger = new Logger(RecapService.name);

  constructor(
    private readonly llmService: LlmService,
    private readonly cache: CacheService,
    private readonly dataBuilder: RecapDataBuilder,
  ) {}

  async generateMovieRecap(
    movieId: number,
    options?: MovieRecapOptionsDto,
  ): Promise<RecapResponseDto> {
    const useEnriched = options?.useEnrichedContext === true;
    const key = recapCacheKey.movie(movieId, useEnriched);
    const cached = this.cache.get<RecapResponseDto>(key);
    if (cached) return cached;

    const context = useEnriched
      ? await this.dataBuilder.buildMovieContextEnriched(movieId)
      : await this.dataBuilder.buildMovieContext(movieId);
    context.includeEnding = options?.includeEnding ?? true;
    const prompt =
      options?.recapType === 'quick'
        ? buildMovieQuickPrompt(context)
        : buildMoviePrompt(context);
    const content = await this.generateWithRetry(prompt);

    const result: RecapResponseDto = {
      content: content.trim() || '',
      hasSpoilers: options?.includeEnding ?? true,
      keyPlotPoints:
        options?.recapType === 'quick'
          ? this.parseBulletPoints(content)
          : undefined,
    };
    this.cache.set(key, result);
    return result;
  }

  async generateSeriesRecap(
    seriesId: number,
    season: number,
    episodeFrom: number,
    episodeTo: number,
    useEnriched = true,
  ): Promise<RecapResponseDto> {
    const key = recapCacheKey.series(
      seriesId,
      season,
      episodeFrom,
      episodeTo,
      useEnriched,
    );
    const cached = this.cache.get<RecapResponseDto>(key);
    if (cached) return cached;

    const context = await this.dataBuilder.buildSeriesContextEnriched(
      seriesId,
      season,
      episodeFrom,
      episodeTo,
    );
    const prompt = buildSeriesPromptStructured(context);
    console.log('prompt', prompt);
    const content = await this.generateWithRetry(prompt);

    const result: RecapResponseDto = {
      content: content.trim() || '',
      hasSpoilers: true,
    };
    this.cache.set(key, result);
    return result;
  }

  private async generateWithRetry(prompt: string): Promise<string> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= LLM_RETRIES; attempt++) {
      try {
        return await this.llmService.generateTextWithGemini(prompt);
      } catch (err) {
        lastError = err;
        this.logger.warn(
          `LLM attempt ${attempt}/${LLM_RETRIES} failed`,
          err instanceof Error ? err.message : err
        );
      }
    }
    throw lastError;
  }

  private parseBulletPoints(text: string): string[] {
    return text
      .split(/\n/)
      .map((line) => line.replace(/^[\s\-*•]+\s*/, '').trim())
      .filter((line) => line.length > 0);
  }
}
