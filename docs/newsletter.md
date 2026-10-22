# Supabase Newsletter 接入

## 目录
- 当前状态
- 部署步骤
- 验证
- 边界与后续

## 当前状态
2026-10-22：订阅表和 Edge Function 已部署，旧 JWT 校验经用户确认关闭，接口验证 publishable key。本地预览已启用（enabled: true），允许 localhost:4173 与 127.0.0.1:4173。

已从网页真实提交 newsletter-test-20261022@example.com，两次提交均成功，后台只有一条记录。测试记录保留并明确标记，不是真实订阅者。公开密钥读取名单返回 HTTP 401。项目另有 Newsletter Subscription 表，本次未修改；当前表单连接 newsletter_subscribers。

正式域名尚未加入；正式上线前仍需防滥用措施。以下部署步骤供维护参考，已完成项目不必重复建表。

## 部署步骤
1. 在 Supabase 项目 gfeutgwgqjsgegravjxk 的 SQL Editor 执行 supabase/migrations/202610220001_newsletter.sql。若已有同名表，先核对结构，不直接重复执行或覆盖。
2. 将 supabase/functions/newsletter-subscribe/index.ts 部署为 newsletter-subscribe。使用 CLI 时，登录后运行 `supabase functions deploy newsletter-subscribe --project-ref gfeutgwgqjsgegravjxk`；配置文件已关闭旧 JWT 验证，函数仍验证 publishable key。
3. 在 Edge Functions Secrets 设置 NEWSLETTER_ALLOWED_ORIGINS。开发可填 `http://127.0.0.1:4173,http://localhost:4173`，上线时填真实网站 origin，多个用逗号分隔，不带路径或末尾斜杠。
4. 确认平台自动注入的 SUPABASE_URL、SUPABASE_PUBLISHABLE_KEYS、SUPABASE_SECRET_KEYS 可用；SDK 支持单数键名回退。不要将私密密钥放在网站环境配置或聊天里。使用 Edge Functions 的 npm import，无需给静态网站安装服务器依赖。
5. 将 content/shared/newsletter.json 的 enabled 改为 true，再从网站提交自己的测试邮箱。

## 验证
确认数据库出现一条记录；重复提交同一邮箱不新增记录。错误邮箱被拒绝，服务器失败时表单显示失败。公开 key 不应能读取名单。用自己的邮箱进行真实测试后按需清理测试记录。本地自动验证只覆盖处理逻辑与前端响应，不证明部署成功。

## 边界与后续
这一步只保存订阅请求，不发送邮件，不验证邮箱归属，也不创建 Supabase Auth 用户。正式 Newsletter 发送需配置邮件服务、退订及按需要启用确认邮件。发布前补充 CAPTCHA 或持久化限流；公开 key 和 CORS 都不能防止自动化滥用。当前服务不应在这些防护完成前作为正式公开入口。重复请求统一回复成功，不暴露邮箱是否已存在。

官方参考：https://supabase.com/docs/guides/functions/auth
