// 目录：1. 普通页面默认值 2. 文章 / 活动排除 3. 显式类型及预览开关
import assert from 'node:assert/strict';
import { shouldShowPreFooter } from './page-policy.js';

for (const path of ['/', '/index.html', '/contact.html', '/download.html', '/shop.html', '/my_monthly/about.html', '/my_monthly/press/']) {
  assert.equal(shouldShowPreFooter({}, path), true, path);
}
for (const path of ['/event.html', '/article.html', '/events/', '/articles/', '/event/meetup/page.html', '/article/story/', '/my_monthly/event/spring/', '/my_monthly/article/story/page.html']) {
  assert.equal(shouldShowPreFooter({}, path), false, path);
}
assert.equal(shouldShowPreFooter({ pageType: 'event' }, '/custom-meetup.html'), false);
assert.equal(shouldShowPreFooter({ pageType: 'article' }, '/custom-story.html'), false);
assert.equal(shouldShowPreFooter({ preFooter: false }, '/component-preview.html'), false);
assert.equal(shouldShowPreFooter({ preFooter: true, pageType: 'event' }, '/custom-meetup.html'), false);
assert.throws(() => shouldShowPreFooter({ pageType: 'unknown' }, '/'), /Unknown footer page type/);
console.log('Pre-footer default and page exclusions passed.');
