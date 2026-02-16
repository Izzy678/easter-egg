import { Module } from '@nestjs/common';
import { RecapController } from './controller/recap.controller';
import { RecapService } from './service/recap.service';
import { RecapDataBuilder } from './data/recap-data.builder';

@Module({
  controllers: [RecapController],
  providers: [RecapService, RecapDataBuilder],
  exports: [RecapService],
})
export class RecapModule {}