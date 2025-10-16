import { renderHomepage } from './homepage';

export interface Env {
	ASSETS?: R2Bucket;
	BUCKET_PREFIX?: string; // "tacticdev_site"
}

const HOMEPAGE_HEADERS = Object.freeze({
	'content-type': 'text/html; charset=utf-8',
	'cache-control': 'no-store, max-age=0, must-revalidate',
});

const TYPES: Record<string, string> = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'application/javascript; charset=utf-8',
	'.mjs': 'application/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.ico': 'image/x-icon',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
};

const ext = (p: string) => (p.match(/\.[a-z0-9]+$/i)?.[0] || '').toLowerCase();
const join = (prefix: string, key: string) => `${prefix.replace(/\/+$/, '')}/${key.replace(/^\/+/, '')}`;

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		const url = new URL(req.url);

		// Optional: redirect www → apex
		if (url.hostname.startsWith('www.')) {
			url.hostname = url.hostname.replace(/^www\./, '');
			return Response.redirect(url.toString(), 301);
		}

		// Contact form endpoint
		if (req.method === 'POST' && url.pathname === '/contact') {
			return handleContact(req);
		}

		if ((req.method === 'GET' || req.method === 'HEAD') && isHomepagePath(url.pathname)) {
			const headers = new Headers(HOMEPAGE_HEADERS);
			if (req.method === 'HEAD') {
				return new Response(null, { status: 200, headers });
			}
			return new Response(renderHomepage(), { status: 200, headers });
		}

		// Static files from R2
		if (req.method === 'GET' || req.method === 'HEAD') {
			const assetResponse = await serveFromBucket(env, url.pathname, req.method === 'HEAD');
			if (assetResponse) {
				return assetResponse;
			}
		}

		return new Response('Not found', { status: 404 });
	},
};

async function handleContact(req: Request) {
	const form = await req.formData().catch(() => null);
	if (!form) {
		return new Response('Please complete all fields correctly.', { status: 400 });
	}

	const honeypot = ((form.get('hp_field') as string) || '').trim();
	if (honeypot) {
		return new Response('Thanks — we will reply shortly.', { status: 200 });
	}

	const name = ((form.get('name') as string) || '').trim();
	const email = ((form.get('email') as string) || '').trim();
	const message = ((form.get('message') as string) || '').trim();

	if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
		return new Response('Please complete all fields correctly.', { status: 422 });
	}

	return new Response('Thanks — we will reply shortly.', { status: 200 });
}

async function serveFromBucket(env: Env, pathname: string, headRequest: boolean): Promise<Response | null> {
	const bucket = env.ASSETS;
	const prefix = env.BUCKET_PREFIX;
	if (!bucket || !prefix) {
		return null;
	}

	let key = pathname || '/';
	if (key === '/') key = '/index.html';
	if (key.endsWith('/')) key += 'index.html';
	if (key.includes('..')) {
		return null;
	}

	const r2Key = join(prefix, key);
	let object = await bucket.get(r2Key);

	if (!object && !ext(key)) {
		object = await bucket.get(join(prefix, '/index.html'));
	}
	if (!object) {
		return null;
	}

	const type = TYPES[ext(key)] || 'application/octet-stream';
	const headers = new Headers({
		'Content-Type': type,
		'Cache-Control': type.includes('text/html') ? 'public, max-age=60, must-revalidate' : 'public, max-age=31536000, immutable',
	});
	if (object.httpEtag) {
		headers.set('ETag', object.httpEtag);
	}

	if (headRequest) {
		return new Response(null, { status: 200, headers });
	}

	return new Response(object.body, { status: 200, headers });
}

function isHomepagePath(pathname: string): boolean {
	return pathname === '/' || pathname === '' || pathname === '/index.html';
}
