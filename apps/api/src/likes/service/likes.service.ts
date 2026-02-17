import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, LikeTargetType } from '../entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async toggle(dto: {
    userId: string;
    targetType: LikeTargetType;
    targetId: number;
  }): Promise<{ liked: boolean; count: number }> {
    const existing = await this.likeRepository.findOne({
      where: {
        userId: dto.userId,
        targetType: dto.targetType,
        targetId: dto.targetId,
      },
    });
    if (existing) {
      await this.likeRepository.delete(existing.id);
      const count = await this.getCount(dto.targetType, dto.targetId);
      return { liked: false, count };
    }
    const like = this.likeRepository.create(dto);
    await this.likeRepository.save(like);
    const count = await this.getCount(dto.targetType, dto.targetId);
    return { liked: true, count };
  }

  async getCount(targetType: LikeTargetType, targetId: number): Promise<number> {
    return this.likeRepository.count({
      where: { targetType, targetId },
    });
  }

  async getUserLiked(
    userId: string,
    targetType: LikeTargetType,
    targetId: number,
  ): Promise<boolean> {
    const found = await this.likeRepository.findOne({
      where: { userId, targetType, targetId },
    });
    return !!found;
  }

  /**
   * Returns like counts per post id for posts. Use for post lists/feeds.
   */
  async getCountsByPostIds(postIds: number[]): Promise<Map<number, number>> {
    if (postIds.length === 0) {
      return new Map();
    }
    const rows = await this.likeRepository
      .createQueryBuilder('like')
      .select('like.target_id', 'postId')
      .addSelect('COUNT(*)', 'count')
      .where('like.target_type = :type', { type: LikeTargetType.POST })
      .andWhere('like.target_id IN (:...postIds)', { postIds })
      .groupBy('like.target_id')
      .getRawMany<{ postId: number; count: string }>();

    const map = new Map<number, number>();
    for (const row of rows) {
      map.set(Number(row.postId), Number(row.count));
    }
    return map;
  }

  /**
   * Returns like counts per comment id. Use for comment threads.
   */
  async getCountsByCommentIds(commentIds: number[]): Promise<Map<number, number>> {
    if (commentIds.length === 0) {
      return new Map();
    }
    const rows = await this.likeRepository
      .createQueryBuilder('like')
      .select('like.target_id', 'commentId')
      .addSelect('COUNT(*)', 'count')
      .where('like.target_type = :type', { type: LikeTargetType.COMMENT })
      .andWhere('like.target_id IN (:...commentIds)', { commentIds })
      .groupBy('like.target_id')
      .getRawMany<{ commentId: number; count: string }>();

    const map = new Map<number, number>();
    for (const row of rows) {
      map.set(Number(row.commentId), Number(row.count));
    }
    return map;
  }
}
