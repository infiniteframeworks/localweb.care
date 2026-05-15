function buildEmailHtml(sections) {
  const rows = sections.map(section => {
    const qs = section.questions.map(q => {
      const answer = (q.answer || '').trim() || '<em style="color:#999">No response</em>';
      return `
        <tr>
          <td style="padding:8px 12px;color:#555;font-size:13px;vertical-align:top;width:40%;border-bottom:1px solid #f0f0f0">${q.text}</td>
          <td style="padding:8px 12px;font-size:14px;vertical-align:top;border-bottom:1px solid #f0f0f0;white-space:pre-wrap">${answer}</td>
        </tr>`;
    }).join('');
    return `
      <tr><td colspan="2" style="padding:20px 12px 6px;font-weight:600;font-size:15px;color:#111;border-top:2px solid #e5e5e5">${section.title}</td></tr>
      ${qs}`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9f9f9">
  <div style="max-width:700px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
    <div style="background:#111;padding:24px 32px">
      <p style="margin:0;color:#fff;font-size:20px;font-weight:600">New Onboarding Questionnaire</p>
      <p style="margin:6px 0 0;color:#aaa;font-size:13px">Submitted via localweb.care</p>
    </div>
    <table style="width:100%;border-collapse:collapse">
      ${rows}
    </table>
    <div style="padding:20px 32px;color:#999;font-size:12px;border-top:1px solid #eee">
      Submitted ${new Date().toUTCString()}
    </div>
  </div>
</body>
</html>`;
}

function buildEmailText(sections) {
  return sections.map(section => {
    const qs = section.questions.map(q => {
      const answer = (q.answer || '').trim() || '(no response)';
      return `  ${q.text}\n  ${answer}`;
    }).join('\n\n');
    return `=== ${section.title} ===\n\n${qs}`;
  }).join('\n\n');
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/submit') {
      return env.ASSETS.fetch(request);
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { sections } = body;
    if (!Array.isArray(sections) || sections.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing sections' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL ?? 'onboarding@contact.localweb.care',
        to: [env.TO_EMAIL ?? 'james.smits@gmail.com'],
        subject: 'New Discovery Questionnaire Submission',
        html: buildEmailHtml(sections),
        text: buildEmailText(sections),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error', res.status, err);
      return new Response(JSON.stringify({ error: 'Failed to send email', detail: err, status: res.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
