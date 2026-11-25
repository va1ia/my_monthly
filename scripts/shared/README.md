# 共享交互工具

## 目录
- JSON 数据读取
- Newsletter 表单
- 鼠标背景视差
- CSV 解析
- 文件归属
- 滚动背景配置
- 手机页面画布
- 接入与清理
- 验证

## JSON 数据读取
data.js 的 `readJSON(path)` 以站点目录为基准读取 JSON，例如 `readJSON('content/shared/navigation.json')`。站点位置由模块 URL 推导，支持子目录部署和嵌套活动页；读取失败或 JSON 无效时抛错。各页面保留自己的可选配置后备与错误提示，不在每页复制读取函数。

## Newsletter 表单
newsletter.js 同时提供 `createNewsletterSubscriber(config, request)` 和 `mountNewsletterForm(form, status, subscribe, { signal, successMessage })`。前者调用原有订阅接口，后者统一等待、重复提交保护、成功清空和失败重试；Press 可传自己的成功文案。每份表单独立锁定，Footer 传入组件的取消信号，销毁后不再显示晚到的成功消息。

## 文件归属
放置跨页面复用的功能；每个模块顶部写注释目录，说明导出接口与副作用。组件专属行为跟随对应组件目录维护。

## 滚动背景配置
scroll-background.js 导出 mountScrollBackground(target, config, { onChange })。共用样式 styles/scroll-background.css 随 shared.css 加载。target 通常为 document.body，添加 scroll-background 类，通过 --page-background 改变整个页面背景，不绘制渐变。分区需要透明背景才能看到整页底色。

跨页配置放 content/shared/，页面专属配置放 content/<page>/。字段：
- triggerLine：0–1 的视口高度比例；分区顶部上行越过该线时应用状态，回到线下时回退。
- triggerOffsetPx：相对触发线的像素偏移，默认 0；正数可在分区进入视口前提前切换。display:none 的分区跳过。
- sections 中可选 triggerLine / triggerOffsetPx：覆盖全局触发线和偏移；显式 0 生效，未填时继承全局值。
- sections 中可选 preserveOnLayoutChange：触发后仅在真实上滚时允许回退；当前状态仍须匹配 media 且节点仍可见，窗口断点变化不被锁定。
- sections 中可选 media：CSS 媒体查询；不匹配时跳过此状态，窗口尺寸变化时重新判断。
- transitionMs：整体颜色切换时长，默认 400ms；减少动态效果偏好下即时切换。
- default：初始状态，colorToken 使用既有 CSS 颜色变量名称。
- sections：按页面从上到下排列的 selector / colorToken 状态；采用最后一个越过触发线的分区，越过其末尾继续保留，直到下一状态。可附加页面专属字段（例如 footerVariant），由 onChange 处理。

Contact / Download 共用 content/shared/pre-footer-background.json：≥768px 以 FAQ 顶部为稳定判断点，越过视口中线时由 picnic-date 过渡到 darker-linen；≤767px 延后到第二个问题的 summary 顶部进入视窗底边时触发，不再提前 80px。手机触发后，展开上方答案或向下滚动不回退底色；真正上滚退出触发点时恢复绿色，避免布局变化造成误回退。向下 2000ms、上滚返回触发线之前恢复绿色为 700ms；Footer 保留独立绿色。Pre-footer 顶部通过透明天空渐变直接透出 body 的过渡底色，无需另起动画，换色中也与 FAQ 无缝衔接。

## 手机页面画布
mobile-page-canvas.js 的 mountMobilePageCanvas(footer) 由共享 Footer 管理。只在 ≤767px 将 html 画布底色匹配首屏 / 可见分区、菜单面板或页脚；桌面恢复原变量。首页 body.home-page 在手机预设首屏深色，避免模块加载前白底；不修改各分区与 FAQ 的原背景。函数返回 refresh()/destroy()，Footer 变体改变时刷新；销毁清理窗口 / visualViewport / 媒体查询监听及 ResizeObserver / MutationObserver。CSS 入口在 foundations/layout.css 的手机页面画布段。

## 接入与清理
页面结构及共享 Footer（含 Pre-footer）挂载后调用 mountScrollBackground；onChange 初次及状态变化时执行。滚动和窗口变化合并为每帧一次读取，ResizeObserver 与字体加载完成时重算，兼容恢复滚动位置。每次重算重新查找 selector，以支持 FAQ 同步后替换的第二题节点与初次尚未插入的条目。返回 refresh() 主动重算及 destroy()，后者移除监听、观察器并恢复原内联变量和类。页面卸载时调用 destroy()。

## CSV 解析
csv.js 的 parseCSV(text) 为 Contact FAQ 和首页评论区共用，支持 BOM、引号、逗号、CRLF 和多行单元格；FAQ 保留 parseCSV 再导出，不更改调用接口。

## 鼠标背景视差
pointer-parallax.js 导出 mountPointerParallax(section)，写入 --pattern-x / --pattern-y。≥768px 且支持精细鼠标时映射 X ±2vw、Y 0–4vw，平滑跟随；手机和减少动画偏好归零，destroy() 清理监听与动画。首页评论区和 Contact 背景共用；Contact 直接调用共享函数。

滚动背景支持 returnTransitionMs：回到前一个分区状态时使用独立时长，未配置则沿用 transitionMs。Contact / Download 变 beige 为 2000ms，返回绿色为 700ms。

## 验证
`node --test scripts/shared/data.test.mjs scripts/shared/newsletter.test.mjs scripts/faq/sync.test.mjs components/footer/page-policy.test.mjs` 覆盖站点相对数据路径、缺失 / 无效 JSON、订阅重复提交与独立锁定、成功 / 失败 / 组件销毁、FAQ 刷新和 Pre-footer 页面排除。使用模拟请求，不发送真实订阅或改动表格。

2026-11-25 结构整理：13 个页面在 390 / 820 / 1440px 与整理前逐页比较，文字、字体、颜色、行高和元素尺寸一致，均无横向溢出；菜单与 FAQ 的键盘展开 / 关闭和焦点检查通过。Newsletter 浏览器模拟验证邮箱校验、独立提交、成功清空与失败保留；不代表对真实订阅服务的再次联调。

`node --test scripts/shared/scroll-background.test.mjs` 使用模拟布局复现旧 Pre-footer 判断点被展开答案推移后的回绿，并验证新 FAQ 判断点在展开 / 折叠时保持浅色；覆盖 390 / 767 / 768 / 820 / 1440px 的触发边界、上滚恢复、隐藏分区与销毁清理。此为逻辑回归验证，不等同浏览器页面测试。最初修复时 Tabbit 注册失效，未执行页面验证；后续第二题触发调整已用独立 Chrome / WebKit 通过页面回归，见 docs/pre-footer-verification.md 的手机颜色与草丛章节。
