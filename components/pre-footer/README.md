# Pre-footer

## 目录
- 接入与设备范围
- 动画检查结论
- 播放方式
- 位置与交互
- 加载与可访问性
- 素材准备与来源
- 验证与限制

## 接入与设备范围
`pre-footer.js` 输出截图中的三张卡片、云朵与花园字样；`pre-footer.css` 随全站共享样式加载。`player.js` 导出 `mountPreFooter(section)`，返回 `select(source, mode)`、`restart()` 和 `destroy()`。source 为 video / lottie；mode 为 overlay / sequential。

当前只在首页 Footer 之前和 `pre-footer-preview.html` 接入，992px 起显示；手机及小平板暂不显示，也不加载动画文件，等待用户另提供手机版素材。共享 Footer 本身保持原接口。三张卡片各只有一个链接：左卡前往本地 download.html，右上前往 Ambassador 申请页，右下前往 Luma。App Store 图案及两个箭头为不可单独聚焦、不可单独点击的视觉提示，没有嵌套链接；整卡可用鼠标和键盘激活。Google Play 地址尚未提供，暂不显示。

首页默认采用网页视频 / 同步叠加。独立测试页可切换原始 Lottie、同步叠加和先 1 后 2；这些测试控制不出现在正式首页。

## 动画检查结论
两份原始 JSON 保持不变：

| 文件 | 原始大小 | Gzip 估算 | 时长 / 帧率 | 内容 |
| --- | --- | --- | --- | --- |
| default1.json | 39.04 MB（约 37.2 MiB） | 28.52 MB | 10 秒 / 24 fps / 240 帧 | 字样、角色、花朵 |
| default2.json | 5.33 MB | 1.43 MB | 10 秒 / 24 fps / 240 帧 | 叶子等前景装饰；起止帧透明 |

两者画布均为 3439×1080。每帧是内嵌 Base64 WebP，第一份约 99.49% 的文件字节来自图片；第二份约 96.24%。这是图片序列包装成 Lottie，并非轻量矢量导出。没有独立蓝色背景层；图片本身有透明通道，角落是透明像素。去除网页的蓝色底色不会缩小原始 JSON。

两份原始文件合计约 44.37 MB；Gzip 后估算约 29.95 MB（实际需服务器启用压缩）。仅按 10Mbps 带宽理想计算，第一份未压缩传输约 31.2 秒，Gzip 后约 22.8 秒；还不含往返、解析与图片解码。不要用 localhost 的加载速度代表线上用户体验。480 张全尺寸 RGBA 的理论总像素内存约 7.13 GB，实际峰值受浏览器解码缓存策略影响，不能把文件大小当成运行内存。

## 播放方式
- **同步叠加（默认）**：相同帧号的 1 和 2 合成在一起，10 秒循环，更符合“字样 + 前景叶子”的素材结构。视频预先合成，避免两条视频各自播放造成漂移；Lottie 对照由两个 canvas 同时起播、在主动画完成时一起重置。
- **先 1 后 2**：严格按原文件顺序，20 秒循环，不保留第一段末帧；后半段字样消失，只显示叶子。专供比较，说明两份素材可能是图层而不是前后半段。

最终意图待用户看测试确认；暂用同步叠加做首页预览。源动画起止动作保持原素材，没有新增补帧或改变速度。

默认 `media/garden-overlay.webm`：8,860,922 字节，10 秒；顺序 WebM：9,097,601 字节，20 秒。VP9 带透明通道，天空由网页、草坪由独立 SVG 提供，避免把草坪颜色烘焙进有损视频。相较两份原始 JSON，默认透明视频体积减少约 80.0%。视频均 3440×1080、24fps、无音轨。原始帧为 3439×1080，输出仅横向调整 1px 以满足 H.264 偶数宽要求；VP9 CRF 22 / H.264 CRF 18。前版降采样至 1920×604 是高清屏模糊的重要原因，现已移除该降采样；原素材仍为位图，不能无限放大。

浏览器先检查 VP9 支持，再抽取首帧透明角落核验 alpha；不支持、忽略 alpha 或请求失败时改用 MP4。MP4 叠加 / 顺序分别 3,465,272 / 3,498,865 字节，10 / 20 秒，H.264 faststart，预合成修正后的草坪和天空；后备版可能保留轻微有损色差，草坪底部背景为同一绿色以避免抗锯齿细缝，不再添加跨灌木的补色伪元素。后备 MP4 在接缝处裁切，防止不透明底色盖住 Footer 文字；叶子跨接缝需透明 WebM 或原始 Canvas 模式，灌木始终可跨接缝。poster 为透明 WebP。
完整尺寸、内容哈希与生成结果见 `animation-report.json`。

## 位置与交互
- 原始画布 3439×1080，显示区裁至等效高 920，移除脚底以下多余留白，不缩短动画时间；字样下沿和角色脚底靠近 Footer 接缝；动画容器保留溢出，使下缘叶子能覆盖 Footer。
- `ground.svg` 提取原站静态插画的草坪路径，填色 #3D8054，与 `--color-picnic-date` 一致。SVG 两侧路径延伸至画布外，消除左边细小露底；字样本身保留原动画较深的绿。`bushes.svg` 使用用户更新的原文件，左右两份 img 分别以半幅 clip-path 裁切并独立定位，左 / 右向 Footer 延伸 6vw / 2vw；不改变 SVG 路径。Pre-footer 建立 z-index:1 层叠上下文，灌木和透明视频 / Canvas 绘于 Footer 之上，均 pointer-events:none，不阻挡订阅或链接。布局参数仍待设计稿确认。
- 云朵复用 `scripts/shared/pointer-parallax.js`，视口鼠标 X ±2vw、Y 0–4vw，平滑跟随；云组 bottom 从 24vw 调为 25vw，整体略上移，位移幅度保持；减少动态效果 / 粗指针下归零，销毁组件时解绑。
- 三卡复刻原站 200ms 悬停：左卡 translate(.35vw,-.35vw)，深色阴影向左下 .7vw；右上 / 右下 translate(-.35vw,-.35vw)，分别为绿色 / 红色阴影向右下 .7vw。键盘聚焦整卡时同样呈现，减少动态效果时移除过渡。右侧两卡的箭头使用原站 system-ui 字形，3.8vw 圆形底色从 translateX(-100%) 滑至 0，箭头变为所在卡片的底色；均随整卡 hover / focus 触发，没有独立按钮交互。

- `loved.svg`、`calm.svg` 使用用户上传版本；Calm 位于 Ambassador 链接内部，宽 56%、右 -12%、底 -54%，随父卡 transform 同步移动。
- Calendar 按原站 8vw 宽度，贴齐卡片外缘 right:0 / bottom:0；Events 使用无结构边框 + ::after 2px 视觉描边，插画延伸至外缘后由 overflow:hidden 沿圆角裁切，描边覆盖其上。Events z-index:1，Ambassador z-index:2，避免 Events 的描边穿过 Calm 插画。

## 加载与可访问性
- 接近分区 400px 内才请求视频与插画，视频 `preload=none`；默认首页不请求原始 JSON 或 Lottie 播放器。
- 分区离开视口、标签页隐藏或切换手机宽度时暂停；回到视口后恢复。原始 JSON 仅在测试页明确选择 Lottie 时加载。
- 减少动态效果偏好下停在首帧，用户仍可通过按钮手动开始。
- 可键盘操作暂停 / 继续、重新开始与对照选择；辅助技术只读整体花园说明，装饰插画使用空 alt。
- 加载失败时保留 poster，状态通过辅助文本提示，不影响卡片链接及 Footer。
- `destroy()` 清理观察器、监听器、Lottie 实例和视频；模式切换会销毁旧实例并取消未完成的 JSON 请求。

## 素材准备与来源
`default1.json`、`default2.json`、`cloud.svg`、`loved.svg`、`calm.svg` 和更新后的 `bushes.svg` 为用户放入本组件的原始素材，直接引用。此前静态 Loved poster 已不再使用。装饰 `loved-deco.svg` 与 `calendar.svg` 来自原站 CDN：
- `https://cdn.prod.website-files.com/68efe11db54fa842b5a0b701/68f1789609170fb1717d3002_pre-footer%20loveddeco.svg`
- `https://cdn.prod.website-files.com/68efe11db54fa842b5a0b701/68f147c1d5dd8b21ab2050b6_pre-footer%20calendar.svg`
草坪路径提取自同一 CDN 的 `68ffadf8c4c2bd8670d7fa88_c62795436ed3cdc38dd3b386eb6662be_pf%20illu.svg`，只保留地面，不重复其中的静态字样。

Lottie Canvas 播放器固定版本 5.13.0，vendor/ 包含 MIT 授权文件；仅原始 Lottie 对照时加载。使用方式参考 https://github.com/airbnb/lottie-web/wiki/loadAnimation-options 和 Renderer-Settings。没有引入应用框架。

重新生成视频：运行 `scripts/tools/prepare-pre-footer.py --ffmpeg /path/to/ffmpeg`，需要 Pillow 和 FFmpeg，仅为素材准备依赖，不是网站运行依赖。脚本限制为本批相同时间轴的一帧一图导出；未来换成矢量动画需重新评估，不会误按本转换器处理。

## 验证与限制
见 `docs/pre-footer-verification.md`。精确品牌数值、最终播放关系和手机版仍待确认。此次未部署，也未提交任何申请或订阅表单。
