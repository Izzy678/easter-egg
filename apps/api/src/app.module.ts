import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { SeriesModule } from './series/series.module';
import { MoodsModule } from './moods/moods.module';
import { RecapsModule } from './recaps/recaps.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { TmdbModule } from './tmdb/tmdb.module';
import { LlmModule } from './llm/llm.module';
import { RecapModule } from './recap/recap.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
      envFilePath: '.env', // Specify the .env file path
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'vibe_coding_db'),
        };
        return {
          ...dbConfig,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),
    MoviesModule,
    SeriesModule,
    MoodsModule,
    RecapsModule,
    WatchlistModule,
    TmdbModule,
    LlmModule,
    CacheModule,
    RecapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}