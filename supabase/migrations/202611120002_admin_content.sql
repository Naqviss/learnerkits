-- Admin-managed public content. These tables are only reachable through server routes
-- using the service role; the public website reads published records through its API.
begin;

create table public.managed_articles (
  slug text primary key check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  description text not null,
  category text not null default 'Science Concepts',
  audience text not null default 'Students and teachers',
  body text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  updated_at timestamptz not null default now()
);
create index managed_articles_status_updated_idx on public.managed_articles (status, updated_at desc);
alter table public.managed_articles enable row level security;
revoke all on public.managed_articles from anon, authenticated;
grant select, insert, update, delete on public.managed_articles to service_role;

create table public.managed_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id text not null check (exam_id in ('9702free', '9702premium', '0620free', '0620premium')),
  source_id text unique,
  topic text not null,
  question text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) between 2 and 6),
  answer integer not null check (answer >= 0 and answer < jsonb_array_length(options)),
  explanation text not null,
  lab text,
  archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index managed_questions_exam_sort_idx on public.managed_questions (exam_id, archived, sort_order, created_at);
alter table public.managed_questions enable row level security;
revoke all on public.managed_questions from anon, authenticated;
grant select, insert, update, delete on public.managed_questions to service_role;

commit;
