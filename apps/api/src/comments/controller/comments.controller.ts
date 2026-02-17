import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from '../service/comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: { userId: string; content: string; parentId?: number | null },
  ) {
    return this.commentsService.create({
      postId,
      userId: dto.userId,
      content: dto.content,
      parentId: dto.parentId ?? null,
    });
  }

  @Get()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('limit') limit?: string,
  ) {
    const limitNum =
      limit !== undefined ? Math.min(parseInt(limit, 10) || 500, 500) : 500;
    return this.commentsService.findByPostWithDetails(postId, limitNum);
  }
}
