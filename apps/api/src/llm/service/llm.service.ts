import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly geminiApiKey: string;
  private readonly geminiModel: string;

  constructor(private config: ConfigService) {
    this.geminiApiKey = this.config.get<string>('GOOGLE_GEMINI_API_KEY') ?? '';
    this.geminiModel = 'gemini-2.0-flash';
  }

  /**
   * Generate text using Google Gemini. Set GOOGLE_GEMINI_API_KEY in .env.
   * Optional: GOOGLE_GEMINI_MODEL (default: gemini-1.5-flash).
   */
  async generateText(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`;
    try {
      const response = await axios.post(
        url,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60_000,
        },
      );
      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      return text.trim();
    } catch (error) {
      this.logger.error('LLM generation failed', error?.response?.data);
      throw new InternalServerErrorException('Failed to generate text');
    }
  }
}
