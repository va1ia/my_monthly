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
background.json：triggerLine 为视口高度触发比例，transitionMs 为切换时长，default 和 sections 使用全站色板变量 colorToken；sections 按页面顺序排列。Contact 当前在 Q&A 内容顶部到视口高度 33% 时触发，过渡 1000ms；Footer 固定绿色。详见 ../../scripts/shared/README.md。
