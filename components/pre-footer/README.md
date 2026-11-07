# Pre-footer

## 目录
- 目录归类
- 接入与设备范围
- 动画检查结论
- 播放方式
- 位置与交互
- FAQ 背景衔接
- 加载与可访问性
- 素材准备与来源
- 验证与限制
- Loved 动态卡片
- 手机版布局与素材替换

## 目录归类
- source/：唯一一套花园原始 JSON、Loved 原始 MOV 和来源说明。
- media/：花园透明视频、MP4 后备和 poster；cards/ 放 Loved 卡片的透明 WebM 与 MP4 后备。
- images/cards/：Loved、Loved 装饰、Calm 和 Calendar。
- images/garden/：Cloud、Ground 和 Bushes。
- vendor/：Lottie 对照播放器及授权；组件根目录只放代码、样式、测量报告和说明。

## 接入与设备范围
`pre-footer.js` 输出截图中的三张卡片、云朵与花园字样；`pre-footer.css` 随全站共享样式加载。`player.js` 导出 `mountPreFooter(section)`，返回 `select(source)`、`restart()` 和 `destroy()`。source 为 video / lottie，始终同步叠加循环。

所有普通品牌页面默认由共享 Footer 自动挂载一份；文章页和活动页排除。当前 Home / Contact / Download / Shop 已接入，`pre-footer-preview.html` 保留独立手动对照。规则位于 `components/footer/page-policy.js`，未来普通页面只需调用 mountFooter，无需重复挂载。992px 起使用双列，991px 以下使用纵向三卡，均启用相同的可见性播放逻辑。共享 Footer 统一管理自动挂载与销毁；自定义路由的文章 / 活动页通过 pageType 显式排除。三张卡片各只有一个链接：下载页、Ambassador 申请页和 Luma。徽章、箭头及手机按钮样式均为整卡链接的视觉提示，没有嵌套链接。Google Play 地址尚未提供，暂不显示。

普通页面默认采用网页视频 / 同步叠加。独立测试页可对照视频和新版原始 JSON；这些测试控制不出现在正式首页。

## 动画检查结论
2026-11-06 用户上传的 V2 已替换。主动画为 480 帧 / 20 秒，叶子沿用现有 240 帧 / 10 秒版本；两层均为 3439×1080、24fps、透明背景。主动画保持原速，叶子在其中循环两次。

新版 `.lottie` 解包后的动画 JSON 与上传主 JSON 完全相等（包括 assets、layers、时间轴）。它是 ZIP 压缩包装，不是另一个矢量 / 更高清版本，运行时仍需解压、解析及解码 480 张内嵌 WebP。因此保留可编辑 JSON 作为唯一源文件，网页默认继续使用透明视频。

| 文件 | 用途 | 大小 |
| --- | --- | --- |
| source/garden.json | 新版字样 / 角色原始导出 | 80,386,468 字节 |
| source/leaves.json | 叶子原始导出 | 5,330,312 字节 |
| media/garden.webm | 默认透明 VP9 视频 | 15,986,986 字节 |
| media/garden.mp4 | H.264 兼容后备 | 6,147,552 字节 |
| media/garden-poster.webp | 透明首帧 / 加载占位 | 227,944 字节 |

两份源 JSON 合计约 85.72 MB，Gzip 估算约 60.26 MB；默认视频约减少 81.3% 原始传输体积。JSON / Lottie 均为图片序列，压缩文件体积不代表运行内存；浏览器不会在正常首页加载它们。

## 播放方式
两层同步合成，主动画 20 秒循环，叶子每 10 秒独立重复；已删除顺序播放分支与两个顺序视频，避免管理重复版本。测试页仅保留视频 / 原始 JSON 对照与重播。

视频保持 3440×1080、24fps、无音轨；原始帧 3439×1080，仅横向调整 1px 以满足编码偶数宽要求。VP9 CRF 22、H.264 CRF 18；没有重新降采样到 1920 宽。原始 WebP 仍是位图，放大后的清晰度有上限。

先检查 VP9 支持，再核验首帧透明角落 alpha；不支持、忽略 alpha 或 WebM 请求失败时改用 MP4。透明 WebM / Canvas 允许叶子越过草坪接缝；不透明 MP4 在接缝处裁切，避免底色盖住 Footer 文字。MP4 有轻微有损底色色差的可能；草坪与天空优先由网页独立图层提供。

完整哈希、尺寸和体积见 `animation-report.json`，源文件交接与去重依据见 `source/README.md`。

## 位置与交互
- 原始画布 3439×1080，显示区裁至等效高 920，移除脚底以下多余留白，不缩短动画时间；字样下沿和角色脚底靠近 Footer 接缝；动画容器保留溢出，使下缘叶子能覆盖 Footer。
- `images/garden/ground.svg` 提取原站静态插画的草坪路径，填色 #3D8054，与 `--color-picnic-date` 一致。SVG 两侧路径延伸至画布外，消除左边细小露底；字样本身保留原动画较深的绿。`images/garden/bushes.svg` 使用用户更新的原文件，左右两份 img 分别以半幅 clip-path 裁切并独立定位，左 / 右向 Footer 延伸 6vw / 2vw；不改变 SVG 路径。Pre-footer 建立 z-index:1 层叠上下文，灌木和透明视频 / Canvas 绘于 Footer 之上，均 pointer-events:none，不阻挡订阅或链接。布局参数仍待设计稿确认。
- 云朵复用 `scripts/shared/pointer-parallax.js`，视口鼠标 X ±2vw、Y 0–4vw，平滑跟随；云组 bottom 从 24vw 调为 25vw，整体略上移，位移幅度保持；减少动态效果 / 粗指针下归零，销毁组件时解绑。
- 三卡复刻原站 200ms 悬停：左卡 translate(.35vw,-.35vw)，深色阴影向左下 .7vw；右上 / 右下 translate(-.35vw,-.35vw)，分别为绿色 / 红色阴影向右下 .7vw。键盘聚焦整卡时同样呈现，减少动态效果时移除过渡。右侧两卡的箭头使用原站 system-ui 字形，3.8vw 圆形底色从 translateX(-100%) 滑至 0，箭头变为所在卡片的底色；均随整卡 hover / focus 触发，没有独立按钮交互。

- Loved 改用 source/loved.mov 转出的动态视频；images/cards/loved.svg 保留为加载 / 失败后备。Calm 位于 Ambassador 链接内部，宽 56%、右 -12%、底 -54%，随父卡 transform 同步移动。
- Calendar 按原站 8vw 宽度，贴齐卡片外缘 right:0 / bottom:0；Events 使用无结构边框 + ::after 2px 视觉描边，插画延伸至外缘后由 overflow:hidden 沿圆角裁切，描边覆盖其上。Events z-index:1，Ambassador z-index:2，避免 Events 的描边穿过 Calm 插画。

## 加载与可访问性
- 接近分区 400px 内才请求视频与插画，视频 `preload=none`；默认首页不请求原始 JSON 或 Lottie 播放器。
- 分区离开视口或标签页隐藏时暂停；回到视口后恢复。原始 JSON 仅在测试页明确选择 Lottie 时加载。
- 减少动态效果偏好下停在首帧，用户仍可通过按钮手动开始。
- 可键盘操作暂停 / 继续、重新开始与对照选择；辅助技术只读整体花园说明，装饰插画使用空 alt。
- 加载失败时保留 poster，状态通过辅助文本提示，不影响卡片链接及 Footer。
- `destroy()` 清理观察器、监听器、Lottie 实例和视频；模式切换会销毁旧实例并取消未完成的 JSON 请求。

## 素材准备与来源
`source/garden.json`、`source/leaves.json` 是用户上传的导出（主动画于 2026-11-06 更新为 V2，叶子沿用 2026-11-03 版本），移动后字节不变。重复的 `.lottie`、旧版 default1/default2、旧 overlay / sequential 视频和未引用的 Loved poster 已清理，原导入文件夹不再保留重复副本。media/ 只保留上表三份播放文件。

`images/garden/cloud.svg`、`images/cards/loved.svg`、`images/cards/calm.svg`、`images/garden/bushes.svg` 为用户上传 SVG，继续引用。`images/cards/loved-deco.svg`、`images/cards/calendar.svg` 和提取草坪路径的静态插画来自原站 CDN：
- `https://cdn.prod.website-files.com/68efe11db54fa842b5a0b701/68f1789609170fb1717d3002_pre-footer%20loveddeco.svg`
- `https://cdn.prod.website-files.com/68efe11db54fa842b5a0b701/68f147c1d5dd8b21ab2050b6_pre-footer%20calendar.svg`
- 同目录 `68ffadf8c4c2bd8670d7fa88_c62795436ed3cdc38dd3b386eb6662be_pf%20illu.svg`，只提取地面，不重复其静态字样。

Lottie Canvas 播放器固定版本 5.13.0，vendor/ 包含 MIT 授权文件；仅原始 Lottie 对照时加载。使用方式参考 https://github.com/airbnb/lottie-web/wiki/loadAnimation-options 和 Renderer-Settings。没有引入应用框架。

重新生成视频：运行 `scripts/tools/prepare-pre-footer.py --ffmpeg /path/to/ffmpeg`，输入固定为 source/ 中两份文件；按主动画帧数导出，短叶子图层以原速取模循环，时长须整除主动画，输出先在临时目录完成，再替换 media/，需要 Pillow 和 FFmpeg，仅为素材准备依赖，不是网站运行依赖。脚本限制为本批相同时间轴的一帧一图导出；未来换成矢量动画需重新评估，不会误按本转换器处理。

## 验证与限制
见 `docs/pre-footer-verification.md`。精确品牌数值和最终手机版花园素材仍待确认。此次未部署，也未提交任何申请或订阅表单。

## FAQ 背景衔接
Pre-footer 的天空渐变从透明起步，32% 处达到天空蓝。在启用 scroll-background 的页面，组件底色也设为透明，顶部直接透出 body 当前正在过渡的颜色，因此慢速换色、上滚反向切换和快速滚动都不会产生 FAQ / Pre-footer 色块接缝。未启用整页换色的页面和独立预览保留 darker-linen 底色。无需额外颜色动画或逐帧脚本，原触发点及双向时长不变。

## Loved 动态卡片
Loved 角色及静态后备以中心为基准使用 scale 1.045（在上一版 1.1 基础上缩小 5%），并左移自身宽度的 4%（1440px 屏幕约 9px）；不改变布局占位，四个装饰、标题和下载标记保持原尺寸与位置。

用户上传 love.mov 已归入 source/loved.mov（原始 ProRes 4444、透明、1440×1440、24fps、43 帧，约 1.79 秒），不在网页直接加载。media/cards/loved.webm 为透明 VP9（约 144 KB），loved.mp4 为相同卡片绿底的兼容后备（约 136 KB）。裁剪全动画边界至 crop=1098:1284:240:70 后 hflip，缩放为 548×642，保持完整动作并与旧 SVG 的心形发束朝向、脚底和原插画容器对齐；CSS 不再额外镜像。WebM CRF 22、MP4 CRF 18，无音轨。

四个小装饰沿用 loved-deco.svg 的路径、原坐标和颜色，内联到 pre-footer.js 的 lovedDecorations 中以分别控制动画；更新装饰源文件时须同步这里的四条路径。各自以 4.8 / 5.6 / 5.2 / 6.2 秒 ease-in-out 循环、负延时错开，上下 ±6 个 SVG 单位（1440px 屏幕显示约 ±4px），不旋转、不缩放。

Loved 与花园分别按自身可见性播放；页面隐藏、全局暂停或减少动态效果时暂停，四个装饰同步受控。减少动态效果下装饰不动，视频保留首帧。原生 loop 保留约 1.79 秒原速；鼠标和键盘仍只激活整张下载卡片。接近组件 400px 时加载卡片，花园视频延后至花园自身接近视口 400px 时加载；销毁时释放观察器、媒体和事件。WebM 解码失败或忽略透明度时自动切换 MP4，两个格式都失败则保留原静态 SVG。

## 手机版布局与素材替换
2026-11-06 按用户截图实现：≤991px 为居中纵向三卡，宽度 86%（最大 580px）；下载卡保留角色、四个装饰、标题与 App Store 提示。Ambassador / Events 遵从 PC 最终版，使用相同箭头入口及悬停圆形色块，不使用旧稿黑色按钮。Calm 继承 PC 宽度和定位，只额外等比缩小至 .9；Calendar 按 PC 常规卡片比例缩为 22.13%，贴齐右下角并沿圆角裁切。云层直接使用 PC 完整原图，保留原始形状、数量及内部相对坐标。下方接花园及 Footer。

底部暂时完整复用电脑版花园。资源入口为 media-sources.js：garden 是默认桌面资源；mobileGarden 当前为 null，自动回退 garden。手机素材完成后，填写 mobileGarden 的 webm / mp4 / poster 路径（相对组件目录）、aspectRatio（显示区宽高比）、frameHeightRatio（完整视频高度与显示区高度之比），无需修改卡片或页面入口。原始 Lottie 对照仍使用现有电脑版 JSON。

手机沿用按可见性播放、离屏暂停、减少动画首帧和键盘暂停 / 继续；暂停按钮常显。尺寸按截图暂定，最终花园构图待新素材。

移动端与 PC 对齐跟进：移除截取 / 复制的手机云朵，直接使用 PC 完整 cloud.svg，保留所有云朵原始形状和相对坐标。Calm 继承 PC 的 56% 宽度、right -12% / bottom -54%，仅以左下角为基准等比缩小至 .9；Calendar 按 PC 常规卡片内比例设为 22.13%，高度保持 auto。手机不再重新指定角色的 62% 宽度和 -16% 位置。

按用户要求恢复其手动调整的手机尺寸：Calm 宽度 62%、right -16%，取消额外 .9 缩放；Calendar 宽度 28%。两者继续保持 height:auto；PC 和云层不变。

手机卡片两处纵向间距（下载卡至 Ambassador、Ambassador 至 Events）各减少 4px，统一为 calc(clamp(24px, 6vw, 40px) - 4px)；保留用户手动调整的人物与日历尺寸。
