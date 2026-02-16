import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Series } from './entities/series.entity';
import { Season } from './entities/season.entity';
import { Episode } from './entities/episode.entity';
import { Recap } from '../recaps/entities/recap.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private seriesRepository: Repository<Series>,
    @InjectRepository(Season)
    private seasonRepository: Repository<Season>,
    @InjectRepository(Episode)
    private episodeRepository: Repository<Episode>,
    @InjectRepository(Recap)
    private recapRepository: Repository<Recap>,
  ) {}

  async findOne(id: number) {
    return this.seriesRepository.findOne({
      where: { id },
      relations: ['seasons'],
    });
  }

  async findSeasons(seriesId: number) {
    return this.seasonRepository.find({
      where: { seriesId },
      order: { seasonNumber: 'ASC' },
      relations: ['episodes'],
    });
  }

  async findSeasonRecap(seriesId: number, seasonId: number) {
    const season = await this.seasonRepository.findOne({
      where: { id: seasonId, seriesId },
    });
    if (!season) {
      return null;
    }

    const recap = await this.recapRepository.findOne({
      where: { seasonId },
      relations: ['season'],
    });

    return {
      season,
      recap,
    };
  }

  async findEpisodes(seriesId: number, seasonId: number) {
    return this.episodeRepository.find({
      where: { seasonId },
      order: { episodeNumber: 'ASC' },
    });
  }
}
