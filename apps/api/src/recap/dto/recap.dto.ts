export type MovieRecapType = 'quick' | 'full';

export interface MovieRecapOptionsDto {
  recapType?: MovieRecapType;
  includeEnding?: boolean;
  useEnrichedContext?: boolean;
}

export interface SeriesRecapQueryDto {
    season: number;
    episode: number;
}

export interface RecapResponseDto {
    content: string;
    hasSpoilers?: boolean;
    keyPlotPoints?: string[];
}
