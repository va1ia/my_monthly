# 公司网站

## 目录
- 本地预览
- 当前状态
- 文件结构
- 素材放置
- 后续开发

## 本地预览
在本目录运行 `python3 scripts/tools/preview.py`，浏览器访问 http://127.0.0.1:4173/。这是无需安装依赖的 HTML/CSS/JavaScript 模块预览，不要直接双击 HTML（模块和 JSON 需要 HTTP）。

根 index.html 已接入首页 landing section：背景视差、滚动碰杯、三条产品价值 tag 和 Logo marquee。Logo 文件夹自动同步见 assets/images/home/logo-marquee/README.md；清单由脚本生成，无需手改。组件预览移到 component-preview.html；其中页面选择器可切换当前页装饰，背景选择器可检查 Footer 三种变体。

Contact 两个分区（联系卡片、We hear you 表单）已实现，预览 http://127.0.0.1:4173/contact.html。Supabase 与 Zapier 留言邮件分流已连接并通过真实运行验证；见 [Contact 接入](docs/contact.md)。

## 当前状态
首页 landing、导航和 Footer 已按参考站及用户截图实现；使用上传的 Logo、插画、社交图标和字体。首页后续分区尚未实现，未配置部署。Newsletter 已连接 Supabase 保存名单（本地预览与 GitHub Pages 来源）；尚未接入邮件发送服务。共享链接配置见 content/shared/README.md。

## 文件结构
```text
assets/                       全站和品牌页面素材
  fonts/                      授权字体文件
  icons/                      Wordmark、favicon 和共享图标
  images/shared/              非图标类共享图片
  images/home/                首页图片，hero/ 和 logo-marquee/
  images/contact/             联系卡片与背景，form/ 为表单装饰
components/                   共享组件，每个组件独立目录和说明
content/home/        首页文案、数据，按分区命名
pages/home/          首页结构，按分区组织
scripts/home/        首页交互，按分区组织
scripts/shared/               共享交互工具
styles/                       全站样式及品牌页面分区样式
  foundations/               变量、字体、重置、文字、布局
  home/             首页分区样式
  shared.css                 全站共享样式入口
  home/index.css          首页样式入口
event/<slug>/                单个活动全部专属文件
article/<slug>/              单篇文章全部专属文件
templates/                   新增品牌页面、活动和文章的模板
docs/                        结构、设计接入、组件索引等说明
```

## 素材放置
- 字体 → `assets/fonts/`；授权和字重说明见该目录 README。
- Wordmark、favicon、共享图标 → `assets/icons/`。
- 其他共用图片 → `assets/images/shared/`。
- 首页图片 → `assets/images/home/<section>/`。
- 活动或文章专属图片 → 对应页面自己的 `images/`，不散落到公共素材目录。
- Figma 链接、分区讲解 → `docs/design-handoff.md`。

## 后续开发
1. 填写设计交接文档，上传图片和字体。
2. 确认技术框架、部署位置及 URL 规则。
3. 将 Figma 文字和颜色映射到全站基础样式。
4. 优先实现共享组件，再按分区实现首页。
5. 按 `docs/acceptance.md` 检查响应式和可访问性；本次首屏检查见 `docs/hero-verification.md`。

新增页面和命名规则见 [架构规范](docs/architecture.md)；组件查找见 [组件索引](docs/components.md)。

Supabase 订阅接口已部署并通过本地预览真实提交验证，GitHub Pages 公开网页也已验证通过；接入步骤见 [部署说明](docs/newsletter.md)。
