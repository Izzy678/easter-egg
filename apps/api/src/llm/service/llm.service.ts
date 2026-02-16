import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private readonly baseUrl = 'https://router.huggingface.co/v1/chat/completions';
  private readonly model: string;
  private readonly apiKey: string;
  private readonly geminiApiKey: string;
  private readonly geminiModel: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('HUGGINGFACE_API_KEY') ?? '';
    this.model = this.config.get<string>('HUGGINGFACE_INFERENCE_MODEL') ?? 'MiniMaxAI/MiniMax-M2.5';
    this.geminiApiKey = this.config.get<string>('GOOGLE_GEMINI_API_KEY') ?? '';
    this.geminiModel = 'gemini-2.0-flash';
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          parameters: {
            temperature: 0.4,
            max_new_tokens: 500,
            return_full_text: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60_000,
        },
      );
      return response.data?.choices?.[0]?.message?.content ?? '';
    } catch (error) {
      this.logger.error('LLM generation failed', error?.response?.data);
      throw new Error('Failed to generate recap');
    }
  }

  /**
   * Generate text using Google Gemini. Set GOOGLE_GEMINI_API_KEY in .env.
   * Optional: GOOGLE_GEMINI_MODEL (default: gemini-1.5-flash).
   */
  async generateTextWithGemini(prompt: string): Promise<string> {
    if (!this.geminiApiKey) {
      this.logger.warn('GOOGLE_GEMINI_API_KEY not set');
      throw new Error('Gemini API key not configured');
    }
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
      this.logger.error('Gemini generation failed', error?.response?.data);
      throw new Error('Failed to generate recap with Gemini');
    }
  }
}
