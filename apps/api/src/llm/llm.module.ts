import { Module } from '@nestjs/common';
import { LlmService } from './service/llm.service';
import { LlmController } from './llm.controller';

@Module({
  providers: [LlmService],
  exports: [LlmService],
  controllers: [LlmController],
})
export class LlmModule {}