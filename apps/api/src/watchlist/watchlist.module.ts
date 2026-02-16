import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Movie } from '../movies/entities/movie.entity';
import { WatchlistService } from './service/watchlist.service';
import { WatchlistController } from './controller/watchlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Watchlist, Movie])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
  exports: [WatchlistService],
})
export class WatchlistModule {}
