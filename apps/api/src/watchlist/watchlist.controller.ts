import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { ItemType } from './entities/watchlist.entity';


@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Post()
  create(@Body() createWatchlistDto: { userId: string; itemType: ItemType; itemId: number }) {
    return this.watchlistService.create(createWatchlistDto);
  }

  @Get()
  findAll(@Query('userId') userId: string, @Query('watched') watched?: string) {
    return this.watchlistService.findAll(userId, watched === 'true');
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWatchlistDto: { watched: boolean }) {
    return this.watchlistService.update(+id, updateWatchlistDto.watched);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.watchlistService.remove(+id);
  }
}
