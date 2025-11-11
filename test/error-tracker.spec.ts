import { describe, it, expect, beforeEach } from 'vitest';
import {
  ErrorTracker,
  DocumentationFetcher,
  createErrorFingerprint,
  type ErrorRecord
} from '../src/error-tracker';

describe('Error Tracking System', () => {
  describe('createErrorFingerprint', () => {
    it('creates unique fingerprints for different errors', () => {
      const error1 = new Error('Type error');
      const error2 = new Error('Reference error');

      const fp1 = createErrorFingerprint(error1);
      const fp2 = createErrorFingerprint(error2);

      expect(fp1).not.toBe(fp2);
    });

    it('creates same fingerprint for identical errors', () => {
      const error1 = new Error('Same error');
      const error2 = new Error('Same error');

      const fp1 = createErrorFingerprint(error1);
      const fp2 = createErrorFingerprint(error2);

      expect(fp1).toBe(fp2);
    });

    it('includes context in fingerprint', () => {
      const error = new Error('Error');
      const fp1 = createErrorFingerprint(error, { path: '/test' });
      const fp2 = createErrorFingerprint(error, { path: '/other' });

      expect(fp1).not.toBe(fp2);
    });
  });

  describe('ErrorTracker', () => {
    let tracker: ErrorTracker;

    beforeEach(() => {
      tracker = new ErrorTracker(3);
    });

    it('tracks a new error', () => {
      const error = new Error('Test error');
      const record = tracker.track(error);

      expect(record).toBeDefined();
      expect(record.message).toBe('Test error');
      expect(record.count).toBe(1);
    });

    it('increments count for repeated errors', () => {
      const error = new Error('Repeated error');
      
      const record1 = tracker.track(error);
      expect(record1.count).toBe(1);

      const record2 = tracker.track(error);
      expect(record2.count).toBe(2);

      const record3 = tracker.track(error);
      expect(record3.count).toBe(3);
    });

    it('identifies frequent errors based on threshold', () => {
      const error = new Error('Frequent error');

      tracker.track(error);
      expect(tracker.isFrequent(createErrorFingerprint(error))).toBe(false);

      tracker.track(error);
      expect(tracker.isFrequent(createErrorFingerprint(error))).toBe(false);

      tracker.track(error);
      expect(tracker.isFrequent(createErrorFingerprint(error))).toBe(true);
    });

    it('returns all frequent errors', () => {
      const error1 = new Error('Error 1');
      const error2 = new Error('Error 2');
      const error3 = new Error('Error 3');

      // Error 1: 3 times (frequent)
      tracker.track(error1);
      tracker.track(error1);
      tracker.track(error1);

      // Error 2: 2 times (not frequent)
      tracker.track(error2);
      tracker.track(error2);

      // Error 3: 4 times (frequent)
      tracker.track(error3);
      tracker.track(error3);
      tracker.track(error3);
      tracker.track(error3);

      const frequentErrors = tracker.getFrequentErrors();
      expect(frequentErrors).toHaveLength(2);
      expect(frequentErrors[0].count).toBe(4); // Sorted by count
      expect(frequentErrors[1].count).toBe(3);
    });

    it('returns all errors regardless of frequency', () => {
      const error1 = new Error('Error 1');
      const error2 = new Error('Error 2');

      tracker.track(error1);
      tracker.track(error2);
      tracker.track(error2);
      tracker.track(error2);
      tracker.track(error2);

      const allErrors = tracker.getAllErrors();
      expect(allErrors).toHaveLength(2);
    });

    it('tracks context with errors', () => {
      const error = new Error('Context error');
      const context = { handler: 'contact', user: 'test@example.com' };

      const record = tracker.track(error, context);
      expect(record.context).toEqual(context);
    });

    it('clears all errors', () => {
      const error = new Error('Clear test');
      tracker.track(error);
      expect(tracker.getAllErrors()).toHaveLength(1);

      tracker.clear();
      expect(tracker.getAllErrors()).toHaveLength(0);
    });
  });

  describe('DocumentationFetcher', () => {
    let fetcher: DocumentationFetcher;

    beforeEach(() => {
      fetcher = new DocumentationFetcher();
    });

    it('fetches documentation for Cloudflare-related errors', async () => {
      const error = new Error('R2 bucket not found');
      const record: ErrorRecord = {
        fingerprint: createErrorFingerprint(error),
        message: error.message,
        count: 3,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      };

      const docs = await fetcher.fetchDocumentation(record);
      
      expect(docs.length).toBeGreaterThan(0);
      const r2Doc = docs.find(d => d.source === 'Cloudflare Workers Docs');
      expect(r2Doc).toBeDefined();
      expect(r2Doc?.url).toContain('cloudflare.com');
    });

    it('fetches documentation for JavaScript errors', async () => {
      const error = new TypeError('Cannot read property of undefined');
      const record: ErrorRecord = {
        fingerprint: createErrorFingerprint(error),
        message: error.message,
        stack: error.stack,
        count: 5,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      };

      const docs = await fetcher.fetchDocumentation(record);
      
      expect(docs.length).toBeGreaterThan(0);
      const mdnDoc = docs.find(d => d.source === 'MDN Web Docs');
      expect(mdnDoc).toBeDefined();
      expect(mdnDoc?.url).toContain('mozilla.org');
    });

    it('includes Stack Overflow search link', async () => {
      const error = new Error('Some random error');
      const record: ErrorRecord = {
        fingerprint: createErrorFingerprint(error),
        message: error.message,
        count: 4,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      };

      const docs = await fetcher.fetchDocumentation(record);
      
      const soDoc = docs.find(d => d.source === 'Stack Overflow');
      expect(soDoc).toBeDefined();
      expect(soDoc?.url).toContain('stackoverflow.com/search');
    });

    it('sorts documentation by relevance', async () => {
      const error = new Error('R2 TypeError with Promise');
      const record: ErrorRecord = {
        fingerprint: createErrorFingerprint(error),
        message: error.message,
        count: 3,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      };

      const docs = await fetcher.fetchDocumentation(record);
      
      // Should be sorted by relevance (descending)
      for (let i = 0; i < docs.length - 1; i++) {
        expect(docs[i].relevance).toBeGreaterThanOrEqual(docs[i + 1].relevance);
      }
    });

    it('caches documentation results', async () => {
      const error = new Error('Cache test');
      const record: ErrorRecord = {
        fingerprint: createErrorFingerprint(error),
        message: error.message,
        count: 3,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      };

      const docs1 = await fetcher.fetchDocumentation(record);
      const docs2 = await fetcher.fetchDocumentation(record);
      
      // Should return the same cached results
      expect(docs1).toEqual(docs2);
    });

    it('clears cache', async () => {
      const error = new Error('Clear cache test');
      const record: ErrorRecord = {
        fingerprint: createErrorFingerprint(error),
        message: error.message,
        count: 3,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      };

      await fetcher.fetchDocumentation(record);
      fetcher.clearCache();
      
      // After clearing cache, fetching should work again
      const docs = await fetcher.fetchDocumentation(record);
      expect(docs.length).toBeGreaterThan(0);
    });
  });
});
