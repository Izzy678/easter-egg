/**
 * Recap API response (matches Nest RecapResponseDto).
 */
export interface RecapResponse {
  content: string;
  hasSpoilers?: boolean;
  keyPlotPoints?: string[];
}
