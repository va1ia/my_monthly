# Contact 数据

## 目录
- 页面文案
- 提交配置
- Q&A
- 整页背景

## 页面文案
page.json 对应 cards / form。variant 对应上传的 sad.svg / loved.svg。form.types 保留原站的 First、Second、Third、Another option，方便后续映射 Zapier；类型为可选。

## 提交配置
form.json：enabled 控制提交，url 为现有 Supabase 项目，publishableKey 为浏览器公开 key。不要放入私密 key 或 Zapier webhook。部署见 ../../docs/contact.md。

## Q&A
faq.json：csvUrl 为 Google Sheet 可公开读取的 CSV 地址（已连接 MM Website Copy / Q&A: Preview，gid=0），refreshSeconds 为刷新间隔，items 为本地后备文案。faq-colors.json 按行序提供 colors，数量不足使用 fallback，不循环。详见 ../../pages/contact/sections/faq/README.md。

## 整页背景
整页背景配置已迁移到 content/shared/pre-footer-background.json，供 Contact / Download 统一使用；字段说明见 ../../scripts/shared/README.md。
