# Press 内容

## 目录
- 归档字段
- 来源

## 归档字段
`archive.json` 的 `items` 为六张卡片，按发布时间从旧到新排列，渲染时也会按 `publishedAt` 升序排序：
- `id`：稳定内容标识，不再绑定位置样式。
- `image`：封面文件名，包含扩展名，支持 JPEG / PNG。
- `publishedAt`：LinkedIn 文章实际发布日期，格式 `YYYY-MM-DD`；决定视觉位置和键盘顺序。
- `title`：封面替代文本与链接可访问名称。
- `href`：对应 LinkedIn newsletter 的完整公开地址。

## 来源
链接与日期于 2026-11-24 从公司 LinkedIn 的 MyMonthlyScoop 列表和六篇文章逐一核对；卡片直接使用文章链接。三周年为 2026-07-18，十月 Version 2.5 预告为 2026-10-18（LinkedIn 文章标题为 Cozy News for Cozy Season）。订阅服务配置继续共用 `content/shared/newsletter.json`，不在本页复制配置。
