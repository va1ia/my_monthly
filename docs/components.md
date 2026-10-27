# 共享组件索引

## 目录
- 组件清单
- 新增与变更

## 组件清单
| 组件 | 说明 | 变体 | 状态 |
| --- | --- | --- | --- |
| Menu bar | [组件说明](../components/menu-bar/README.md) | 桌面 / 手机；当前页标记 | 已实现 |
| Footer | [组件说明](../components/footer/README.md) | brand / dark / light | 已实现；Supabase 名单收集已连接 |
| Home hero（页面专属） | [分区说明](../pages/home/sections/hero/README.md) | 桌面 / 平板 / 手机；减少动画 | 已实现背景视差、碰杯、tag 和 marquee；下载徽章使用原站左上位移及实色阴影 |
| Contact cards（页面专属） | [分区说明](../pages/contact/sections/cards/README.md) | 桌面 / 平板 / 手机 | 卡片、背景视差已实现；手机按截图排列，悬停变灰 |
| Contact form（页面专属） | [分区说明](../pages/contact/sections/form/README.md) | 等待 / 成功 / 失败 | Supabase 已连接；表单按截图修正，Zapier 分流已连接 |
| Button | [组件说明](../components/button/README.md) | 待设计确认 | 目录预留 |

## 新增与变更
Contact 表单移除字段聚焦时的外侧粗描边，保留原细边框、提交按钮键盘焦点与必填校验。

Footer 版权行缩短上方间距并增大字号，保持正常文档流；不增加垂直位移。

Footer 底部留白：桌面 80px、手机 64px，叠加底部安全区域。Contact 表单面板最大宽度 1000px，桌面内边距同步限制上限。

Home hero：Logo 按文件名数字前缀排序，目录扫描生成清单，新增、删除及替换后自动同步；轨道根据数量补足宽度并保持恒速；按参考 PNG 使用各 SVG 的视觉比例，取消等宽格子和圆形标志多余留白。见 [素材说明](../assets/images/home/logo-marquee/README.md)。
Menu bar 胶囊背景已按原站截图加入约 94.9% 不透明度和 3px 背景模糊；独立背景层保留手机全屏面板定位，不支持模糊的浏览器回退为实色。
Menu bar：桌面 Download 按钮支持左侧圆形色块扩散（9 倍覆盖），无下划线，使用 13px / 600 字体；普通导航当前页保留下划线，手机菜单支持上下滑动过渡及减少动画偏好。Footer：页面导航与法律链接使用 400 字重及悬停放大反馈；订阅输入框取消聚焦外框，键盘焦点使用底线提示；社交图标整组左移 2px，悬停放大至 1.1 倍。
先检索已有组件。新增时记录用途、接口、变体、使用方式、响应式行为和可访问性要求，更新此表。

Supabase 订阅接口已部署并通过本地预览真实提交验证，GitHub Pages 公开网页也已验证通过；接入步骤见 [部署说明](newsletter.md)。

交互分别维护：Menu bar 普通导航使用下划线展开，不缩放；Download 无下划线，保留圆形扩散。Footer 文字链接和社交图标以正中心为原点悬停放大至 1.1 倍（180ms），不显示下划线。
