import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from '../service/post.service';
import { ItemType } from '../../watchlist/entities/watchlist.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  create(
    @Body()
    dto: {
      userId: string;
      content: string;
      itemType: ItemType;
      itemId: number;
      tags?: string[];
    },
  ) {
    return this.postsService.create(dto);
  }

  @Get()
  findAll(
    @Query('itemType') itemType?: ItemType,
    @Query('itemId') itemId?: number,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.postsService.findAll({
      itemType,
      itemId,
      search: search?.trim() || undefined,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }
}
