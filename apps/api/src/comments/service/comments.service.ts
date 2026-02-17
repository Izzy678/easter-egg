import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { LikesService } from '../../likes/service/likes.service';

export type CommentWithDetails = Comment & {
  user: { id: string; name: string | null; username: string | null; image: string | null };
  likeCount: number;
};

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private likesService: LikesService,
  ) {}

  async create(dto: {
    postId: number;
    userId: string;
    content: string;
    parentId?: number | null;
  }): Promise<Comment> {
    const comment = this.commentRepository.create(dto);
    return this.commentRepository.save(comment);
  }

  async findByPost(
    postId: number,
    query: { page?: number; limit?: number } = {},
  ): Promise<Comment[]> {
    const { page = 1, limit = 50 } = query;
    const take = Math.min(Math.max(1, limit), 100);
    const skip = (Math.max(1, page) - 1) * take;
    return this.commentRepository.find({
      where: { postId },
      order: { createdAt: 'ASC' },
      take,
      skip,
    });
  }

  /**
   * Returns comment counts per post id. Use for post lists/feeds.
   */
  async getCountsByPostIds(postIds: number[]): Promise<Map<number, number>> {
    if (postIds.length === 0) {
      return new Map();
    }
    const rows = await this.commentRepository
      .createQueryBuilder('comment')
      .select('comment.post_id', 'postId')
      .addSelect('COUNT(*)', 'count')
      .where('comment.post_id IN (:...postIds)', { postIds })
      .groupBy('comment.post_id')
      .getRawMany<{ postId: number; count: string }>();

    const map = new Map<number, number>();
    for (const row of rows) {
      map.set(Number(row.postId), Number(row.count));
    }
    return map;
  }

  /**
   * Returns all comments for a post with user relation and likeCount (for thread view).
   * Limit default 500 to support full thread in one request.
   */
  async findByPostWithDetails(
    postId: number,
    limit = 500,
  ): Promise<CommentWithDetails[]> {
    const comments = await this.commentRepository.find({
      where: { postId },
      order: { createdAt: 'ASC' },
      take: Math.min(Math.max(1, limit), 500),
      relations: ['user'],
    });
    const commentIds = comments.map((c) => c.id);
    const countMap = await this.likesService.getCountsByCommentIds(commentIds);
    return comments.map((c) => ({
      ...c,
      likeCount: countMap.get(c.id) ?? 0,
    }));
  }
}
