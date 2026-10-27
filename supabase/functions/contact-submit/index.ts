// 目录：1. Publishable key 认证 2. 幂等写入 3. 来源与 CORS
import { withSupabase } from 'npm:@supabase/server@1';
import { handleContact } from './handler.js';
const handler = withSupabase({ auth: 'publishable' }, async (req, ctx) => {
  return handleContact(req, async data => {
    const { error } = await ctx.supabaseAdmin.from('contact_submissions').upsert({
      submission_id: data.submissionId, first_name: data.firstName, last_name: data.lastName,
      email: data.email, question_type: data.questionType, message: data.message, source: 'website-contact'
    }, { onConflict: 'submission_id', ignoreDuplicates: true });
    if (error) throw new Error('Could not save contact submission');
  });
});
Deno.serve(async req => {
  const origin = req.headers.get('origin') || '';
  const allowed = (Deno.env.get('CONTACT_ALLOWED_ORIGINS') || 'http://127.0.0.1:4173,http://localhost:4173,https://va1ia.github.io,https://mymonthly.io').split(',').map(s => s.trim());
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
