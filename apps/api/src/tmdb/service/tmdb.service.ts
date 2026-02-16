import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.themoviedb.org/3';


  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY', '');
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
      throw new InternalServerErrorException('Failed to fetch movie detail');
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
      throw new InternalServerErrorException('Failed to fetch movie reviews');
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
      throw new InternalServerErrorException('Failed to fetch movie recommendations');
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
      throw new InternalServerErrorException('Failed to fetch popular movies');
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
      throw new InternalServerErrorException('Failed to fetch top rated movies');
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
      throw new InternalServerErrorException('Failed to fetch now playing in theaters movies');
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
      throw new InternalServerErrorException('Failed to fetch upcoming movies');
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
      throw new InternalServerErrorException('Failed to fetch trending movies');
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
      throw new InternalServerErrorException('Failed to search TMDb multi');
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
      throw new InternalServerErrorException('Failed to fetch trending all');
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
      throw new InternalServerErrorException('Failed to fetch trending TV');
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
      throw new InternalServerErrorException('Failed to fetch TV on the air');
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
      throw new InternalServerErrorException('Failed to fetch popular TV');
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
      throw new InternalServerErrorException('Failed to fetch TV detail');
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
      throw new InternalServerErrorException('Failed to fetch TV season detail');
    }
  }
}
