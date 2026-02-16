import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './controller/movies.controller';
import { Movie } from './entities/movie.entity';
import { TmdbModule } from '../tmdb/tmdb.module';
import { MoviesService } from './service/movies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), TmdbModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
