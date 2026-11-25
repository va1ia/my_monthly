# Footer

## 目录
- 文件与布局
- 默认 Pre-footer 规则
- 接入接口
- 背景变体
- 手机页面画布
- 订阅接口

## 文件与布局
导航、法律链接和输入框复用 --text-small；状态与版权辅助字复用 --text-caption（默认 12px），手机版导航同样使用辅助字。背景变体规则保持原接口。

版权行保留正常文档流，无垂直位移；与主体间距桌面 80px、手机 64px，字号统一为 12px，使版权更靠上且更易读。

底部留白为桌面 80px、手机 64px，另叠加设备底部安全区域。

footer.js 管理结构和接口，footer.css 管理样式。桌面为订阅/Logo、页面链接、法律/社交三列；手机为居中订阅区和下方两列，隐藏大 Logo。社交图标复用 assets/icons/ 原文件，通过 mask 继承各版本前景色。社交图标整组在当前 -4px 基础上再左移 4px，合计 -8px 作视觉对齐；悬停时图标以 180ms 过渡放大至 1.1 倍，点击区域不变，减少动画偏好下取消过渡。

页面链接与顶部菜单使用同一份 navigation.json，默认按 hiddenInMenu 过滤；showInFooter: true 可让隐藏于顶部菜单的项目仅显示在 Footer。目前 Footer 依次显示 Newsletter、Contact、Download、State of Period，最后一项进入现有活动详情页，沿用同一链接样式与交互。About / Event / Shop 暂时隐藏；法律链接由 legal 列表独立维护，指向新版 terms-of-service.html 与 privacy-policy.html。

页面导航和法律链接统一使用 400 字重；不显示下划线，悬停时以元素正中心为原点，在 180ms 内放大至 1.1 倍，移出还原。键盘焦点保留外框，减少动画偏好下即时切换。

## 默认 Pre-footer 规则
共享 Footer 默认在自身前方挂载一份 Pre-footer，结构位于同一 host 中。普通品牌页面不需要单独渲染或调用 mountPreFooter；当前 Home、Contact、Download、Shop 已统一使用此入口。991px 以下采用纵向三卡，按接近视口与可见性加载 / 播放动画。

page-policy.js 为唯一判定入口：

- 普通页面默认启用，pageType 默认 auto。
- event.html / events.html、article.html / articles.html 及 event/、events/、article/、articles/ 路径段自动排除，兼容站点子目录部署。
- 自定义 URL 的活动 / 文章页必须传 pageType:'event' / 'article'；活动索引入口也显式声明，避免改路由后误加。
- preFooter:false 只用于组件预览等技术页面或显式不挂载的调用；不能用 preFooter:true 绕过文章 / 活动排除。
- Ambassador Program 按本页 Figma 使用 Perks / 人物专属结尾，显式关闭通用 Pre-footer，继续复用本 Footer 与订阅服务。
- pre-footer-preview.html 已手动挂载供测试，因此关闭 Footer 自动挂载；component-preview.html 只测试 Footer 变体，也显式关闭。

Footer 的 destroy() 同时销毁自动挂载的 Pre-footer（视频、观察器及鼠标监听），然后清空 host。订阅状态始终限定在 .site-footer 内，避免与 Pre-footer 的状态提示混用。

策略验证：`node components/footer/page-policy.test.mjs`。

## 接入接口
```js
import { mountFooter } from './components/footer/footer.js';
const footer = mountFooter(document.querySelector('#site-footer'), {
  ...navigation,
  variant: 'brand',
  // pageType: 'article' / 'event'，内容页须声明；普通页面省略即可。
  // subscribe: async (email, { signal }) => { /* 等待真实服务成功，否则抛错 */ }
});
footer.setVariant('light');
// 卸载时：footer.destroy();
```
样式随 styles/shared.css 加载。year 可选，默认浏览器当前年份。

## 背景变体
- brand（默认）：参考站绿色背景，米色 Logo。
- dark：菜单深绿背景，米色 Logo。
- light：浅米色背景，绿色 Logo。
- period：The State of the Period 活动页深红背景，浅色 Logo；颜色引用全站 tokens 中的 period 局部变量。顶部两个角按原站使用 24px 圆角，底部保持直角，桌面 / 手机一致。

`homeHref` 可选（默认 `./`），用于嵌套活动页和文章页正确返回站点首页。调用方同步将 navigation.json 的相对链接解析为项目根路径。

切换接口同步更新颜色与 Logo。新增背景时同步 JS 允许值、CSS 变量映射和本说明。

## 手机页面画布
mountFooter 同时挂载 scripts/shared/mobile-page-canvas.js，仅 ≤767px 在 html 上设置 --mobile-page-background：默认匹配当前首屏 / 分区底色，Footer 进入视窗后匹配其实际背景，菜单打开时匹配面板。监听滚动、visualViewport、页面恢复、内容高度与 Footer 变体，覆盖 Safari 页面回弹 / 视口外的白色或 beige 底色。body 的 Q&A 换色与分区背景不变；桌面移除变量，destroy 清理监听 / 观察器并恢复原值。活动页 period 变体仍使用自身深棕色，不强制改成品牌绿。

## 订阅接口
提交状态复用 scripts/shared/newsletter.js 的 mountNewsletterForm，与 Press 保持各自原有成功文案；防止重复提交，每份表单独立锁定。Footer 的取消信号继续用于组件卸载时清理监听与请求，等待时同步设置 aria-busy。

输入框聚焦时不显示外框或阴影；键盘聚焦通过加粗表单底线提示，提交按钮保留焦点外框。
未传 subscribe 时仅显示尚未连接服务的提示，不发送、不存储邮箱，不伪造订阅成功。提供适配器后使用浏览器邮箱校验，等待期间禁用提交，成功/失败通过 aria-live 公告。适配器需以真实服务的确认结果 resolve/reject，并可使用传入的 AbortSignal。后端验证、限流和服务凭据应在实际接入时配置。

Supabase 订阅接口已部署并通过本地预览真实提交验证，GitHub Pages 公开网页也已验证通过；接入步骤见 [部署说明](../../docs/newsletter.md)。

手机画布验证：Chrome / WebKit、390×844，首页、Contact、Download、Newsletter、Ambassador、FAQ、两页法律、Shop、活动索引及活动详情共 11 个入口。顶部画布匹配各页首屏，底部匹配实际 Footer（品牌绿或活动深棕），菜单打开时匹配面板；Footer 底边与视口底边误差 <1px，未记录 JavaScript 错误。切回 1440px 后移除手机画布变量。此为本机浏览器模拟，不等同实体 iPhone 回弹测试。
