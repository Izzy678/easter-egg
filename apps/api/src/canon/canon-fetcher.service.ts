import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const FETCH_TIMEOUT_MS = 8000;
const SCRAPER_API_TIMEOUT_MS = 30000;
const BROWSER_TIMEOUT_MS = 20000;

/** Set to "true" to retry 403 Fandom requests with a real browser (Playwright). Requires optional dep playwright. */
const CANON_USE_BROWSER = process.env.CANON_USE_BROWSER === 'true';

/**
 * Fetches raw canon text (e.g. from Fandom wikis) for movies and series
 * to enrich recap context. Returns empty string on any failure.
 */
@Injectable()
export class CanonFetcherService {
  private readonly logger = new Logger(CanonFetcherService.name);
  private readonly scraperApiKey: string;
    constructor(private readonly configService: ConfigService) {
        this.scraperApiKey = process.env.SCRAPER_API_KEY?.trim() || '';
  }
  /**
   * Get additional canon summary for a movie. Returns empty string if unavailable.
   */
  async getMovieCanonSummary(movieId: number, title: string): Promise<string> {
    try {
      const slug = this.titleToFandomSlug(title);
      if (!slug) return '';
      const wikiPath = title.replace(/\s+/g, '_');
      const url = `https://${slug}.fandom.com/wiki/${encodeURIComponent(wikiPath).replace(/'/g, '%27')}`;
      const raw = await this.fetchAndStripHtml(url, slug);
      const text = this.extractSynopsisAndPlot(raw);
      return text.slice(0, 12000);
    } catch (err) {
      this.logger.debug(
        `Canon fetch failed for movie ${movieId} (${title})`,
        err instanceof Error ? err.message : err,
      );
      return '';
    }
  }

  /**
   * Get additional canon summary for a series episode range using episode names for Fandom wiki URLs
   * (e.g. https://from.fandom.com/wiki/Shatter). Returns empty string if unavailable.
   */
  async getSeriesCanonSummary(
    seriesId: number,
    seriesName: string,
    season: number,
    episodes: { episodeNumber: number; name: string }[],
  ): Promise<string> {
    try {
      const slug = this.titleToFandomSlug(seriesName);
      if (!slug) return '';
      const parts: string[] = [];
      for (const ep of episodes) {
        const pageName = ep.name.trim() || `Season_${season}_Episode_${ep.episodeNumber}`;
        const wikiPath = pageName.replace(/\s+/g, '_');
        const url = `https://${slug}.fandom.com/wiki/${encodeURIComponent(wikiPath).replace(/'/g, '%27')}`;
        const raw = await this.fetchAndStripHtml(url, slug);
        const text = this.extractSynopsisAndPlot(raw);
        if (text.trim()) {
          parts.push(`Episode ${ep.episodeNumber} "${ep.name}":\n${text.slice(0, 4000)}`);
        }
      }
      if (parts.length === 0) return '';
      return parts.join('\n\n');
    } catch (err) {
      this.logger.debug(
        `Canon fetch failed for series ${seriesId} S${season}`,
        err instanceof Error ? err.message : err,
      );
      return '';
    }
  }

  private titleToFandomSlug(title: string): string {
    const normalized = title
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    return normalized || '';
  }

  private async fetchAndStripHtml(url: string, fandomSlug?: string): Promise<string> {
    if (this.scraperApiKey) {
      const html = await this.fetchWithScraperApi(url);
      if (html) return this.stripHtml(html);
      return '';
    }

    const origin = fandomSlug
      ? `https://${fandomSlug}.fandom.com`
      : new URL(url).origin;
    const res = await axios.get<string>(url, {
      timeout: FETCH_TIMEOUT_MS,
      responseType: 'text',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: `${origin}/`,
      },
      validateStatus: (status) => status === 200 || status === 404 || status === 403,
    });

    if (res.status === 200 && typeof res.data === 'string') {
      return this.stripHtml(res.data);
    }
    if (res.status === 403 && CANON_USE_BROWSER) {
      this.logger.debug(`Canon fetch blocked (403) for ${url}, retrying with browser`);
      const html = await this.fetchWithBrowser(url);
      if (html) return this.stripHtml(html);
    }
    if (res.status === 403) {
      this.logger.debug(`Canon fetch blocked (403) for ${url} — Fandom/Cloudflare challenge`);
    }
    return '';
  }

  /**
   * Fetch page HTML via ScraperAPI (proxies, retries, optional JS). Use when direct requests get 403.
   * Set SCRAPER_API_KEY in env. See https://www.scraperapi.com/documentation/
   */
  private async fetchWithScraperApi(targetUrl: string): Promise<string> {
    try {
      const apiUrl = `https://api.scraperapi.com?api_key=${encodeURIComponent(this.scraperApiKey)}&url=${encodeURIComponent(targetUrl)}`;
      const res = await axios.get<string>(apiUrl, {
        timeout: SCRAPER_API_TIMEOUT_MS,
        responseType: 'text',
        validateStatus: (status) => status === 200 || status >= 400,
      });
      if (res.status === 200 && typeof res.data === 'string') {
        return res.data;
      }
      this.logger.debug(
        `ScraperAPI failed for ${targetUrl}: status ${res.status}`,
      );
      return '';
    } catch (err) {
        console.log('err', err);
      this.logger.debug(
        'ScraperAPI fetch failed',
        err instanceof Error ? err.message : String(err),
      );
      return '';
    }
  }

  /**
   * Fetch page HTML with Playwright (real browser). Used when axios gets 403 from Cloudflare.
   * Requires optional dependency playwright and CANON_USE_BROWSER=true.
   */
  private async fetchWithBrowser(url: string): Promise<string> {
    try {
      // Optional: install playwright (optionalDependency) and set CANON_USE_BROWSER=true
      // @ts-expect-error - optional dependency, may not be installed
      const { chromium } = await import('playwright');
      const browser = await chromium.launch({ headless: true });
      try {
        const page = await browser.newPage();
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: BROWSER_TIMEOUT_MS,
        });
        await new Promise((r) => setTimeout(r, 4000));
        const html = await page.content();
        return html ?? '';
      } finally {
        await browser.close();
      }
    } catch (err) {
      this.logger.debug(
        'Browser canon fetch failed',
        err instanceof Error ? err.message : String(err),
      );
      return '';
    }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Extract only Synopsis and Plot sections from Fandom wiki text to reduce noise
   * (nav, cast, footer, etc.). Falls back to truncated raw text if sections not found.
   */
  private extractSynopsisAndPlot(raw: string): string {
    const normalized = ` ${raw} `;
    const synopsisMark = 'Synopsis [ ]';
    const plotMark = 'Plot [ ]';
    const iSynopsisBracket = normalized.indexOf(synopsisMark);
    const iSynopsis = iSynopsisBracket !== -1 ? iSynopsisBracket : normalized.indexOf('Synopsis ');
    const iPlotBracket = normalized.indexOf(plotMark);
    const iPlot = iPlotBracket !== -1 ? iPlotBracket : normalized.indexOf('Plot ');
    const synopsisLabelLen = iSynopsisBracket !== -1 ? synopsisMark.length : 'Synopsis '.length;
    const plotLabelLen = iPlotBracket !== -1 ? plotMark.length : 'Plot '.length;

    const sectionEndMarkers = [
      'Trivia [ ]',
      'Appearances [ ]',
      'Cast [ ]',
      'Locations [ ]',
      'Deaths [ ]',
      'Categories',
      'Community content is available',
      'Sign in to edit',
    ];

    const findSectionEnd = (start: number): number => {
      let end = normalized.length;
      for (const marker of sectionEndMarkers) {
        const i = normalized.indexOf(marker, start);
        if (i !== -1 && i < end) end = i;
      }
      return end;
    };

    const parts: string[] = [];

    if (iSynopsis !== -1 && iPlot !== -1 && iPlot > iSynopsis) {
      const synopsisStart = iSynopsis + synopsisLabelLen;
      const synopsisEnd = iPlot;
      const synopsis = normalized.slice(synopsisStart, synopsisEnd).trim();
      if (synopsis) parts.push(`Synopsis: ${synopsis}`);
    }

    if (iPlot !== -1) {
      const plotStart = iPlot + plotLabelLen;
      const plotEnd = findSectionEnd(plotStart);
      const plot = normalized.slice(plotStart, plotEnd).trim();
      if (plot) parts.push(`Plot: ${plot}`);
    }

    if (parts.length > 0) return parts.join('\n\n');
    return raw.slice(0, 6000).trim();
  }
}
