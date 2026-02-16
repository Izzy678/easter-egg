import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemType, Watchlist } from '../entities/watchlist.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private watchlistRepository: Repository<Watchlist>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  async create(createWatchlistDto: { userId: string; itemType: ItemType; itemId: number }) {
    const watchlist = this.watchlistRepository.create(createWatchlistDto);
    return this.watchlistRepository.save(watchlist);
  }

  // async findAll(userId: string, watched?: boolean) {
  //   const where: any = { userId };
  //   if (watched !== undefined) {
  //     where.watched = watched;
  //   }
  //   const watchlistItems = await this.watchlistRepository.find({ where });

  //   // Fetch related movie/series data
  //   const itemsWithData = await Promise.all(
  //     watchlistItems.map(async (item) => {
  //       let itemData: Movie  | null = null;
  //       if (item.itemType === 'movie') {
  //         itemData = await this.movieRepository.findOne({ where: { id: item.itemId } });
  //       } else if (item.itemType === 'series') {
  //         itemData = await this.seriesRepository.findOne({ where: { id: item.itemId } });
  //       }
  //       return {
  //         ...item,
  //         [item.itemType]: itemData,
  //       };
  //     })
  //   );

  //   return itemsWithData;
  // }

  async update(id: number, watched: boolean) {
    await this.watchlistRepository.update(id, { watched });
    return this.watchlistRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.watchlistRepository.delete(id);
  }
}
