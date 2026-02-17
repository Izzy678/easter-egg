import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { ItemType } from '../../watchlist/entities/watchlist.entity';
import { TmdbService } from '../../tmdb/service/tmdb.service';
import { LikesService } from '../../likes/service/likes.service';
import { CommentsService } from '../../comments/service/comments.service';

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

export type PostWithCounts = Post & { likeCount: number; commentCount: number };

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private likesService: LikesService,
    private commentsService: CommentsService,
    private tmdbService: TmdbService,
  ) {}

  async create(dto: {
    userId: string;
    content: string;
    itemType: ItemType;
    itemId: number;
    tags?: string[];
  }): Promise<Post> {
    const tags = Array.isArray(dto.tags)
      ? dto.tags.slice(0, 3).map((t) => String(t).trim()).filter(Boolean)
      : [];

    let itemName: string | null = null;
    let itemImageUrl: string | null = null;

    try {
      if (dto.itemType === ItemType.MOVIE) {
        const data = await this.tmdbService.getfullMovieDetail(dto.itemId);
        itemName = data?.title ?? null;
        itemImageUrl =
          data?.poster_path != null ? `${TMDB_POSTER_BASE}${data.poster_path}` : null;
      } else {
        const data = await this.tmdbService.getTvDetail(dto.itemId);
        itemName = data?.name ?? null;
        itemImageUrl =
          data?.poster_path != null ? `${TMDB_POSTER_BASE}${data.poster_path}` : null;
      }
    } catch {
      // Save post even if TMDB fetch fails; metadata stays null
    }

    const post = this.postRepository.create({
      ...dto,
      tags,
      itemName,
      itemImageUrl,
    });
    return this.postRepository.save(post);
  }

  // async findAll(query: {
  //   itemType?: ItemType;
  //   itemId?: number;
  //   page?: number;
  //   limit?: number;
  // }): Promise<Post[]> {
  //   const { itemType, itemId, page = 1, limit = 20 } = query;
  //   const take = Math.min(Math.max(1, limit), 100);
  //   const skip = (Math.max(1, page) - 1) * take;

  //   const qb = this.postRepository
  //     .createQueryBuilder('post')
  //     .leftJoinAndSelect('post.user', 'user')
  //     .orderBy('post.createdAt', 'DESC');

  //   if (itemType) {
  //     qb.andWhere('post.item_type = :itemType', { itemType });
  //   }
  //   if (itemId !== undefined) {
  //     qb.andWhere('post.item_id = :itemId', { itemId });
  //   }

  //   return qb.take(take).skip(skip).getMany();
  // }

  async findAll(query: {
    itemType?: ItemType;
    itemId?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ posts: PostWithCounts[]; page: number; limit: number; total: number; totalPages: number }> {
    const { itemType, itemId, search, page = 1, limit = 20 } = query;
    const take = Math.min(Math.max(1, limit), 100);
    const skip = (Math.max(1, page) - 1) * take;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .orderBy('post.createdAt', 'DESC');

    if (itemType) {
      qb.andWhere('post.item_type = :itemType', { itemType });
    }
    if (itemId !== undefined) {
      qb.andWhere('post.item_id = :itemId', { itemId });
    }
    if (search) {
      qb.andWhere(
        '(post.content ILIKE :search OR post.item_name ILIKE :search)',
        { search: `%${search.replace(/%/g, '\\%').replace(/_/g, '\\_')}%` },
      );
    }

    const [posts, total] = await qb.take(take).skip(skip).getManyAndCount();

    const postsWithCounts = await this.attachLikeAndCommentCounts(posts);

    return {
      posts: postsWithCounts,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / take),
    };
  }

  private async attachLikeAndCommentCounts(posts: Post[]): Promise<PostWithCounts[]> {
    if (posts.length === 0) {
      return [];
    }
    const postIds = posts.map((p) => p.id);

    const [likeCountByPostId, commentCountByPostId] = await Promise.all([
      this.likesService.getCountsByPostIds(postIds),
      this.commentsService.getCountsByPostIds(postIds),
    ]);

    return posts.map((post) => ({
      ...post,
      likeCount: likeCountByPostId.get(post.id) ?? 0,
      commentCount: commentCountByPostId.get(post.id) ?? 0,
    }));
  }


  async findOne(id: number): Promise<PostWithCounts | null> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      return null;
    }
    const [withCounts] = await this.attachLikeAndCommentCounts([post]);
    return withCounts;
  }
}
