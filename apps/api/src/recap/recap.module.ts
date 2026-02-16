import { Module } from '@nestjs/common';
import { RecapController } from './controller/recap.controller';
import { RecapService } from './service/recap.service';
import { RecapDataBuilder } from './data/recap-data.builder';
import { LlmModule } from '../llm/llm.module';
import { CanonModule } from '../canon/canon.module';

@Module({
  imports: [LlmModule, CanonModule],
  controllers: [RecapController],
  providers: [RecapService, RecapDataBuilder],
  exports: [RecapService],
})
export class RecapModule {}