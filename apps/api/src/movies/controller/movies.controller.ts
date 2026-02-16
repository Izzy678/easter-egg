import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from '../service/movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async findAll(@Query() query: any) {
    const result = await this.moviesService.findAll(query);
    return result;
  }

  // --- TMDB-backed discovery (movie + series) for Recap Entry / Catch Up ---
  @Get('search')
  searchMulti(@Query('query') query: string, @Query('page') page?: string) {
    return this.moviesService.searchMulti(query || '', page ? +page : 1);
  }

  @Get('trending-all')
  getTrendingAll(@Query('window') window?: 'day' | 'week') {
    return this.moviesService.getTrendingAll(window || 'week');
  }

  @Get('trending-tv')
  getTrendingTv(@Query('window') window?: 'day' | 'week') {
    return this.moviesService.getTrendingTv(window || 'week');
  }

  @Get('tv/on-the-air')
  getTvOnTheAir(@Query('page') page?: string) {
    return this.moviesService.getTvOnTheAir(page ? +page : 1);
  }

  @Get('tv/popular')
  getPopularTv(@Query('page') page?: string) {
    return this.moviesService.getPopularTv(page ? +page : 1);
  }

  @Get('tv/:id')
  getTvDetail(@Param('id') id: string) {
    return this.moviesService.getTvDetail(+id);
  }

  @Get('tv/:id/seasons/:seasonNumber')
  getTvSeasonDetail(
    @Param('id') id: string,
    @Param('seasonNumber') seasonNumber: string,
  ) {
    return this.moviesService.getTvSeasonDetail(+id, +seasonNumber);
  }

  @Get('movie/:id')
  getMovieDetail(@Param('id') id: string) {
    return this.moviesService.getMovieDetail(+id);
  }

  @Get('trending')
  findTrending() {
    return this.moviesService.findTrending();
  }

  @Get('popular')
  findPopular() {
    return this.moviesService.findPopular();
  }

  @Get('genres')
  getGenres() {
    return this.moviesService.getGenres();
  }

  @Get('recommendations')
  getRecommendations(@Query() query: any) {
    return this.moviesService.getRecommendations(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Get(':id/related')
  findRelated(@Param('id') id: string) {
    return this.moviesService.findRelated(+id);
  }
}
