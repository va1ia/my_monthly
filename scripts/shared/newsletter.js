// 目录：1. Supabase 订阅适配器；仅确认服务成功后返回
export function createNewsletterSubscriber(config, request = fetch) {
  if (!config.enabled) return undefined;
  return async (email, { signal } = {}) => {
    const response = await request(`${config.url}/functions/v1/newsletter-subscribe`, {
      method: 'POST', signal: AbortSignal.any([AbortSignal.timeout(15000), ...(signal ? [signal] : [])]),
      headers: { 'Content-Type': 'application/json', apikey: config.publishableKey },
      body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Newsletter subscription failed');
  };
}
