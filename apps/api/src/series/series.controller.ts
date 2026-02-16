import { Controller, Get, Param } from '@nestjs/common';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seriesService.findOne(+id);
  }

  @Get(':id/seasons')
  findSeasons(@Param('id') id: string) {
    return this.seriesService.findSeasons(+id);
  }

  @Get(':id/seasons/:seasonId/recap')
  findSeasonRecap(@Param('id') id: string, @Param('seasonId') seasonId: string) {
    return this.seriesService.findSeasonRecap(+id, +seasonId);
  }

  @Get(':id/seasons/:seasonId/episodes')
  findEpisodes(@Param('id') id: string, @Param('seasonId') seasonId: string) {
    return this.seriesService.findEpisodes(+id, +seasonId);
  }
}
