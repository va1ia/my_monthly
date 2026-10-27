-- Contact：只允许后端角色写入；浏览器不能读写留言。
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  first_name text not null check (length(trim(first_name)) between 1 and 256),
  last_name text not null check (length(trim(last_name)) between 1 and 256),
  email text not null check (length(email) between 3 and 254),
  question_type text not null default '' check (question_type in ('', 'First', 'Second', 'Third', 'Another option')),
  message text not null check (length(trim(message)) between 1 and 5000),
  source text not null default 'website-contact',
  created_at timestamptz not null default now()
);
alter table public.contact_submissions enable row level security;
revoke all on public.contact_submissions from anon, authenticated;
grant select, insert, update on public.contact_submissions to service_role;
