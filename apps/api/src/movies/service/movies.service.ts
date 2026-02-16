import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { TmdbService } from '../../tmdb/service/tmdb.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private tmdbService: TmdbService,
  ) {}

  async findAll(query: any) {
    const {
      genre,
      mood,
      decade,
      minRating,
      sort = 'rating',
      page = 1,
      limit = 20,
    } = query;

    const queryBuilder = this.movieRepository.createQueryBuilder('movie');

    if (genre) {
      queryBuilder.andWhere('movie.genres @> ARRAY[:genre]', { genre });
    }

    if (mood) {
      queryBuilder
        .innerJoin('movie.moods', 'mood')
        .andWhere('mood.name = :mood', { mood });
    }

    if (decade) {
      const startYear = parseInt(decade);
      const endYear = startYear + 9;
      queryBuilder.andWhere('movie.year >= :startYear AND movie.year <= :endYear', {
        startYear,
        endYear,
      });
    }

    if (minRating) {
      queryBuilder.andWhere('movie.imdbRating >= :minRating', {
        minRating: parseFloat(minRating),
      });
    }

    // Sorting
    switch (sort) {
      case 'rating':
        queryBuilder.orderBy('movie.imdbRating', 'DESC');
        break;
      case 'year':
        queryBuilder.orderBy('movie.year', 'DESC');
        break;
      case 'title':
        queryBuilder.orderBy('movie.title', 'ASC');
        break;
      default:
        queryBuilder.orderBy('movie.imdbRating', 'DESC');
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    queryBuilder.skip(skip).take(parseInt(limit));

    const [movies, total] = await queryBuilder.getManyAndCount();

    return {
      movies,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    };
  }

  async findOne(id: number) {
    return this.movieRepository.findOne({ where: { id } });
  }

  async findTrending() {
    // Return movies ordered by rating and recent year
    return this.movieRepository.find({
      order: {
        imdbRating: 'DESC',
        year: 'DESC',
      },
      take: 20,
    });
  }

  async findPopular() {
    // Return movies ordered by rating
    return this.movieRepository.find({
      order: {
        imdbRating: 'DESC',
      },
      take: 20,
    });
  }

  async getGenres() {
    const movies = await this.movieRepository.find({ select: ['genres'] });
    const allGenres = new Set<string>();
    movies.forEach((movie) => {
      if (movie.genres) {
        movie.genres.forEach((genre) => allGenres.add(genre));
      }
    });
    return Array.from(allGenres).sort();
  }

  async getRecommendations(query: any) {
    const { mood, genre, maxDuration, limit = 20 } = query;
    const queryBuilder = this.movieRepository.createQueryBuilder('movie');

    if (mood) {
      queryBuilder
        .innerJoin('movie.moods', 'mood')
        .where('mood.name = :mood', { mood });
    }

    if (genre) {
      queryBuilder.andWhere('movie.genres @> ARRAY[:genre]', { genre });
    }

    if (maxDuration) {
      queryBuilder.andWhere('movie.runtime <= :maxDuration', { maxDuration: parseInt(maxDuration) });
    }

    queryBuilder
      .orderBy('movie.imdbRating', 'DESC')
      .addOrderBy('movie.year', 'DESC')
      .take(limit);

    return queryBuilder.getMany();
  }

  async findRelated(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      return [];
    }

    // Find movies with similar genres
    const queryBuilder = this.movieRepository.createQueryBuilder('movie');
    if (movie.genres && movie.genres.length > 0) {
      queryBuilder.where('movie.id != :id', { id });
      movie.genres.forEach((genre, index) => {
        if (index === 0) {
          queryBuilder.andWhere('movie.genres @> ARRAY[:genre]', { genre });
        } else {
          queryBuilder.orWhere('movie.genres @> ARRAY[:genre]', { genre });
        }
      });
    }
    queryBuilder.orderBy('movie.imdbRating', 'DESC').take(10);
    return queryBuilder.getMany();
  }

  // --- TMDB-backed discovery (movie + series) for Recap Entry / Catch Up ---

  async searchMulti(query: string, page = 1) {
    return this.tmdbService.searchMulti(query, page);
  }

  async getTrendingAll(timeWindow: 'day' | 'week' = 'week') {
    return this.tmdbService.getTrendingAll(timeWindow);
  }

  async getTrendingTv(timeWindow: 'day' | 'week' = 'week') {
    return this.tmdbService.getTrendingTv(timeWindow);
  }

  async getTvOnTheAir(page = 1) {
    return this.tmdbService.getTvOnTheAir(page);
  }

  async getPopularTv(page = 1) {
    return this.tmdbService.getPopularTv(page);
  }

  async getTvDetail(id: number) {
    return this.tmdbService.getTvDetail(id);
  }

  async getTvSeasonDetail(seriesId: number, seasonNumber: number) {
    return this.tmdbService.getTvSeasonDetail(seriesId, seasonNumber);
  }

  async getMovieDetail(tmdbId: number) {
    return this.tmdbService.getfullMovieDetail(tmdbId);
  }
}
