-- 活动报名独立保存；浏览器无直接读写权限，由 Edge Function 校验后写入。
create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  event_slug text not null check (event_slug = 'the-state-of-the-period'),
  name text not null check (length(trim(name)) between 1 and 120),
  role text not null check (role in ('Investor', 'Founder', 'Influencer', 'Other')),
  email text not null check (length(email) between 3 and 254),
  social text not null check (length(trim(social)) between 1 and 500),
  contact_consent boolean not null check (contact_consent),
  consent_version text not null default '2026-11-24',
  source text not null default 'website-event',
  created_at timestamptz not null default now(),
  unique (event_slug, email)
);
alter table public.event_registrations enable row level security;
revoke all on public.event_registrations from anon, authenticated;
grant select, insert on public.event_registrations to service_role;
