# Ambassador Program

## 目录
- 页面与设计来源
- 互动与无障碍
- 文件归属
- 验证

## 页面与设计来源
入口 `ambassador.html`。按 [Figma Ambassador 区域](https://www.figma.com/design/xKlCUK40XPwLkxbY9JOWIZ/?node-id=17-68173) 的桌面 / 手机稿实现；标题、云朵、文件夹、图钉、图标、背景与人物均使用下载后的原 SVG。标题用隐藏 H1 提供文字名称，插画层为装饰。字体使用已集中注册的 BBH Sans Bogle 与 Graphik；棕色及页面字号为本页局部映射，不作为新增全站品牌规范。

复用 Menu bar / Footer 与订阅服务。设计已提供 Perks 人物结尾，因此此页显式 `preFooter:false`，不再追加通用花园。全站 Pre-footer 的 Ambassador 卡片进入本页，页面内部 Apply Here 继续跳转既有 Typeform。Instagram 使用用户指定 Reel，未添加跟踪参数。

## 互动与无障碍
- 首屏小云的独立眼睛图层随鼠标方向限幅移动；云朵在页面滚动时相对背景向下偏移 16%，产生较慢离开的近景层。仅精细指针启用眼神，离开窗口复位。
- Marquee 为两组等长内容，平移一组长度后无缝循环；悬停、键盘聚焦及暂停按钮均能暂停。
- Program 使用原生纵向滚动和 sticky 舞台，不拦截滚轮或触摸。先让封面落下，露出资格纸张，再将轨道左移展示右侧完整双页，末尾留阅读距离后解除固定。手机双页保持可读宽度，纵向滚动依次移过两张纸。上滑可逆向恢复。
- 分段按钮支持键盘直接跳至介绍、申请资格与学习内容；页面继续支持 Space / PageDown / PageUp。Perks 纸张可键盘聚焦，绕顶部中央图钉轻微转动，图钉保持静止。
- 底部两个入口使用语义链接，固定在视口底部并预留安全区域；正文与 Footer 保留底部空间。移动导航打开时不显示固定入口。
- `prefers-reduced-motion: reduce` 关闭眼神、视差、跑马灯和纸张旋转，文件夹所有文字改为正常文档流，不需要横向动画即可读取。偏好改变时重新测量。

## 文件归属
`page.js` 为结构；`styles/ambassador/index.css` 为样式；`scripts/ambassador/index.js` 为数据与互动入口；文案与链接在 `content/ambassador/page.json`；素材在 `assets/images/ambassador/{hero,program,perks}/`。共享色板、字体与本页命名变量统一在 foundations 中。

## 验证
本次验证记录见 [Ambassador 验证](../../docs/ambassador-verification.md)。只对本页及修改的 Pre-footer 入口进行检查，不包含其他页面整体回归。
