import { Controller, Get, Param, Query } from "@nestjs/common";
import { TmdbService } from "../service/tmdb.service";

@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Get('movies')
  getMovies() {
    return this.tmdbService.getTrendingMovies();
  }

  @Get('movies/:id')
  getMovie(@Param('id') id: string) {
    return this.tmdbService.getfullMovieDetail(+id);
  }

  @Get('series/:id')
  getSeries(@Param('id') id: string) {
 //   return this.tmdbService.getSeries(+id);
  }

  @Get('series/search')
  async searchSeries(@Query('query') query: string) {
  //  return this.tmdbService.searchSeries(query);
  }

  @Get('movies/:id/recommendations')
  getMovieRecommendations(@Param('id') id: string) {
    console.log(id);
    return this.tmdbService.getMovieRecommendations(+id);
  }

  @Get('movies/:id/reviews')
  getMovieReviews(@Param('id') id: string) {
    console.log(id);
    return this.tmdbService.getMovieReviews(+id);
  }
}