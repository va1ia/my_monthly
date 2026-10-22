// 目录：1. 安全文本 2. 链接属性
export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
export function linkAttributes(item) {
  const url = new URL(item.href, location.href);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported link protocol');
  return `href="${escapeHTML(item.href)}"${item.external ? ' target="_blank" rel="noopener noreferrer"' : ''}`;
}
