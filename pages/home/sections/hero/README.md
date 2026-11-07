# Hero 分区

## 目录
- 结构与数据
- 动画与遮挡
- 参考与待确认
- 验证

## 结构与数据
`hero.js` 输出首屏结构，由 `scripts/home/index.js` 挂载。文字和 App Store 链接维护在 `content/home/hero.json`；Logo 顺序由素材文件名数字前缀决定，自动生成清单为 `content/home/logo-marquee.json`；样式入口为 `styles/home/index.css`。图片使用用户上传 SVG，规范化为 kebab-case，Logo 位于 `assets/images/home/logo-marquee/`。复用全站字体、色板、导航和 Footer，不增加依赖。

## 动画与遮挡
`scripts/home/hero.js` 根据滚动位置驱动手机及标签，向上滚动可回退。原站关键帧：桌面左右位移 ±24px、旋转 ±4° → 0，向下 12px；手机向外位移由 ±(2.95vw + 4px) 收至 ±2.95vw，向下 4px，在素材自身倾角上由左右 ±2° 向内旋转至 ±5°，让两个手机上角刚好接触，避免边框重叠。合拢在滚动进度 16% 完成；手机版隐藏三条 tag；非手机版三条 tag 分别在 0–8%、3–11%、8–15% 渐入并上移 16px。当前将完整进度映射到一个视口滚动距离。鼠标细指针且屏宽 ≥992px 时，背景横移 ±2vw、纵移 0–4vw，逐帧平滑，静止后停止更新。

插画和背景在 scene 内裁切，marquee 独立放在上层，不受手机 transform 影响。桌面首屏高度按截图约 68.1vw；手机约 208.5vw，下载按钮位于插画下方（顶部 179.5vw、宽 35.5vw）。手机插画各宽 100vw，叠加向内碰杯倾角，并按屏宽保留左右 2.95vw 的位移余量，手臂尾端自然延伸出屏幕两侧；不再用横向背景色块截断手臂。手机版背景按 SVG 原比例铺到屏幕宽度、下移 9vw，不再 cover 放大或额外缩放，保留参考截图中的图案位置。标签为信息文本，暂不作为链接。App Store 徽章悬停与键盘聚焦时向左上移动 .3vw，右下出现 darker-linen 实色阴影，圆角 5px，使用原站 200ms ease 过渡；动画应用于徽章图片，保留手机容器居中。减少动画时立即切换。

Marquee 由 `scripts/home/marquee.js` 管理，自动读取新增、删除、排序和替换，15 秒检查一次（后台页面暂停请求）。本地须用 `scripts/tools/preview.py` 自动生成清单；GitHub push 后由 sync-marquee 工作流更新清单，静态部署仍由既有发布流程完成。Marquee 包含两份同宽轨道，素材少时先补足一个视口宽度，再复制第二组，空目录隐藏 marquee；时长按单组宽度 / 48px 每秒计算，增减素材保持恒速。Logo 视觉大小按用户整条 PNG 校准，使用 SVG 导出尺寸比例，取消等宽格子，圆形标志不额外保留两侧内边距；新增素材自动读取尺寸。副本隐藏于辅助技术；暂停按钮可通过键盘操作。减少动态效果时停止背景视差和 marquee，手机直接合拢，非手机版全部 tag 可见，手机版仍隐藏 tag。组件卸载可调用 `mountHeroMotion()` 返回的 `destroy()`。

## 参考与待确认
2026-10-23 读取 https://mymonthly.io/ 的 DOM、CSS 和 Webflow ix2 配置（a-16/a-18/a-19），结合用户的桌面/手机截图还原。Tag 按用户后续要求同步目标网站当前产品价值文案。https://github.com/morluto/rea 是用户提供的逆向工具参考，本次通过公开页面和浏览器配置直接追踪，没有安装该工具。

字号、首屏留白、手机尺寸、tag 点击目的地仍待 Figma/业务确认，不提升为最终全站规范。粉色 tag 使用深色文字以满足对比度。

## 验证
验证记录见 `docs/hero-verification.md`。
