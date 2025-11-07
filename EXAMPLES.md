# Error Tracking System - Usage Examples

This document provides practical examples of how the error tracking system works.

## Example 1: Basic Error Tracking

```typescript
import { ErrorTracker, DocumentationFetcher } from './src/error-tracker';

// Create tracker with threshold of 3 occurrences
const tracker = new ErrorTracker(3);
const docFetcher = new DocumentationFetcher();

// Track an error
try {
  // Some code that might fail
  throw new TypeError('Cannot read property "x" of undefined');
} catch (error) {
  const record = tracker.track(error, { handler: 'contact', user: 'test@example.com' });
  console.log(`Error tracked: ${record.message} (count: ${record.count})`);
}
```

## Example 2: Detecting Frequent Errors

```typescript
// Simulate the same error occurring multiple times
const error = new TypeError('Cannot read property "x" of undefined');

// First occurrence
tracker.track(error, { handler: 'contact' });
console.log('Tracked first occurrence');

// Second occurrence
tracker.track(error, { handler: 'contact' });
console.log('Tracked second occurrence');

// Third occurrence - now it's frequent!
const record = tracker.track(error, { handler: 'contact' });
if (tracker.isFrequent(record.fingerprint)) {
  console.log('⚠️ Frequent error detected!');
  
  // Automatically fetch documentation
  const docs = await docFetcher.fetchDocumentation(record);
  console.log('Suggested documentation:');
  docs.slice(0, 3).forEach(doc => {
    console.log(`- ${doc.source}: ${doc.url}`);
  });
}

// Output:
// ⚠️ Frequent error detected!
// Suggested documentation:
// - MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
// - Stack Overflow: https://stackoverflow.com/search?q=Cannot+read+property+%22x%22+of+undefined
```

## Example 3: Worker Integration

The error tracking is automatically integrated into the worker handlers:

```typescript
// In handleContact function
async function handleContact(request: Request): Promise<Response> {
  try {
    // Process contact form
    const formData = await request.formData();
    // ... validation and processing
  } catch (error) {
    // Error is automatically tracked
    const err = error instanceof Error ? error : new Error(String(error));
    const record = errorTracker.track(err, { handler: 'contact' });
    
    // If frequent, documentation is automatically logged
    if (errorTracker.isFrequent(record.fingerprint)) {
      console.warn(`Frequent contact form error (${record.count} occurrences):`, record.message);
      const docs = await docFetcher.fetchDocumentation(record);
      if (docs.length > 0) {
        console.log('Suggested documentation:');
        docs.slice(0, 3).forEach(doc => console.log(`- ${doc.source}: ${doc.url}`));
      }
    }
    
    return new Response('Please complete all fields correctly.', { status: 400 });
  }
}
```

## Example 4: Accessing Error Reports via API

```bash
# Get frequent errors only
curl https://tacticdev.com/api/errors

# Get all errors
curl https://tacticdev.com/api/errors?all=true
```

Response:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "threshold": 3,
  "totalErrors": 5,
  "frequentErrors": 2,
  "errors": [
    {
      "fingerprint": "TypeError:Cannot read property \"x\" of undefined:{\"handler\":\"contact\"}",
      "message": "Cannot read property \"x\" of undefined",
      "count": 5,
      "firstSeen": "2024-01-15T10:00:00.000Z",
      "lastSeen": "2024-01-15T10:25:00.000Z",
      "context": { "handler": "contact" },
      "isFrequent": true
    },
    {
      "fingerprint": "Error:R2 bucket not found:{\"handler\":\"loom-download\"}",
      "message": "R2 bucket not found",
      "count": 4,
      "firstSeen": "2024-01-15T10:05:00.000Z",
      "lastSeen": "2024-01-15T10:28:00.000Z",
      "context": { "handler": "loom-download", "path": "latest/loom-linux-x64" },
      "isFrequent": true
    }
  ]
}
```

## Example 5: Documentation Fetching

```typescript
const error = new Error('R2 bucket not found');
const record: ErrorRecord = {
  fingerprint: createErrorFingerprint(error),
  message: error.message,
  count: 5,
  firstSeen: Date.now(),
  lastSeen: Date.now(),
  context: { handler: 'loom-download' }
};

const docs = await docFetcher.fetchDocumentation(record);

// Documentation results are sorted by relevance
docs.forEach(doc => {
  console.log(`${doc.source} (relevance: ${doc.relevance})`);
  console.log(`  ${doc.url}`);
  console.log(`  ${doc.snippet}`);
});

// Output:
// Cloudflare Workers Docs (relevance: 0.9)
//   https://developers.cloudflare.com/r2/
//   Documentation for R2 in Cloudflare Workers
// Stack Overflow (relevance: 0.7)
//   https://stackoverflow.com/search?q=R2+bucket+not+found
//   Search Stack Overflow for: R2 bucket not found
```

## Example 6: Testing Error Tracking

```typescript
import { describe, it, expect } from 'vitest';
import { ErrorTracker } from '../src/error-tracker';

describe('Error Tracking', () => {
  it('identifies frequent errors', () => {
    const tracker = new ErrorTracker(3);
    const error = new Error('Test error');
    
    // Track error 3 times
    tracker.track(error);
    tracker.track(error);
    tracker.track(error);
    
    // Should now be frequent
    const fingerprint = createErrorFingerprint(error);
    expect(tracker.isFrequent(fingerprint)).toBe(true);
    
    // Should appear in frequent errors list
    const frequentErrors = tracker.getFrequentErrors();
    expect(frequentErrors).toHaveLength(1);
    expect(frequentErrors[0].count).toBe(3);
  });
});
```

## Example 7: Real-World Scenario

Imagine a scenario where R2 is temporarily unavailable:

```
// First download attempt fails
Error fetching from R2: Error: R2 bucket not found
Tracked R2 error (count: 1)

// Second download attempt fails
Error fetching from R2: Error: R2 bucket not found
Tracked R2 error (count: 2)

// Third download attempt fails - FREQUENT ERROR!
Error fetching from R2: Error: R2 bucket not found
⚠️ Frequent R2 error (3 occurrences): R2 bucket not found
Suggested documentation:
- Cloudflare Workers Docs: https://developers.cloudflare.com/r2/
- Stack Overflow: https://stackoverflow.com/search?q=R2+bucket+not+found

// Developer can immediately check:
// 1. R2 bucket configuration
// 2. Binding settings in wrangler.jsonc
// 3. Recent R2 service status
```

This automatic documentation helps developers quickly identify and resolve issues without searching for documentation manually.

## Benefits

1. **Immediate Feedback**: Get documentation links as soon as errors become frequent
2. **Reduced MTTR**: Mean Time To Resolution is reduced with instant documentation
3. **Learning**: Developers learn from documentation presented in context
4. **Monitoring**: Track error trends over time via the API
5. **Proactive**: Catch issues before they become critical

## Next Steps

- Set up monitoring dashboards using the `/api/errors` endpoint
- Configure alerts for when frequent errors are detected
- Integrate with incident management systems
- Use error patterns to improve code quality
