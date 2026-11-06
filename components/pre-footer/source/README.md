# Pre-footer 动画源文件

## 目录
- 文件归属
- 去重依据
- 更新方式

## 文件归属
- garden.json：用户 2026-11-06 上传的 `Json WebsiteHeader1 V2.json`，保留原始字节，480 帧、24fps、20 秒。
- leaves.json：2026-11-03 上传的 `Json WebsiteHeader2.json`，沿用原始字节，240 帧、24fps、10 秒。
- 两份画布均 3439×1080，透明 WebP 图片序列。哈希与文件大小见上级 animation-report.json。运行时保留主动画原速，叶子每 10 秒循环，20 秒内重复两次。

## 去重依据
上传的 `Lottie WebsiteHeader1 V2.lottie` 内 animations/animation.json 与 V2 JSON 的完整解析对象相等，assets、layers、时间轴均一致，因此删除重复包装，保留 JSON。已替换旧 garden.json，并移除空的 Drive 导入目录。叶子文件未改写。media/ 只保留新版生成的三份播放文件，不保留旧版、重复或顺序播放副本。

## 更新方式
替换对应 JSON 后运行 scripts/tools/prepare-pre-footer.py（需 Pillow 和 FFmpeg）。脚本核验画布、帧率与一帧一图结构，根据主动画帧数生成时长，并按取模重复短叶子图层；叶子时长无法整除主动画时停止。矢量或其他类型动画需要重新评估。JSON 不添加管理注释，正常首页不请求这些源文件。
