# Download 首屏
## 目录
- 结构与素材
- 行为与验证
## 结构与素材
download.html 由 scripts/download/index.js 挂载本目录 hero.js、共享导航、FAQ 与 Footer。样式入口 styles/download/index.css。桌面左文右图，手机标题及 App Store 在上、双手机插画在下。使用上传的 717×602 与 402×542 SVG，规范命名副本在 assets/images/download/phones-desktop.svg 与 phones-mobile.svg；原文件保留。
复用首页 hero 的双端 pattern、App Store 徽章和下载链接；仅展示 iOS，不显示 Google Play 。整页底色由共享 scroll-background 控制，从 picnic-date 过渡到 darker-linen，与 Contact 同样在 FAQ inner 越过视口 65% 时触发，2000ms，上滚可恢复。截图里的旧 FAQ 文案不覆盖现有共享组件。
## 行为与验证
复用 shared/pointer-parallax.js，非手机精细鼠标平滑映射 X ±2vw、Y 0–4vw；手机及减少动画模式静止。App Store 链接有键盘焦点和首屏相同的悬停反馈。
页面尺寸按截图暂定，非最终品牌规范。浏览器已加载真实 FAQ 表格；检查桌面和手机构图、320/390/768/1024/1920 宽度溢出、图片、键盘展开 FAQ、背景视差及减少动画偏好，并回归 Contact FAQ。无自动提交表单。

Pattern 双端定位与首页一致：桌面顶部 3vw、图片等比自然高度及 1.05 缩放，不使用 cover 裁切；手机从顶端铺满。只使用已有素材。App Store 下展示 Ver 2.4.2，2026-10-27 核对 Apple 官方版本；配置在 content/download/page.js。

按用户红线收短桌面首屏至 56vw（600–968px），保持标题和手机的原有纵向位置；手机插画桌面宽度封顶 744px，避免超宽屏截断。Pattern 在桌面底部用透明遮罩轻微淡出，整页滚动换色继续由共享模块控制，不加入黑色渐变。手机布局保持。已检查 390、768、1199、1440、1920 宽度，无横向溢出，桌面插画底部位于首屏内。

FAQ 背景缓和：Contact 与 Download 均在 FAQ 顶部进入视口 65% 时提前开始换色，持续 2000ms，保留原浅色终点与上滚恢复，减少突然切换感。浏览器已验证两页均以 2s 过渡完成。

滚动背景支持 returnTransitionMs：回到前一个分区状态时使用独立时长，未配置则沿用 transitionMs。Contact / Download 变 beige 保持 2000ms，返回绿色为 700ms；浏览器已验证双向时长。
