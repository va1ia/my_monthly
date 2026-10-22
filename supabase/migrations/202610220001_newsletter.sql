-- 目录：1. 订阅名单 2. 访问权限
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (length(email) <= 254 and email = lower(trim(email))),
  source text not null default 'website-footer',
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from anon, authenticated;
grant select, insert on public.newsletter_subscribers to service_role;
-- 不创建公共读写策略。仅由 Edge Function 服务端写入，不向网页返回订阅名单。
