export interface Env {
  ASSETS: R2Bucket;
  BUCKET_PREFIX: string; // "tacticdev_site"
}

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const ext = (p: string) => (p.match(/\.[a-z0-9]+$/i)?.[0] || "").toLowerCase();
const join = (prefix: string, key: string) =>
  `${prefix.replace(/\/+$/,"")}/${key.replace(/^\/+/,"")}`;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    // Optional: redirect www → apex
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.replace(/^www\./, "");
      return Response.redirect(url.toString(), 301);
    }

    // Contact form endpoint
    if (req.method === "POST" && url.pathname === "/contact") {
      return handleContact(req);
    }

    // Static files from R2
    let key = url.pathname;
    if (key === "/") key = "/index.html";
    if (key.endsWith("/")) key += "index.html";
    if (key.includes("..")) return new Response("Not found", { status: 404 });

    const r2Key = join(env.BUCKET_PREFIX, key);
    let obj = await env.ASSETS.get(r2Key);

    // Pretty-route fallback → index.html
    if (!obj && !ext(key)) {
      obj = await env.ASSETS.get(join(env.BUCKET_PREFIX, "/index.html"));
    }
    if (!obj) return new Response("Not found", { status: 404 });

    const type = TYPES[ext(key)] || "application/octet-stream";
    const headers = new Headers({
      "Content-Type": type,
      "Cache-Control": type.includes("text/html")
        ? "public, max-age=60, must-revalidate"
        : "public, max-age=31536000, immutable",
      "ETag": obj.httpEtag
    });

    return new Response(obj.body, { status: 200, headers });
  }
};

async function handleContact(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return new Response("Bad Request", { status: 400 });

  // Honeypot
  if ((form.get("hp_field") as string) || "") {
    return new Response("OK", { status: 200 });
  }

  const name = (form.get("name") as string || "").trim();
  const email = (form.get("email") as string || "").trim();
  const message = (form.get("message") as string || "").trim();

  if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return new Response("Please fill out all fields correctly.", { status: 422 });
  }

  // Send via MailChannels (no extra key)
  const mail = {
    personalizations: [{ to: [{ email: "hello@tacticdev.com" }] }],
    from: { email: "noreply@tacticdev.com", name: "TacticDev Site" },
    subject: "New Inquiry — TacticDev",
    content: [{ type: "text/plain", value: `Name: ${name}\nEmail: ${email}\n\n${message}` }],
    reply_to: { email, name }
  };

  const r = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(mail)
  });

  if (!r.ok) {
    const t = await r.text().catch(() => "");
    return new Response("Could not send email. Try again later.\n" + t, { status: 500 });
  }
  return new Response("Thanks — we will reply shortly.", { status: 200 });
}
