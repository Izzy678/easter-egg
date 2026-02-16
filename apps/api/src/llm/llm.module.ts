import { Global, Module } from '@nestjs/common';
import { LlmService } from './service/llm.service';
@Global()
@Module({
  providers: [LlmService],
  exports: [LlmService],
})
export class LlmModule {}