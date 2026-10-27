# 共享交互工具

## 目录
- 鼠标背景视差
- CSV 解析
- 文件归属
- 滚动背景配置
- 接入与清理

## 文件归属
放置跨页面复用的功能；每个模块顶部写注释目录，说明导出接口与副作用。组件专属行为跟随对应组件目录维护。

## 滚动背景配置
scroll-background.js 导出 mountScrollBackground(target, config, { onChange })。共用样式 styles/scroll-background.css 随 shared.css 加载。target 通常为 document.body，添加 scroll-background 类，通过 --page-background 改变整个页面背景，不绘制渐变。分区需要透明背景才能看到整页底色。

各页面在 content/<page>/background.json 配置：
- triggerLine：0–1 的视口高度比例；分区顶部上行越过该线时应用状态，回到线下时回退。
- transitionMs：整体颜色切换时长，默认 400ms；减少动态效果偏好下即时切换。
- default：初始状态，colorToken 使用既有 CSS 颜色变量名称。
- sections：按页面从上到下排列的 selector / colorToken 状态；采用最后一个越过触发线的分区，越过其末尾继续保留，直到下一状态。可附加页面专属字段（例如 footerVariant），由 onChange 处理。

Contact 配置在 content/contact/background.json，Q&A 使用 --color-darker-linen，默认 --color-picnic-date。Contact 在 Q&A 内容顶部到达视口高度 33% 时以 1000ms 过渡换色；Footer 保留独立的 brand 绿色背景，不参与滚动换色。未启用该模块的页面不受影响。

## 接入与清理
页面结构挂载后调用 mountScrollBackground；onChange 初次及状态变化时执行。滚动和窗口变化合并为每帧一次读取，ResizeObserver 与字体加载完成时重算，兼容恢复滚动位置。返回 refresh() 主动重算及 destroy()，后者移除监听、观察器并恢复原内联变量和类。页面卸载时调用 destroy()。

## CSV 解析
csv.js 的 parseCSV(text) 为 Contact FAQ 和首页评论区共用，支持 BOM、引号、逗号、CRLF 和多行单元格；FAQ 保留 parseCSV 再导出，不更改调用接口。

## 鼠标背景视差
pointer-parallax.js 导出 mountPointerParallax(section)，写入 --pattern-x / --pattern-y。≥768px 且支持精细鼠标时映射 X ±2vw、Y 0–4vw，平滑跟随；手机和减少动画偏好归零，destroy() 清理监听与动画。首页评论区和 Contact 背景共用；Contact 保留原 mountContactMotion 导出接口。

滚动背景支持 returnTransitionMs：回到前一个分区状态时使用独立时长，未配置则沿用 transitionMs。Contact / Download 变 beige 保持 2000ms，返回绿色为 700ms；浏览器已验证双向时长。
