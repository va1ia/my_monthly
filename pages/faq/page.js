// 目录：1. 完整 FAQ 2. Contact 入口
import { renderFAQ } from '../../components/faq/faq.js';
export function renderFAQPage() {
  return `${renderFAQ({ variant: 'full' })}<div class="contact-faq__inner full-faq__contact"><p class="text-larger">Have questions we haven’t answered yet? <a href="./contact.html">Contact us</a>, we’d love to help :)</p></div>`;
}
