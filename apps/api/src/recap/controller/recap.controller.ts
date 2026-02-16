import {
  Controller,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { RecapService } from '../service/recap.service';
import type { MovieRecapOptionsDto } from '../dto/recap.dto';
import type { RecapResponseDto } from '../dto/recap.dto';

@Controller('recap')
export class RecapController {
  constructor(private readonly recapService: RecapService) { }

  @Post('movie/:movieId')
  async generateMovieRecap(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() options?: MovieRecapOptionsDto,
  ): Promise<RecapResponseDto> {
    return this.recapService.generateMovieRecap(movieId, options);
  }

  @Post('series/:seriesId')
  async generateSeriesRecap(
    @Param('seriesId', ParseIntPipe) seriesId: number,
    @Query('season', ParseIntPipe) season: number,
    @Query('episodeFrom', ParseIntPipe) episodeFrom: number,
    @Query('episodeTo', ParseIntPipe) episodeTo: number,
    @Query('useEnrichedContext') useEnrichedContext?: string,
  ): Promise<RecapResponseDto> {
    if (season < 1 || episodeFrom < 1 || episodeTo < 1) {
      throw new BadRequestException(
        'season, episodeFrom, and episodeTo must be at least 1'
      );
    }
    if (episodeFrom > episodeTo) {
      throw new BadRequestException('episodeFrom must be less than or equal to episodeTo');
    }
    const useEnriched = useEnrichedContext === 'true';
    return this.recapService.generateSeriesRecap(
      seriesId,
      season,
      episodeFrom,
      episodeTo,
      useEnriched,
    );
  }
}
