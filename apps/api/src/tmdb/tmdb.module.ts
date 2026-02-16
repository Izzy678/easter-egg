import { Global, Module } from '@nestjs/common';
import { TmdbService } from './service/tmdb.service';
import { TmdbController } from './controller/tmdb.controller';

@Global()
@Module({
  providers: [TmdbService],
  controllers: [TmdbController],
  exports: [TmdbService],
})
export class TmdbModule {}
