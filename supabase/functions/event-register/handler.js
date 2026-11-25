// 目录：1. 有界 JSON 读取 2. 活动与字段验证 3. 持久化及错误状态
export async function handleEventRegistration(req, save) {
  const reply = (status, ok = false) => Response.json({ ok }, { status });
  if (req.method !== 'POST') return reply(405);
  if (!req.headers.get('content-type')?.startsWith('application/json')) return reply(415);
  try {
    const reader = req.body?.getReader();
    if (!reader) return reply(400);
    const chunks = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 4096) { await reader.cancel(); return reply(413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let data;
    try { data = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply(400); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400);
    const fields = ['name', 'role', 'email', 'social', 'event', 'submissionId'];
    if (fields.some(key => typeof data[key] !== 'string')) return reply(400);
    const clean = Object.fromEntries(fields.map(key => [key, data[key].trim()]));
    if (data.website !== undefined && data.website !== '') return reply(400);
    if (data.contactConsent !== true || clean.event !== 'the-state-of-the-period') return reply(400);
    if (!clean.name || clean.name.length > 120 || !clean.social || clean.social.length > 500) return reply(400);
    if (!['Investor', 'Founder', 'Influencer', 'Other'].includes(clean.role)) return reply(400);
    clean.email = clean.email.toLowerCase();
    if (clean.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) return reply(400);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(clean.submissionId)) return reply(400);
    await save({ ...clean, contactConsent: true });
    return reply(200, true);
  } catch { return reply(503); }
}
