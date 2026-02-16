import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeriesController } from './series.controller';
import { Series } from './entities/series.entity';
import { Season } from './entities/season.entity';
import { Episode } from './entities/episode.entity';
import { Recap } from '../recaps/entities/recap.entity';
import { SeriesService } from './series.service';

@Module({
  imports: [TypeOrmModule.forFeature([Series, Season, Episode, Recap])],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
