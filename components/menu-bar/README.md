# Menu bar

## 目录
- 文件与素材
- 接入接口
- 行为与适配
- 修改位置

## 文件与素材
普通链接与桌面 Download 共用 --text-small（默认 14px），手机版大菜单保持原构图字号。

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
- 胶囊背景按原站截图使用 darker-green 约 94.9% 不透明度（#2c5d3df2）和 3px backdrop blur，同时声明 Safari 前缀。模糊放在独立伪元素背景层，避免使手机 fixed 全屏面板受胶囊尺寸限制；不支持 backdrop-filter 时回退为实色背景。全屏面板仍使用实色绿色。已在本地浏览器确认背景 alpha 为 0.949、blur 为 3px；402px 手机面板仍覆盖 402×900 视口，Escape 正常关闭且无横向溢出。
- 992px 起显示桌面导航；窄屏使用原生 button 展开全屏导航。
- 底部插画按面板 100% 宽度显示，取消 max-height 限制与 contain 造成的两侧留白；包括短屏也保持全宽，避免 Safari 因高度钳制而缩窄插画绘制内容。三条横线打开时用 300ms 逆时针旋转 90° 成竖线，关闭时顺时针回转；装饰图贴在 100dvh 面板的底边，不随菜单文字滚动。
- 当前页由 currentPage 指定，写入 aria-current，桌面普通导航保留当前页下划线，手机所有选项均无下划线，并保留轻微浮动装饰。Home 不属于五个菜单项时不强行标记 Download。
- 手机面板用 translate3d 从上向下滑入、从下向上滑出（360ms），完成滑出后才隐藏；关闭时立即禁止面板交互。触屏打开不自动聚焦屏外链接，避免浏览器焦点滚动干扰滑入；键盘打开保留当前页链接聚焦，Escape 关闭恢复按钮焦点。
- 短屏允许文字滚动并降低插画透明度；插画不拦截点击。列表滚动框顶部上移 30px，顶部内边距相应增加 30px，保持文字位置并给选中装饰四球留足空间，避免 Newsletter 右上球被裁。
- 锁定背景滚动并设置 inert；支持 Escape、Tab 循环，关闭时恢复滚动位置与按钮焦点。
- 切换为桌面布局自动关闭菜单；减少动画偏好下禁用动画。
- 手机按钮与导航链接禁用 WebKit 点按高亮；按钮重置原生 appearance，触屏普通焦点不画外框，键盘 focus-visible 仍有焦点提示。

- 桌面 Download 按钮使用左侧圆块从 1 倍放大至 9 倍的 300ms 过渡（参考原站 outQuad）；移出收回，键盘聚焦同样呈现，减少动画偏好下即时切换。桌面按钮无下划线，字号 13px、字重 600（其他导航为 14px）。底色 lighter-sunset，扩散色 sunset-blush，直接使用现有色板。

- 桌面普通导航悬停或键盘聚焦时，下划线以 180ms 从左向右展开；不使用缩放。Download 不显示下划线，桌面使用圆形扩散。Footer 的中心缩放逻辑独立维护。

本轮手机菜单的触屏、键盘和中间动画帧验证见 [手机兼容验证](../../docs/hero-verification.md#手机菜单与自动滚动兼容修复2026-11-25)；实体 iOS Safari 尚未验证。

## 修改位置
导航项目与链接：content/shared/navigation.json。颜色与字体：styles/foundations/tokens.css。页面正式接入时显式传入 currentPage，避免依赖链接文本判断。

顶部菜单支持 navigation.json 项目的 hiddenInMenu: true；About / Event / Shop 暂时隐藏，桌面和手机均不渲染，不进入键盘焦点。Footer 页面列表使用相同规则同步过滤；当前显示 Newsletter / Contact / Download。Newsletter 保留 news 标识和 press.html 地址，方便现有当前页状态继续工作；恢复隐藏页面时删除该字段或设为 false。
