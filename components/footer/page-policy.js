// 目录：1. 普通页面默认接入 2. 文章与活动路由排除
export function shouldShowPreFooter({ preFooter = true, pageType = 'auto' } = {}, pathname = '') {
  if (!['auto', 'brand', 'article', 'event'].includes(pageType)) throw new Error('Unknown footer page type');
  if (!preFooter || pageType === 'article' || pageType === 'event') return false;
  // 兼容仓库子路径、索引入口及 event/<slug>/、article/<slug>/ 独立页面。
  return !pathname.split('/').some(segment => /^(?:articles?|events?)(?:\.html)?$/i.test(segment));
}
