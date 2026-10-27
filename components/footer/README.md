# Footer

## 目录
- 文件与布局
- 接入接口
- 背景变体
- 订阅接口

## 文件与布局
版权行保留正常文档流，无垂直位移；与主体间距桌面 80px、手机 64px，字号分别为 12px / 11px，使版权更靠上且更易读。

底部留白为桌面 80px、手机 64px，另叠加设备底部安全区域。

footer.js 管理结构和接口，footer.css 管理样式。桌面为订阅/Logo、页面链接、法律/社交三列；手机为居中订阅区和下方两列，隐藏大 Logo。社交图标复用 assets/icons/ 原文件，通过 mask 继承各版本前景色。社交图标整组向左偏移 2px 作视觉对齐；悬停时图标以 180ms 过渡放大至 1.1 倍，点击区域不变，减少动画偏好下取消过渡。

页面导航和法律链接统一使用 400 字重；不显示下划线，悬停时以元素正中心为原点，在 180ms 内放大至 1.1 倍，移出还原。键盘焦点保留外框，减少动画偏好下即时切换。

## 接入接口
```js
import { mountFooter } from './components/footer/footer.js';
const footer = mountFooter(document.querySelector('#site-footer'), {
  ...navigation,
  variant: 'brand',
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

切换接口同步更新颜色与 Logo。新增背景时同步 JS 允许值、CSS 变量映射和本说明。

## 订阅接口
输入框聚焦时不显示外框或阴影；键盘聚焦通过加粗表单底线提示，提交按钮保留焦点外框。
未传 subscribe 时仅显示尚未连接服务的提示，不发送、不存储邮箱，不伪造订阅成功。提供适配器后使用浏览器邮箱校验，等待期间禁用提交，成功/失败通过 aria-live 公告。适配器需以真实服务的确认结果 resolve/reject，并可使用传入的 AbortSignal。后端验证、限流和服务凭据应在实际接入时配置。

Supabase 订阅接口已部署并通过本地预览真实提交验证，GitHub Pages 公开网页也已验证通过；接入步骤见 [部署说明](../../docs/newsletter.md)。
