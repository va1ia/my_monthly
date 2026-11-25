// 目录：1. 安全行内格式 2. 表格段落与列表 3. 文档结构
import { escapeHTML } from '../../scripts/shared/dom.js';

function inline(text) {
  let html = escapeHTML(text);
  html = html.replace(/^(\d+[AB]?[.:] [^:]+:)/, '<strong>$1</strong>');
  html = html.replace(/Privacy Policy(?=\.$)/, '<a href="./privacy-policy.html">Privacy Policy</a>');
  return html.replace(/support@mymonthly\.co/g, '<a href="mailto:support@mymonthly.co">support@mymonthly.co</a>');
}

export function renderLegalDocument({ title, updated, body }) {
  const blocks = body.replace(/\u200d/g, '').trim().split(/\n\s*\n/).map(block => {
    const lines = block.trim().split('\n');
    const listStart = lines.findIndex(line => /^(?:[a-z]|i{1,3}|iv)\. /.test(line));
    if (listStart !== -1) {
      const intro = lines.slice(0, listStart).map(inline).join('<br>');
      const items = lines.slice(listStart).map(line => `<li>${inline(line)}</li>`).join('');
      return `${intro ? `<p>${intro}</p>` : ''}<ol class="legal-document__list">${items}</ol>`;
    }
    if (/^\d+\. [^:]+$/.test(block.trim())) return `<h2>${escapeHTML(block.trim())}</h2>`;
    return `<p>${lines.map(inline).join('<br>')}</p>`;
  }).join('');
  return `<article class="legal-document" aria-labelledby="legal-title"><header class="legal-document__header"><h1 id="legal-title">${escapeHTML(title)}</h1><p class="legal-document__updated text-small">${escapeHTML(updated)}</p></header><div class="legal-document__body">${blocks}</div></article>`;
}
