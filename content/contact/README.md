# Contact 数据

## 目录
- 页面文案
- 提交配置

## 页面文案
page.json 对应 cards / form。variant 对应上传的 sad.svg / loved.svg。form.types 保留原站的 First、Second、Third、Another option，方便后续映射 Zapier；类型为可选。

## 提交配置
form.json：enabled 控制提交，url 为现有 Supabase 项目，publishableKey 为浏览器公开 key。不要放入私密 key 或 Zapier webhook。部署见 ../../docs/contact.md。
