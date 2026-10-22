// 目录：1. 方法与输入校验 2. 写入与通用响应
export async function handleSubscription(req, save) {
  const reply = (status, ok = false) => Response.json({ ok }, { status });
  if (req.method !== 'POST') return reply(405);
  if (!req.headers.get('content-type')?.startsWith('application/json')) return reply(415);
  try {
    // 流式读取限制请求大小，避免仅信任 Content-Length。
    const reader = req.body?.getReader();
    if (!reader) return reply(400);
    const chunks = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 2048) { await reader.cancel(); return reply(413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let data;
    try { data = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply(400); }
    if (typeof data?.email !== 'string') return reply(400);
    const email = data.email.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(400);
    await save(email);
    return reply(200, true);
  } catch { return reply(503); }
}
