// 目录：1. 公开 key 认证与独立报名写入 2. 来源与 CORS
import { withSupabase } from 'npm:@supabase/server@1';
import { handleEventRegistration } from './handler.js';
const handler = withSupabase({ auth: 'publishable' }, async (req, ctx) => {
  return handleEventRegistration(req, async data => {
    const { error } = await ctx.supabaseAdmin.from('event_registrations').upsert({
      submission_id: data.submissionId, event_slug: data.event, name: data.name,
      role: data.role, email: data.email, social: data.social, contact_consent: data.contactConsent,
      consent_version: '2026-11-24', source: 'website-event'
    }, { onConflict: 'event_slug,email', ignoreDuplicates: true });
    if (error) throw new Error('Could not save event registration');
  });
});
Deno.serve(async req => {
  const origin = req.headers.get('origin') || '';
  const allowed = (Deno.env.get('EVENT_ALLOWED_ORIGINS') || 'http://127.0.0.1:4173,http://localhost:4173,http://127.0.0.1:4175,http://localhost:4175,https://va1ia.github.io,https://mymonthly.io,https://www.mymonthly.io').split(',').map(s => s.trim());
  if (!allowed.includes(origin)) return new Response('Origin not allowed', { status: 403 });
  const headers = {
    'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'content-type, apikey',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin'
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  let result;
  try { result = await handler(req); } catch { result = Response.json({ ok: false }, { status: 500 }); }
  const response = new Response(result.body, result);
  for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
  return response;
});
