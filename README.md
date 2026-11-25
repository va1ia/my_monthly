# My Monthly 网站

## 目录
- 本地预览
- 页面入口
- 文件结构
- 共享功能与数据
- 维护与验证
- 后续事项

## 本地预览
运行 `python3 scripts/tools/preview.py`，访问 http://127.0.0.1:4173/。项目使用原生 HTML / CSS / JavaScript 模块，无需安装依赖。请通过 HTTP 预览，直接双击 HTML 无法正常加载模块与 JSON。素材清单自动同步方式见 [工具说明](scripts/tools/README.md)。

## 页面入口
| 页面 | 入口 | 维护说明 |
| --- | --- | --- |
| 首页 | [index.html](index.html) | [分区](pages/home/README.md) · [交互](scripts/home/README.md) |
| Contact | [contact.html](contact.html) | [卡片](pages/contact/sections/cards/README.md) · [表单](pages/contact/sections/form/README.md) |
| Download | [download.html](download.html) | [首屏](pages/download/sections/hero/README.md) |
| Newsletter | [press.html](press.html) | [归档与订阅](pages/press/sections/archive/README.md) |
| Shop | [shop.html](shop.html) | [展示墙](pages/shop/sections/merch/README.md) · [购物车](pages/shop/sections/product-dialog/README.md) |
| Ambassador | [ambassador.html](ambassador.html) | [页面说明](pages/ambassador/README.md) |
| FAQ | [faq.html](faq.html) | [完整 FAQ](pages/faq/README.md) |
| 法律页面 | [Terms](terms-of-service.html) · [Privacy](privacy-policy.html) | [文档组件](components/legal-document/README.md) |
| 活动索引 | [event.html](event.html) | [页面说明](pages/event/README.md) |
| 活动详情 | [The State of the Period](event/the-state-of-the-period/) | [活动与报名](event/the-state-of-the-period/README.md) |

技术预览：[共享组件](component-preview.html) · [Pre-footer 动画对照](pre-footer-preview.html)。

## 文件结构
```text
assets/                  字体、共享图标、按页面与分区分类的图片
components/<component>/  已实现的共享组件及各自说明、专属素材
pages/<page>/            页面结构，复杂页面再按 sections/<section>/ 分区
styles/<page>/           页面样式；index.css 为统一入口
styles/foundations/      通用变量、字体注册、重置、文字与布局
scripts/<page>/          页面挂载与专属交互
scripts/shared/          共享数据读取、订阅、FAQ、视差等工具
scripts/tools/           预览与素材同步工具
content/<page>/          页面文案与配置
content/shared/          跨页面共用的数据与配置
event/<slug>/            单个活动的全部专属代码、数据与素材
article/<slug>/          单篇文章的全部专属文件
templates/               新增页面、活动、文章的约定与模板
supabase/                表单服务端函数与数据库迁移
docs/                    架构、组件索引、接入及验证说明
docs/history/            旧修改记录，供追溯使用
```

详细归属、命名与复用规则见 [架构说明](docs/architecture.md)。字体授权见 [字体目录](assets/fonts/README.md)；设计交接和待确认值见 [设计交接](docs/design-handoff.md)。

## 共享功能与数据
- 全站组件从 [组件索引](docs/components.md) 查找；普通页面由 Footer 自动挂载 Pre-footer，文章和活动排除，Ambassador 使用自己的结尾。
- 导航、订阅、简略 FAQ 和滚动换色配置放在 [共享数据](content/shared/README.md)。顶部当前显示 Newsletter / Contact / Download，Footer 另有 State of Period。
- Home / Contact / Download 共用 Q&A: Preview；完整 FAQ 独立读取 Q&A: All。同步与失败后备见 [FAQ 组件](components/faq/README.md)。
- 共享 JSON 读取与 Newsletter 表单状态只维护一份，入口见 [共享工具](scripts/shared/README.md)。
- 订阅名单、Contact 留言和活动报名已接入 Supabase；分别见 [订阅接入](docs/newsletter.md)、[Contact 接入](docs/contact.md) 和活动说明。订阅邮件发送服务尚未接入。
- Shop 的收藏和购物车在本机保存，真实付款未开启；见 [收款接入](docs/shop-checkout.md)。

## 维护与验证
通用文字保留正文、较大正文、小字、辅助字和通用标题；先复用，特殊尺寸留在所属 CSS。现行规则更新到对应 README，逐次微调记录放在历史文档中。

新增内容先查已有组件和共享工具。仅为实际需求创建文件与目录，避免没有行为的转发层；不为整理目录引入框架或依赖。页面改动按 [验收要求](docs/acceptance.md) 检查响应式、键盘、替代文本和对比度；只运行相关验证。

## 后续事项
- 核对尚未确认的 Figma 数值，保留现有页面效果与用户手动调整。
- 按实际需求确定后续框架、正式部署流程与 URL 规则。
- 开启 Shop 付款前完成收款说明中的配置与验证。
