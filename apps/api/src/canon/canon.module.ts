import { Module } from '@nestjs/common';
import { CanonFetcherService } from './canon-fetcher.service';

@Module({
  providers: [CanonFetcherService],
  exports: [CanonFetcherService],
})
export class CanonModule {}
