// 目录：1. 表单结构 2. 隐藏标签和提交状态
import { escapeHTML } from '../../../../scripts/shared/dom.js';
const asset = name => new URL(`../../../../assets/images/contact/form/${name}.svg`, import.meta.url).href;
export function renderContactForm(content) {
  return `<section class="contact-form" aria-labelledby="contact-title">
    <picture class="contact-form__pattern" aria-hidden="true"><source media="(max-width: 767px)" srcset="${asset('bg-pattern-phone')}"><img src="${asset('bg-pattern-pc')}" alt="" loading="lazy"></picture>
    <div class="contact-form__panel"><div class="contact-form__intro"><h1 id="contact-title">${escapeHTML(content.title)}</h1><p>${escapeHTML(content.description)}</p></div>
      <div class="contact-form__body"><form class="contact-form__fields" aria-label="Website Contact Form">
        <label class="contact-form__field contact-form__field--first"><span class="contact-form__label">First Name</span><input name="firstName" autocomplete="given-name" placeholder="First Name" maxlength="256" required></label>
        <label class="contact-form__field contact-form__field--last"><span class="contact-form__label">Last Name</span><input name="lastName" autocomplete="family-name" placeholder="Last Name" maxlength="256" required></label>
        <label class="contact-form__field"><span class="contact-form__label">Email Address</span><input type="email" name="email" autocomplete="email" placeholder="Email Address" maxlength="254" required></label>
        <label class="contact-form__field contact-form__field--select"><span class="contact-form__label">Type of Question (optional)</span><select name="questionType"><option value="">Select Type of Question</option>${content.types.map(type => `<option value="${escapeHTML(type.value)}">${escapeHTML(type.label)}</option>`).join('')}</select></label>
        <label class="contact-form__field"><span class="contact-form__label">Your Message</span><textarea name="message" placeholder="Type Your Message..." maxlength="5000" required></textarea></label>
        <div class="contact-form__trap" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
        <button class="contact-form__submit" type="submit">Get In Touch</button>
      </form><p class="contact-form__status" role="status" aria-live="polite" tabindex="-1"></p></div>
    </div>
  </section>`;
}
