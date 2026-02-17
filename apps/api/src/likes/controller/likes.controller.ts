import { Controller, Post, Get, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { LikesService } from '../service/likes.service';
import { LikeTargetType } from '../entities/like.entity';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async toggle(
    @Body() dto: { userId: string; targetType: LikeTargetType; targetId: number },
  ) {
    return this.likesService.toggle(dto);
  }

  @Get('count')
  async getCount(
    @Query('targetType') targetType: LikeTargetType,
    @Query('targetId') targetId: string,
  ) {
    const id = parseInt(targetId, 10);
    if (Number.isNaN(id)) {
      return { count: 0 };
    }
    const count = await this.likesService.getCount(targetType, id);
    return { count };
  }

  @Get('me')
  async getUserLiked(
    @Query('userId') userId: string,
    @Query('targetType') targetType: LikeTargetType,
    @Query('targetId') targetId: string,
  ) {
    const id = parseInt(targetId, 10);
    if (Number.isNaN(id) || !userId) {
      return { liked: false };
    }
    const liked = await this.likesService.getUserLiked(userId, targetType, id);
    return { liked };
  }
}
