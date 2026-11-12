-- LearnerKits Teacher Kit, classrooms and mock-exam history.
-- Apply once in the Supabase SQL Editor or with `supabase db push` (requires Google sign-in to be enabled).
--
-- Every table here is reachable only with the server key: the browser never reads or writes them
-- directly. All access goes through POST /api/classroom (lib/classroom/api.ts), which checks who is
-- asking, and POST /api/admin (lib/admin/api.ts) for the admin panel.
begin;

-- A signed-in user becomes a teacher by creating a profile. `plan` sets the student seat limit
-- (lib/classroom/plans.ts) and is changed from the admin panel until teacher billing exists.
create table public.teacher_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  email text,
  plan text not null default 'basic' check (plan in ('basic', 'famous', 'premium')),
  suspended boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teacher_profiles (user_id) on delete cascade,
  name text not null,
  board text not null default '',
  level text not null default '',
  subject text not null default '',
  join_code text not null unique,
  created_at timestamptz not null default now()
);
create index classes_teacher_id_idx on public.classes (teacher_id);

-- Students join with their own Google account plus the class code.
create table public.class_members (
  class_id uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references auth.users (id) on delete cascade,
  student_name text not null,
  student_email text,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);
create index class_members_student_id_idx on public.class_members (student_id);

-- Lessons, question papers, custom questions and whole-subject kits. `data` holds the content
-- (shapes in lib/classroom/types.ts); a paper stores a snapshot of its questions and answers.
create table public.teaching_items (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teacher_profiles (user_id) on delete cascade,
  kind text not null check (kind in ('lesson', 'paper', 'question', 'kit')),
  title text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index teaching_items_teacher_id_idx on public.teaching_items (teacher_id, kind);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teacher_profiles (user_id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  item_id uuid not null references public.teaching_items (id) on delete cascade,
  kind text not null check (kind in ('lesson', 'paper')),
  title text not null,
  instructions text not null default '',
  due_date date,
  created_at timestamptz not null default now()
);
create index assignments_class_id_idx on public.assignments (class_id);
create index assignments_teacher_id_idx on public.assignments (teacher_id);

-- One submission per student per assignment. Papers are marked by the server on submission;
-- lesson responses wait for the teacher (status 'awaiting_review').
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  student_id uuid not null references auth.users (id) on delete cascade,
  student_name text not null,
  answers jsonb,
  response text,
  score integer,
  total integer not null,
  status text not null check (status in ('graded', 'awaiting_review')),
  feedback text not null default '',
  submitted_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);
create index submissions_student_id_idx on public.submissions (student_id);

create table public.mock_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exam_id text not null,
  score integer not null,
  total integer not null,
  seconds integer not null,
  created_at timestamptz not null default now()
);
create index mock_attempts_user_id_idx on public.mock_attempts (user_id, created_at desc);

do $$
declare t text;
begin
  foreach t in array array['teacher_profiles', 'classes', 'class_members', 'teaching_items', 'assignments', 'submissions', 'mock_attempts'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to service_role', t);
  end loop;
end $$;

commit;
