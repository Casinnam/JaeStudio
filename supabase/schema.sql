-- JAE STUDIO database draft
create extension if not exists "pgcrypto";

do $$ begin
  create type public.project_status as enum ('experimenting', 'validating', 'growing', 'successful', 'closed');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  summary text not null,
  description text,
  website_url text,
  cover_image_url text,
  started_at date,
  launched_at date,
  marketing_cost bigint not null default 0 check (marketing_cost >= 0),
  revenue bigint not null default 0 check (revenue >= 0),
  recurring_revenue bigint not null default 0 check (recurring_revenue >= 0),
  paid_customers integer not null default 0 check (paid_customers >= 0),
  retention_30d numeric(5,2),
  weekly_operation_hours numeric(6,2),
  status public.project_status not null default 'experimenting',
  lesson text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_tools (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  website_url text
);

create table if not exists public.project_ai_tools (
  project_id uuid references public.projects(id) on delete cascade,
  ai_tool_id uuid references public.ai_tools(id) on delete cascade,
  primary key (project_id, ai_tool_id)
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  is_public boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 1 and 30),
  message text not null check (char_length(message) between 1 and 300),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.ai_tools enable row level security;
alter table public.project_ai_tools enable row level security;
alter table public.blog_posts enable row level security;
alter table public.support_messages enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Public projects are readable" on public.projects;
drop policy if exists "Public posts are readable" on public.blog_posts;
drop policy if exists "Approved messages are readable" on public.support_messages;
drop policy if exists "Anyone may submit a message" on public.support_messages;
drop policy if exists "AI tools are publicly readable" on public.ai_tools;
drop policy if exists "Project AI links are publicly readable" on public.project_ai_tools;
drop policy if exists "Admins manage projects" on public.projects;
drop policy if exists "Admins manage blog posts" on public.blog_posts;
drop policy if exists "Admins manage messages" on public.support_messages;
drop policy if exists "Admins manage AI tools" on public.ai_tools;
drop policy if exists "Admins manage project AI links" on public.project_ai_tools;

create policy "Public projects are readable" on public.projects for select using (is_public = true);
create policy "Public posts are readable" on public.blog_posts for select using (is_public = true and published_at <= now());
create policy "Approved messages are readable" on public.support_messages for select using (is_approved = true);
create policy "Anyone may submit a message" on public.support_messages for insert with check (is_approved = false);
create policy "AI tools are publicly readable" on public.ai_tools for select using (true);
create policy "Project AI links are publicly readable" on public.project_ai_tools for select using (true);

create policy "Admins manage projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage blog posts" on public.blog_posts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage messages" on public.support_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage AI tools" on public.ai_tools for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage project AI links" on public.project_ai_tools for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- After creating the owner in Authentication > Users, run this once in SQL Editor:
-- insert into public.admin_users (user_id)
-- select id from auth.users where email = 'YOUR_ADMIN_EMAIL';
