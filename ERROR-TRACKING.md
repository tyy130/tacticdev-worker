# Error Tracking and Documentation System

This document describes the error tracking and automatic documentation system implemented in the TacticDev worker.

## Overview

The error tracking system automatically identifies errors that occur frequently in the worker and provides relevant documentation links to help diagnose and resolve these issues. This enables faster problem resolution by providing "absolute truth" documentation at the moment errors are detected.

## Features

### 1. Error Tracking

- **Frequency Detection**: Tracks error occurrences and identifies when errors exceed a configurable threshold (default: 3 occurrences)
- **Error Fingerprinting**: Groups similar errors together using a combination of error type, message, and context
- **Context Tracking**: Captures additional context (e.g., which handler triggered the error, request path) with each error

### 2. Automatic Documentation Fetching

When an error exceeds the frequency threshold, the system automatically:
- Searches for relevant documentation from multiple sources
- Provides links to official documentation (Cloudflare, MDN, Stack Overflow)
- Ranks documentation by relevance
- Caches results for performance

### 3. Error Reporting API

A dedicated endpoint (`/api/errors`) provides visibility into tracked errors:
- View all errors or only frequent ones
- See error counts, timestamps, and context
- Monitor error trends over time

## Architecture

### Core Components

1. **ErrorTracker** (`src/error-tracker.ts`)
   - Tracks error occurrences in memory
   - Identifies frequent errors based on threshold
   - Provides query methods for error analysis

2. **DocumentationFetcher** (`src/error-tracker.ts`)
   - Searches multiple documentation sources
   - Caches documentation results
   - Ranks results by relevance

3. **Integration** (`src/index.ts`)
   - Global error handler catches unhandled errors
   - Per-handler error tracking for targeted context
   - Automatic documentation logging when errors are frequent

## Usage

### Error Reporting Endpoint

Get a report of frequent errors:
```bash
curl https://tacticdev.com/api/errors
```

Get a report of all errors:
```bash
curl https://tacticdev.com/api/errors?all=true
```

Response format:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "threshold": 3,
  "totalErrors": 5,
  "frequentErrors": 2,
  "errors": [
    {
      "fingerprint": "TypeError:Cannot read property...:{}",
      "message": "Cannot read property 'x' of undefined",
      "count": 5,
      "firstSeen": "2024-01-15T10:00:00.000Z",
      "lastSeen": "2024-01-15T10:25:00.000Z",
      "context": { "handler": "contact" },
      "isFrequent": true
    }
  ]
}
```

### Documentation Sources

The system searches the following sources for documentation:

1. **Cloudflare Workers Documentation**
   - Covers R2, KV, Workers runtime APIs
   - Highest relevance score (0.9)

2. **MDN Web Docs**
   - JavaScript errors and Web APIs
   - High relevance score (0.8)

3. **Stack Overflow**
   - Search links for error messages
   - Medium relevance score (0.7)

### Console Output

When a frequent error is detected, the console will show:
```
Frequent R2 error (4 occurrences): File not found
Suggested documentation:
- Cloudflare Workers Docs: https://developers.cloudflare.com/r2/
- Stack Overflow: https://stackoverflow.com/search?q=File+not+found
```

## Configuration

### Error Threshold

The frequency threshold can be configured when creating the ErrorTracker:

```typescript
const errorTracker = new ErrorTracker(5); // Trigger at 5 occurrences
```

### Cache Timeout

Documentation cache timeout can be configured:

```typescript
const docFetcher = new DocumentationFetcher(7200000); // 2 hours
```

## Implementation Details

### Error Fingerprinting

Errors are fingerprinted using:
- Error name (e.g., "TypeError", "Error")
- Error message
- Context object (serialized)

This ensures similar errors are grouped together while keeping distinct errors separate.

### Context Tracking

Each error can have associated context:
```typescript
errorTracker.track(error, {
  handler: 'contact',
  path: '/contact',
  user: 'user@example.com'
});
```

### Handler Integration

The system is integrated into:
1. **Global error handler**: Catches all unhandled errors
2. **Contact form handler**: Tracks form validation and processing errors
3. **Loom download handler**: Tracks R2 access and file serving errors

## Testing

Comprehensive tests are provided in `test/error-tracker.spec.ts`:
- Error fingerprinting tests
- Frequency detection tests
- Documentation fetching tests
- Cache behavior tests
- Integration tests

Run tests:
```bash
npm test
```

## Production Considerations

The current implementation uses in-memory storage, which is suitable for development and single-worker deployments. For production at scale, consider:

### Durable Objects

Use Cloudflare Durable Objects for persistent, distributed error tracking:

```typescript
export class ErrorTrackerDO {
  private tracker: ErrorTracker;
  
  constructor(state: DurableObjectState) {
    this.tracker = new ErrorTracker();
    // Load persisted state
  }
  
  async track(error: Error, context?: any) {
    const record = this.tracker.track(error, context);
    // Persist to storage
    return record;
  }
}
```

### Workers KV

Store error summaries and documentation cache in KV:

```typescript
// Store error counts
await env.ERROR_KV.put(fingerprint, JSON.stringify(record));

// Cache documentation
await env.DOC_CACHE_KV.put(fingerprint, JSON.stringify(docs), {
  expirationTtl: 3600
});
```

### Analytics Integration

Forward error data to analytics platforms:
- Cloudflare Analytics Engine
- Sentry
- DataDog
- Custom analytics

### Alerting

Set up alerts for frequent errors:
```typescript
if (record.count >= threshold) {
  await sendAlert({
    type: 'frequent-error',
    message: record.message,
    count: record.count
  });
}
```

## Benefits

1. **Faster Debugging**: Automatic documentation links reduce time to resolution
2. **Visibility**: Centralized error tracking and reporting
3. **Proactive Monitoring**: Identify recurring issues before they become critical
4. **Knowledge Base**: Documentation cache builds institutional knowledge
5. **Context Awareness**: Error context helps understand root causes

## Future Enhancements

Potential improvements:
- Machine learning for better documentation relevance
- Integration with GitHub issues for automatic bug creation
- Error trend analysis and prediction
- Custom documentation source plugins
- Slack/email notifications for frequent errors
- Error recovery suggestions based on similar past errors

## References

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [MDN Web Docs](https://developer.mozilla.org/)
