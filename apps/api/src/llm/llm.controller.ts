import { Post, Body, Controller } from "@nestjs/common";
import { LlmService } from "./service/llm.service";

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('generate-text')
  async generateText(@Body() body: { prompt: string }) {
    return await this.llmService.generateText(body.prompt);
  }
}