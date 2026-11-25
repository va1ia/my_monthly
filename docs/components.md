# 共享组件索引

## 目录
- 组件清单
- 维护规则
- 历史记录

## 组件清单
| 组件 | 说明 | 变体 | 状态 |
| --- | --- | --- | --- |
| Ambassador Program（页面专属） | [页面说明](../pages/ambassador/README.md) | 桌面 / 手机；减少动画 | 云朵眼神与视差、无缝公告、原生纵向驱动文件夹横移、图钉纸张旋转、固定申请入口 |
| Legal document | [组件说明](../components/legal-document/README.md) | 桌面 / 手机 | 服务条款与隐私政策共用；表格文案快照、原站排版、无 Share |
| Press archive（页面专属） | [分区说明](../pages/press/sections/archive/README.md) | 桌面 / 手机；统一 20px / 3° 抬起；减少动画 | 六篇文章按日期排序；三周年和十月 Version 2.5 封面、链接已更新；共享订阅与背景视差 |
| Menu bar | [组件说明](../components/menu-bar/README.md) | 桌面 / 手机；当前页标记 | 已实现 |
| Pre-footer | [组件说明](../components/pre-footer/README.md) | 桌面双列 / 手机单列；视频 / 原始 JSON；同步叠加循环 | 普通页面由 Footer 默认挂载；文章 / 活动排除；手机使用独立两行花园动画 |
| Footer | [组件说明](../components/footer/README.md) | brand / dark / light / period | 已实现；Supabase 名单收集已连接；Download 下方显示 State of Period |
| Home hero（页面专属） | [分区说明](../pages/home/sections/hero/README.md) | 桌面 / 平板 / 手机；减少动画 | 已实现背景视差、碰杯、tag 和 marquee；下载徽章使用原站左上位移及实色阴影 |
| Contact cards（页面专属） | [分区说明](../pages/contact/sections/cards/README.md) | 桌面 / 平板 / 手机 | 卡片、背景视差已实现；手机按截图排列，悬停变灰 |
| 共享 FAQ（Home / Contact / Download / FAQ） | [组件说明](../components/faq/README.md) | SVG 底图 + HTML 文案 / FAQ 链接；无展开色块，整页换色以 FAQ 顶部判断，展开答案不影响换色 | 已实现；Google Sheet Q&A: Preview 已连接 |
| Contact form（页面专属） | [分区说明](../pages/contact/sections/form/README.md) | 等待 / 成功 / 失败 | Supabase 已连接；表单按截图修正，Zapier 分流已连接 |
| Home user comments（页面专属） | [分区说明](../pages/home/sections/user-comments/README.md) | 桌面 / 手机；整组等高、弧线循环、非手机鼠标视差、减少动画 | 已实现；Home: user comments 已连接，每 60 秒同步 |

## 维护规则
先检索已有组件。新增或变更时更新本表和组件自己的 README，说明用途、接口、变体、响应式与可访问性。当前规则写在对应段落，不再把每次微调追加为新的规范。

通用字号仅有正文、较大正文、小字、辅助字和通用标题，见 [样式维护](architecture.md#样式维护)。FAQ 便签标题与问题共用尺寸规则；菜单、Footer 小字使用同一套小字 / 辅助字。法律正文固定 1rem，避免跟随手机版 UI 正文缩小。特殊标题与插画内排版由对应组件负责，不逐项加入全站变量表。

## 历史记录
整理前的逐次调整记录保留于 [组件历史变更](history/components.md)，仅用于追溯。
