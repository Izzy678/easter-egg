import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  private readonly TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";
  private readonly TMDB_IMAGE_SIZE_POSTER_HIGH_QUALITY = "w500";
  private readonly TMDB_IMAGE_SIZE_BACKDROP_LARGE = "w1280";
  private readonly TMDB_IMAGE_SIZE_BACKDROP_ORIGINAL = "original";

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY', '');
    if (!this.apiKey) {
      this.logger.warn('TMDB_API_KEY not set. TMDb integration will not work.');
    }
  }

  async getfullMovieDetail(movieId: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}&append_to_response=credits,release_dates`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching movie ${movieId} from TMDb:`, error);
      throw error;
    }
  }

  async getMovieReviews(movieId: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/movie/${movieId}/reviews?api_key=${this.apiKey}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching movie reviews for movie ${movieId} from TMDb:`, error);
      throw error;
    }
  }

  async getMovieRecommendations(movieId: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/movie/${movieId}/recommendations?api_key=${this.apiKey}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching movie ${movieId} from TMDb:`, error);
      throw error;
    }
  }

  async getPopularMovies(page = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching popular movies from TMDb:', error);
      throw error;
    }
  }

  async getTopRatedMovies(page = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&page=${page}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching top rated movies from TMDb:', error);
      throw error;
    }
  }

  async getNowPlayingInTheaters(page = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&page=${page}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching now playing in theaters movies from TMDb:', error);
      throw error;
    }
  }

  async getUpcomingMovies(page = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&page=${page}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching upcoming movies from TMDb:', error);
      throw error;
    }
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
    try {
      const response = await axios.get(
        `${this.baseUrl}/trending/movie/${timeWindow}?api_key=${this.apiKey}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching trending movies from TMDb:', error);
      throw error;
    }
  }

  async searchMulti(query: string, page = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/search/multi?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error searching TMDb multi:', error);
      throw error;
    }
  }

  async getTrendingAll(timeWindow: 'day' | 'week' = 'week') {
    try {
      const response = await axios.get(
        `${this.baseUrl}/trending/all/${timeWindow}?api_key=${this.apiKey}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching trending all from TMDb:', error);
      throw error;
    }
  }

  async getTrendingTv(timeWindow: 'day' | 'week' = 'week') {
    try {
      const response = await axios.get(
        `${this.baseUrl}/trending/tv/${timeWindow}?api_key=${this.apiKey}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching trending TV from TMDb:', error);
      throw error;
    }
  }

  async getTvOnTheAir(page = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tv/on_the_air?api_key=${this.apiKey}&page=${page}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching TV on the air from TMDb:', error);
      throw error;
    }
  }

  async getPopularTv(page = 1) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tv/popular?api_key=${this.apiKey}&page=${page}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching popular TV from TMDb:', error);
      throw error;
    }
  }

  async getTvDetail(id: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tv/${id}?api_key=${this.apiKey}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching TV ${id} from TMDb:`, error);
      throw error;
    }
  }

  async getTvSeasonDetail(seriesId: number, seasonNumber: number) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tv/${seriesId}/season/${seasonNumber}?api_key=${this.apiKey}`
      );
      if (!response.data) {
        throw new BadRequestException(`TMDb API error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error fetching TV ${seriesId} season ${seasonNumber} from TMDb:`,
        error
      );
      throw error;
    }
  }
}
