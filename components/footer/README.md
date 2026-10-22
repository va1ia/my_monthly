# Footer

## 目录
- 文件与布局
- 接入接口
- 背景变体
- 订阅接口

## 文件与布局
footer.js 管理结构和接口，footer.css 管理样式。桌面为订阅/Logo、页面链接、法律/社交三列；手机为居中订阅区和下方两列，隐藏大 Logo。社交图标复用 assets/icons/ 原文件，通过 mask 继承各版本前景色。

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
未传 subscribe 时仅显示尚未连接服务的提示，不发送、不存储邮箱，不伪造订阅成功。提供适配器后使用浏览器邮箱校验，等待期间禁用提交，成功/失败通过 aria-live 公告。适配器需以真实服务的确认结果 resolve/reject，并可使用传入的 AbortSignal。后端验证、限流和服务凭据应在实际接入时配置。

Supabase 订阅接口已部署并通过本地预览真实提交验证，GitHub Pages 公开网页也已验证通过；接入步骤见 [部署说明](../../docs/newsletter.md)。
