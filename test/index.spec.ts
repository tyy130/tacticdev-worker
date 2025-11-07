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
                expect(html).toContain('Loom Lang');
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

        it('handles HEAD requests', async () => {
                const request = new IncomingRequest('http://example.com', {
                        method: 'HEAD'
                });
                const ctx = createExecutionContext();
                const response = await worker.fetch(request, env, ctx);
                await waitOnExecutionContext(ctx);

                expect(response.status).toBe(200);
                expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
                const body = await response.text();
                expect(body).toBe('');
        });

        it('returns 404 for unsupported methods', async () => {
                const request = new IncomingRequest('http://example.com', {
                        method: 'PUT'
                });
                const ctx = createExecutionContext();
                const response = await worker.fetch(request, env, ctx);
                await waitOnExecutionContext(ctx);

                expect(response.status).toBe(404);
                expect(await response.text()).toBe('Not found');
        });

        describe('Contact form validation', () => {
                it('rejects contact form with missing name', async () => {
                        const form = new FormData();
                        form.set('email', 'casey@example.com');
                        form.set('message', 'We need a dashboard.');

                        const request = new IncomingRequest('http://example.com/contact', {
                                method: 'POST',
                                body: form
                        });

                        const response = await worker.fetch(request, env, createExecutionContext());
                        expect(response.status).toBe(422);
                        expect(await response.text()).toContain('Please complete all fields correctly');
                });

                it('rejects contact form with missing email', async () => {
                        const form = new FormData();
                        form.set('name', 'Casey Founder');
                        form.set('message', 'We need a dashboard.');

                        const request = new IncomingRequest('http://example.com/contact', {
                                method: 'POST',
                                body: form
                        });

                        const response = await worker.fetch(request, env, createExecutionContext());
                        expect(response.status).toBe(422);
                        expect(await response.text()).toContain('Please complete all fields correctly');
                });

                it('rejects contact form with missing message', async () => {
                        const form = new FormData();
                        form.set('name', 'Casey Founder');
                        form.set('email', 'casey@example.com');

                        const request = new IncomingRequest('http://example.com/contact', {
                                method: 'POST',
                                body: form
                        });

                        const response = await worker.fetch(request, env, createExecutionContext());
                        expect(response.status).toBe(422);
                        expect(await response.text()).toContain('Please complete all fields correctly');
                });

                it('rejects contact form with invalid email format', async () => {
                        const form = new FormData();
                        form.set('name', 'Casey Founder');
                        form.set('email', 'not-an-email');
                        form.set('message', 'We need a dashboard.');

                        const request = new IncomingRequest('http://example.com/contact', {
                                method: 'POST',
                                body: form
                        });

                        const response = await worker.fetch(request, env, createExecutionContext());
                        expect(response.status).toBe(422);
                        expect(await response.text()).toContain('Please complete all fields correctly');
                });

                it('rejects contact form with empty fields', async () => {
                        const form = new FormData();
                        form.set('name', '   ');
                        form.set('email', 'casey@example.com');
                        form.set('message', '   ');

                        const request = new IncomingRequest('http://example.com/contact', {
                                method: 'POST',
                                body: form
                        });

                        const response = await worker.fetch(request, env, createExecutionContext());
                        expect(response.status).toBe(422);
                        expect(await response.text()).toContain('Please complete all fields correctly');
                });

                it('detects honeypot spam and returns success without processing', async () => {
                        const form = new FormData();
                        form.set('name', 'Spammer');
                        form.set('email', 'spam@example.com');
                        form.set('message', 'This is spam');
                        form.set('hp_field', 'bot-filled-value');

                        const request = new IncomingRequest('http://example.com/contact', {
                                method: 'POST',
                                body: form
                        });

                        const response = await worker.fetch(request, env, createExecutionContext());
                        expect(response.status).toBe(200);
                        expect(await response.text()).toContain('Thanks');
                });

                it('rejects when form data is parsed but fields are missing', async () => {
                        // Even with non-standard encoding, formData() parsing usually succeeds
                        // but results in empty/missing fields, triggering validation error (422)
                        const request = new IncomingRequest('http://example.com/contact', {
                                method: 'POST',
                                headers: {
                                        'content-type': 'application/x-www-form-urlencoded'
                                },
                                body: 'invalid-form-data-without-proper-encoding'
                        });

                        const response = await worker.fetch(request, env, createExecutionContext());
                        expect(response.status).toBe(422);
                        expect(await response.text()).toContain('Please complete all fields correctly');
                });
        });

        it('returns 404 for invalid loom-lang download paths', async () => {
                const request = new IncomingRequest('http://example.com/downloads/loom-lang/invalid-file');
                const response = await worker.fetch(request, env, createExecutionContext());
                expect(response.status).toBe(404);
        });
});
