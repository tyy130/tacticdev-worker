import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('TacticDev marketing site worker', () => {
it('serves the marketing homepage with correct headers', async () => {
const request = new IncomingRequest('http://example.com');
const ctx = createExecutionContext();
const response = await worker.fetch(request, env, ctx);
await waitOnExecutionContext(ctx);

expect(response.status).toBe(200);
expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
const html = await response.text();
expect(html).toContain('Product teams that ship clean, modern software at founder speed.');
expect(html).toContain('Build momentum with an integrated product squad.');
expect(html).toContain('Tell us what you need to ship next.');
});

it('includes social media meta tags', async () => {
const request = new IncomingRequest('http://example.com');
const ctx = createExecutionContext();
const response = await worker.fetch(request, env, ctx);
await waitOnExecutionContext(ctx);

const html = await response.text();
expect(html).toContain('og:title');
expect(html).toContain('twitter:card');
expect(html).toContain('@tacticdev');
});

it('includes footer with social links', async () => {
const request = new IncomingRequest('http://example.com');
const ctx = createExecutionContext();
const response = await worker.fetch(request, env, ctx);
await waitOnExecutionContext(ctx);

const html = await response.text();
expect(html).toContain('About TacticDev');
expect(html).toContain('github.com/tyy130');
expect(html).toContain('linkedin.com/company/tacticdev');
expect(html).toContain('twitter.com/tacticdev');
expect(html).toContain('footer-container');
});

it('handles contact form submissions', async () => {
const form = new FormData();
form.set('name', 'Casey Founder');
form.set('email', 'casey@example.com');
form.set('message', 'We need a dashboard.');

const request = new IncomingRequest('http://example.com/contact', {
method: 'POST',
body: form
});

const response = await worker.fetch(request, env, createExecutionContext());
expect(response.status).toBe(200);
expect(await response.text()).toContain('Thanks');
});
});
