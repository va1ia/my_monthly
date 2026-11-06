# Pre-footer 电脑版验证

## 目录
- 本轮范围
- 源文件与分类
- 媒体验证
- 页面验证
- 限制

## 本轮范围
2026-11-06，替换用户上传的 WebsiteHeader1 V2，并把静态 SVG 归类。保留已有卡片、视差、草坡与 Footer 层叠。未部署，未提交表单。

## 源文件与分类
- source/garden.json：80,386,468 字节，480 帧 / 24fps / 20 秒；source/leaves.json：5,330,312 字节，240 帧 / 24fps / 10 秒；画布均 3439×1080。
- V2 `.lottie` 中 animations/animation.json 与上传 JSON 的完整对象相等，删除重复包装；新版 JSON 保留原始字节，SHA-256 与报告一致。旧主动画已替换，叶子不改写。
- 原组件根目录 7 份 SVG 分别移入 images/cards/（4 份）与 images/garden/（3 份）；逐个与移动前 Git 文件比对，字节完全一致；pre-footer.js 同步更新相对路径。
- media/ 仅 garden.webm、garden.mp4、garden-poster.webp；没有旧版、重复包装或 Drive 导入目录。目录 / 哈希检查是素材管理验证，不等同于页面测试。

## 媒体验证
- 透明 VP9：15,986,986 字节；兼容 MP4：6,147,552 字节；透明 poster：227,944 字节。
- 两份视频全程解码到 null 输出无错误，均为 3440×1080、24fps、20 秒；维持 VP9 CRF 22 / H.264 CRF 18，没有降分辨率。
- 生成器按主动画 480 帧输出，叶子通过取模重复两次，保留各自速度。要求叶子帧数整除主动画，其他结构变化会停止转换。

## 页面验证
本地 HTTP 与 Tabbit Chromium：
- 浏览器视频尺寸 3440×1080、duration=20、loop=true，透明角落 alpha=0。
- 在首页将实际视频 seek 到 19.5 秒后继续播放，确认回绕至 0.008 秒，循环计数增加，paused=false。
- JSON 对照的时长逻辑使用轻量、相同时间轴夹具（主 480 帧、叶子 240 帧）验证：10 秒边界主动画帧 240、叶子帧 0，整段循环计数仍为 0；20 秒边界两者帧 0、整段计数为 1。切回视频后 Canvas 数量为 0。这不是完整 80MB 原 JSON 的浏览器播放测试。
- 模拟 WebM 请求失败后回退 MP4；浏览器尺寸仍为 3440 宽、20 秒。
- 992 / 1280 / 1920px 无横向溢出，所有组件图片加载成功，包括分类后 SVG。
- 390px 初次访问：pre-footer display:none，video src 为空，组件 SVG / 视频 / poster / JSON / vendor 请求数为 0。
- 首页截图已查看，V2 与原有草坡、灌木、云及 Footer 的衔接正常；git diff --check 通过。

## 限制
V2 主 JSON 约 80MB，正常首页仅用约 16MB 视频，原 JSON 仅用于保存源文件与手动对照。完整大 JSON 对照测试期间浏览器运行时连接重置，原因未确认，本轮不将其记录为成功验证；边界逻辑另用轻量夹具通过。没有测量 Safari / Windows / 低内存设备性能。位图清晰度仍有原素材上限；MP4 含固定背景，在接缝裁切，跨 Footer 叶子需要透明 WebM / Canvas。手机版动画暂未接入。
