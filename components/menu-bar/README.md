# Menu bar

## 目录
- 文件与素材
- 接入接口
- 行为与适配
- 修改位置

## 文件与素材
menu-bar.js 管理结构和交互；menu-bar.css 管理显示。hamburger-img.svg 是底部装饰，hamburger-focus.svg 是当前页面装饰，均使用用户上传原文件。目录由 `menu bar` 规范化为 `menu-bar`。

## 接入接口
```js
import { mountMenuBar } from './components/menu-bar/menu-bar.js';
const menu = mountMenuBar(document.querySelector('#site-header'), {
  items: navigation.items,
  currentPage: 'download',
  homeHref: './'
});
menu.setCurrentPage('about');
// 卸载时：menu.destroy();
```
样式随 styles/shared.css 加载。宿主 `#site-header` 必须是 body 的直接子元素，以便打开菜单时安全地隔离背景。每页只挂载一份。

## 行为与适配
- 992px 起显示桌面导航；窄屏使用原生 button 展开全屏导航。
- 三条横线旋转 90° 成竖线；装饰图贴在 100dvh 面板的底边，不随菜单文字滚动。
- 当前页由 currentPage 指定，写入 aria-current，桌面仅保留下划线，手机保留下划线和轻微浮动装饰。Home 不属于五个菜单项时不强行标记 Download。
- 手机面板从上向下滑入、从下向上滑出（360ms）；关闭时立即禁止面板交互。
- 短屏允许文字滚动并降低插画透明度；插画不拦截点击。
- 锁定背景滚动并设置 inert；支持 Escape、Tab 循环，关闭时恢复滚动位置与按钮焦点。
- 切换为桌面布局自动关闭菜单；减少动画偏好下禁用动画。

- 桌面 Download 按钮使用左侧圆块从 1 倍放大至 7 倍的 300ms 过渡（参考原站 outQuad）；移出收回，键盘聚焦同样呈现，减少动画偏好下即时切换。底色 lighter-sunset，扩散色 sunset-blush，直接使用现有色板。

## 修改位置
导航项目与链接：content/shared/navigation.json。颜色与字体：styles/foundations/tokens.css。页面正式接入时显式传入 currentPage，避免依赖链接文本判断。
