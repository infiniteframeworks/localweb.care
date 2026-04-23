/**
 * localweb.care — Cloudflare Pages Worker  (_worker.js)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * HOW THIS FILE WORKS WITH CLOUDFLARE
 * ─────────────────────────────────────
 * When you deploy to Cloudflare Pages, placing _worker.js at the project root
 * enables "Advanced mode" — your own Worker script handles every request to
 * the site instead of the default Pages router.
 *
 *   env.ASSETS  → KV binding Cloudflare creates automatically for your
 *                 static build output (_site/). Call env.ASSETS.fetch(request)
 *                 to serve any built file. If the asset doesn't exist it throws,
 *                 so catch and return a 404.
 *
 *   env.*       → Any bindings (KV, D1, R2, secrets, env vars) you add in the
 *                 Pages dashboard under Settings → Functions → Bindings are
 *                 injected here at runtime.
 *
 * DEPLOYMENT CHECKLIST
 * ─────────────────────
 *  1. Connect your GitHub repo to a Cloudflare Pages project.
 *  2. In Build settings:
 *       Build command:       npm run build
 *       Build output dir:    _site
 *  3. This file lives at the repo root — Cloudflare detects it automatically.
 *     No wrangler.toml is required for basic Pages deployments.
 *  4. Add the CONTACT_EMAIL secret in Pages → Settings → Environment Variables
 *     (mark it as "Secret" so it's encrypted at rest).
 *
 * CONTACT FORM EMAIL
 * ───────────────────
 * The /contact/submit handler below uses MailChannels, which is free for
 * Workers running on Cloudflare's network — no API key or account needed.
 * Reference: https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/
 *
 * Alternatives if MailChannels doesn't suit you:
 *   • Resend / SendGrid / Postmark → replace the fetch() call with their API
 *   • Cloudflare Email Workers → add an `email` binding in the Pages dashboard
 *   • Forward to a third-party form service (Formspree, etc.) from the client
 *
 * LOCAL DEVELOPMENT
 * ──────────────────
 * Cloudflare's Vite plugin or `wrangler pages dev` can emulate Pages Workers
 * locally, but for this Eleventy project the simplest dev flow is:
 *   1. npm start          → runs Eleventy's dev server (no Worker emulation)
 *   2. Test Worker logic by deploying a preview branch to Pages.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default {
  /**
   * @param {Request}          request
   * @param {object}           env  — Cloudflare bindings (ASSETS, secrets, KV…)
   * @param {ExecutionContext}  ctx  — ctx.waitUntil() / ctx.passThroughOnException()
   * @returns {Promise<Response>}
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ── CORS pre-flight ────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // ── Contact form endpoint ──────────────────────────────────────────────
    if (url.pathname === '/contact/submit' && request.method === 'POST') {
      return handleContactForm(request, env);
    }

    // ── Static assets (Eleventy build output) ─────────────────────────────
    // env.ASSETS is automatically bound to the contents of your _site/ folder.
    try {
      return await env.ASSETS.fetch(request);
    } catch {
      return new Response('Not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
};

/* ── Contact form handler ─────────────────────────────────────────────────── */

async function handleContactForm(request, env) {
  // Parse JSON body
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const { name, email, service, message } = body ?? {};

  // Basic validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return jsonResponse({ error: 'name, email, and message are required' }, 400);
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ error: 'Invalid email address' }, 400);
  }

  const toAddress = env.CONTACT_EMAIL ?? 'hello@localweb.care';

  // ── Send via MailChannels ────────────────────────────────────────────────
  // MailChannels is free for Cloudflare Workers — no account or API key needed.
  // To switch providers, replace this fetch() with your provider's REST call.
  const mailPayload = {
    personalizations: [{ to: [{ email: toAddress, name: 'localweb.care' }] }],
    from: { email: 'noreply@localweb.care', name: 'localweb.care Contact Form' },
    reply_to: { email, name },
    subject: `New enquiry from ${name}${service ? ` · ${service}` : ''}`,
    content: [
      {
        type: 'text/plain',
        value: [
          `Name:    ${name}`,
          `Email:   ${email}`,
          `Service: ${service || 'Not specified'}`,
          '',
          message,
        ].join('\n'),
      },
      {
        type: 'text/html',
        value: `
          <p><strong>Name:</strong> ${esc(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
          <p><strong>Service:</strong> ${esc(service || 'Not specified')}</p>
          <hr>
          <p style="white-space:pre-wrap">${esc(message)}</p>
        `.trim(),
      },
    ],
  };

  try {
    const mailRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mailPayload),
    });

    // MailChannels returns 202 on success
    if (mailRes.status !== 202 && !mailRes.ok) {
      const detail = await mailRes.text().catch(() => '');
      console.error('MailChannels error', mailRes.status, detail);
      return jsonResponse({ error: 'Failed to send message' }, 500);
    }
  } catch (err) {
    console.error('Network error sending email:', err);
    return jsonResponse({ error: 'Failed to send message' }, 500);
  }

  return jsonResponse({ ok: true });
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Minimal HTML escaping to prevent XSS in the HTML email body */
function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
