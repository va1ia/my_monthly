// 目录：1. 文案加载 2. 文档和全站组件挂载 3. 加载失败提示
import { mountMenuBar } from '../../components/menu-bar/menu-bar.js';
import { mountFooter } from '../../components/footer/footer.js';
import { renderLegalDocument } from '../../components/legal-document/legal-document.js';
import { createNewsletterSubscriber } from './newsletter.js';

async function readJSON(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

export async function mountLegalPage(page) {
  const main = document.querySelector('#main');
  try {
    const [content, navigation, newsletter] = await Promise.all([
      readJSON(`../../content/${page}/page.json`),
      readJSON('../../content/shared/navigation.json'),
      readJSON('../../content/shared/newsletter.json').catch(() => ({ enabled: false }))
    ]);
    main.innerHTML = renderLegalDocument(content);
    mountMenuBar(document.querySelector('#site-header'), { items: navigation.items });
    mountFooter(document.querySelector('#site-footer'), { ...navigation, subscribe: createNewsletterSubscriber(newsletter) });
  } catch {
    main.innerHTML = '<div class="legal-document"><h1>Unable to load this document</h1><p>Please reload this page or contact <a href="mailto:support@mymonthly.co">support@mymonthly.co</a>.</p></div>';
  }
}
