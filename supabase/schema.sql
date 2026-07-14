-- JAE STUDIO database draft
create extension if not exists "pgcrypto";

create type public.project_status as enum ('experimenting', 'validating', 'growing', 'successful', 'closed');

create table public.projects (
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

create table public.ai_tools (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  website_url text
);

create table public.project_ai_tools (
  project_id uuid references public.projects(id) on delete cascade,
  ai_tool_id uuid references public.ai_tools(id) on delete cascade,
  primary key (project_id, ai_tool_id)
);

create table public.blog_posts (
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

create table public.support_messages (
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

create policy "Public projects are readable" on public.projects for select using (is_public = true);
create policy "Public posts are readable" on public.blog_posts for select using (is_public = true and published_at <= now());
create policy "Approved messages are readable" on public.support_messages for select using (is_approved = true);
create policy "Anyone may submit a message" on public.support_messages for insert with check (is_approved = false);
create policy "AI tools are publicly readable" on public.ai_tools for select using (true);
create policy "Project AI links are publicly readable" on public.project_ai_tools for select using (true);

-- Admin write policies should be added after the owner's Supabase Auth user ID is known.
