// 目录：1. 原站 HTML 快照 2. 卡片渲染 3. 分区结构
import { escapeHTML } from '../../../../scripts/shared/dom.js';
const asset = name => new URL(`../../../../assets/images/home/user-comments/${name}`, import.meta.url).href;

// 原站的六条唯一评论；Google Sheet 接入后覆盖此初始 HTML。
const snapshot = [
  ['5 stars!', 'Dec 26', 5, 'Love this! My girlfriend and I have this and we love the layout, it’s ease of use and some of the additional features like to do tasks and mood logging.'],
  ['Highly recommend', 'Dec 26', 5, 'Incredible app design, function and utility. Using it with my partner and would recommend to all couples!'],
  ['First ever?!?', 'Jan 3', 5, "The first ever period tracking app for couples is a wonderful concept and I'm so glad I get to use it here first!! The little mood characters are so fun as well, definitely a little serotonin boost when logging in your mood. All the best :)"],
  ['Amazing!', 'Apr 28', 5, 'All I needed!!! It’s a great app, I believe everyone needs this! It’s helped me be more aware and understanding of what’s happening to my body.'],
  ['My Monthly is THE period tracker app', 'May 14', 5, 'I love this app!! Learning so much from the daily quizzes and love the partner feature option.'],
  ['everything i was looking for from a relationship app', 'Jun 19', 5, 'this app has genuinely changed my relationship for the better!']
].map(([title, date, rating, body]) => ({ title, date, rating, body }));

export function renderCommentCards(items) {
  return items.map(item => `<li class="home-comments__card${item.title.length + item.body.length <= 200 ? ' home-comments__card--short' : ''}">
    <h3 class="home-comments__card-title">${escapeHTML(item.title)}</h3>
    <div class="home-comments__meta"><span class="home-comments__stars" role="img" aria-label="${item.rating} out of 5 stars"><span aria-hidden="true">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</span></span><span class="home-comments__date">${escapeHTML(item.date)}</span></div>
    <p class="home-comments__body">${escapeHTML(item.body)}</p>
  </li>`).join('');
}

export function renderAccessibleComments(items) {
  return items.map(item => `<li>${escapeHTML(item.title)}. ${item.rating} out of 5 stars. ${escapeHTML(item.date)}. ${escapeHTML(item.body)}</li>`).join('');
}

export function renderUserComments() {
  return `<section class="home-comments" aria-labelledby="comments-title">
    <h2 class="visually-hidden" id="comments-title">From Our Community, With Love</h2>
    <picture class="home-comments__pattern" aria-hidden="true">
      <source media="(max-width: 767px)" srcset="${asset('bg-pattern-phone.svg')}">
      <img src="${asset('bg-pattern-pc.svg')}" width="1721" height="1499" alt="" loading="lazy">
    </picture>
    <img class="home-comments__phone" src="${asset('phone.svg')}" width="477" height="951" alt="" loading="lazy">
    <div class="home-comments__track" aria-hidden="true"><ul class="home-comments__group">${renderCommentCards(snapshot)}</ul></div>
    <ul class="visually-hidden" data-comments-accessible aria-label="Community reviews">${renderAccessibleComments(snapshot)}</ul>
  </section>`;
}
