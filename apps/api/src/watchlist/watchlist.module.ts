import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Series } from '../series/entities/series.entity';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Watchlist, Movie, Series])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
  exports: [WatchlistService],
})
export class WatchlistModule {}
