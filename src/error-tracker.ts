/**
 * Error tracking system that identifies frequently occurring errors
 * and automatically fetches relevant documentation
 */

export interface ErrorRecord {
  fingerprint: string;
  message: string;
  stack?: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
  context?: Record<string, any>;
}

export interface DocumentationResult {
  source: string;
  url: string;
  snippet: string;
  relevance: number;
}

/**
 * Creates a unique fingerprint for an error to group similar errors
 */
export function createErrorFingerprint(error: Error, context?: Record<string, any>): string {
  // Create a fingerprint from the error name, message and context values
  const contextStr = context ? JSON.stringify(context, Object.keys(context).sort()) : '';
  
  return `${error.name}:${error.message}:${contextStr}`;
}

/**
 * In-memory error tracking (use KV or Durable Objects in production)
 */
export class ErrorTracker {
  private errors: Map<string, ErrorRecord> = new Map();
  private readonly threshold: number;

  constructor(threshold: number = 3) {
    this.threshold = threshold;
  }

  /**
   * Track an error occurrence
   */
  track(error: Error, context?: Record<string, any>): ErrorRecord {
    const fingerprint = createErrorFingerprint(error, context);
    const now = Date.now();

    const existing = this.errors.get(fingerprint);
    if (existing) {
      existing.count++;
      existing.lastSeen = now;
      this.errors.set(fingerprint, existing);
      return existing;
    }

    const record: ErrorRecord = {
      fingerprint,
      message: error.message,
      stack: error.stack,
      count: 1,
      firstSeen: now,
      lastSeen: now,
      context
    };

    this.errors.set(fingerprint, record);
    return record;
  }

  /**
   * Check if an error has exceeded the frequency threshold
   */
  isFrequent(fingerprint: string): boolean {
    const record = this.errors.get(fingerprint);
    return record ? record.count >= this.threshold : false;
  }

  /**
   * Get all errors that exceed the frequency threshold
   */
  getFrequentErrors(): ErrorRecord[] {
    return Array.from(this.errors.values())
      .filter(record => record.count >= this.threshold)
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get all tracked errors
   */
  getAllErrors(): ErrorRecord[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get a specific error record
   */
  getError(fingerprint: string): ErrorRecord | undefined {
    return this.errors.get(fingerprint);
  }

  /**
   * Clear all error records (useful for testing)
   */
  clear(): void {
    this.errors.clear();
  }
}

/**
 * Documentation fetcher that searches for relevant documentation
 */
export class DocumentationFetcher {
  private cache: Map<string, DocumentationResult[]> = new Map();
  private readonly cacheTimeout: number;

  constructor(cacheTimeoutMs: number = 3600000) { // 1 hour default
    this.cacheTimeout = cacheTimeoutMs;
  }

  /**
   * Fetch documentation for an error
   */
  async fetchDocumentation(error: ErrorRecord): Promise<DocumentationResult[]> {
    // Check cache first
    const cached = this.cache.get(error.fingerprint);
    if (cached) {
      return cached;
    }

    const results: DocumentationResult[] = [];

    // Search different documentation sources
    results.push(...await this.searchCloudflareWorkersDocs(error));
    results.push(...await this.searchMDN(error));
    results.push(...await this.searchStackOverflow(error));

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    // Cache the results
    this.cache.set(error.fingerprint, results);

    // Clear cache after timeout
    setTimeout(() => {
      this.cache.delete(error.fingerprint);
    }, this.cacheTimeout);

    return results;
  }

  /**
   * Search Cloudflare Workers documentation
   */
  private async searchCloudflareWorkersDocs(error: ErrorRecord): Promise<DocumentationResult[]> {
    const results: DocumentationResult[] = [];

    // Common Cloudflare Workers error patterns
    const patterns: Record<string, string> = {
      'R2': 'https://developers.cloudflare.com/r2/',
      'KV': 'https://developers.cloudflare.com/kv/',
      'fetch': 'https://developers.cloudflare.com/workers/runtime-apis/fetch/',
      'Response': 'https://developers.cloudflare.com/workers/runtime-apis/response/',
      'Request': 'https://developers.cloudflare.com/workers/runtime-apis/request/',
      'Headers': 'https://developers.cloudflare.com/workers/runtime-apis/headers/',
      'FormData': 'https://developers.cloudflare.com/workers/runtime-apis/formdata/',
    };

    for (const [keyword, url] of Object.entries(patterns)) {
      if (error.message.includes(keyword) || error.stack?.includes(keyword)) {
        results.push({
          source: 'Cloudflare Workers Docs',
          url,
          snippet: `Documentation for ${keyword} in Cloudflare Workers`,
          relevance: 0.9
        });
      }
    }

    return results;
  }

  /**
   * Search MDN Web Docs
   */
  private async searchMDN(error: ErrorRecord): Promise<DocumentationResult[]> {
    const results: DocumentationResult[] = [];

    // Common JavaScript/Web API error patterns
    const patterns: Record<string, string> = {
      'TypeError': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError',
      'ReferenceError': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError',
      'SyntaxError': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError',
      'RangeError': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError',
      'JSON': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON',
      'Promise': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
      'async': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
    };

    for (const [keyword, url] of Object.entries(patterns)) {
      if (error.message.includes(keyword) || error.stack?.includes(keyword)) {
        results.push({
          source: 'MDN Web Docs',
          url,
          snippet: `MDN documentation for ${keyword}`,
          relevance: 0.8
        });
      }
    }

    return results;
  }

  /**
   * Search Stack Overflow (return generic search URL)
   */
  private async searchStackOverflow(error: ErrorRecord): Promise<DocumentationResult[]> {
    const searchQuery = encodeURIComponent(error.message);
    const url = `https://stackoverflow.com/search?q=${searchQuery}`;

    return [{
      source: 'Stack Overflow',
      url,
      snippet: `Search Stack Overflow for: ${error.message}`,
      relevance: 0.7
    }];
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    this.cache.clear();
  }
}
