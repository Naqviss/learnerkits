-- Per-user experiment measurements and mission progress for every simulation.
-- Apply with `supabase db push` or in the Supabase SQL editor.
begin;

create table if not exists public.simulation_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  simulation_slug text not null check (char_length(simulation_slug) between 1 and 100),
  title text not null check (char_length(title) between 1 and 120),
  conditions text not null default '' check (char_length(conditions) <= 1000),
  observation text not null default '' check (char_length(observation) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists simulation_measurements_user_lab_idx
  on public.simulation_measurements (user_id, simulation_slug, created_at desc);

create table if not exists public.simulation_mission_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  simulation_slug text not null check (char_length(simulation_slug) between 1 and 100),
  mission_id text not null check (mission_id in ('predict', 'compare', 'explain')),
  completed boolean not null default false,
  evidence text not null default '' check (char_length(evidence) <= 2000),
  updated_at timestamptz not null default now(),
  primary key (user_id, simulation_slug, mission_id)
);
create index if not exists simulation_mission_progress_user_idx
  on public.simulation_mission_progress (user_id, updated_at desc);

alter table public.simulation_measurements enable row level security;
alter table public.simulation_mission_progress enable row level security;

grant select, insert, update, delete on public.simulation_measurements to authenticated;
grant select, insert, update, delete on public.simulation_mission_progress to authenticated;

create policy "Users read their simulation measurements"
  on public.simulation_measurements for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users create their simulation measurements"
  on public.simulation_measurements for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update their simulation measurements"
  on public.simulation_measurements for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users delete their simulation measurements"
  on public.simulation_measurements for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users read their simulation missions"
  on public.simulation_mission_progress for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users create their simulation missions"
  on public.simulation_mission_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users update their simulation missions"
  on public.simulation_mission_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users delete their simulation missions"
  on public.simulation_mission_progress for delete to authenticated
  using ((select auth.uid()) = user_id);

commit;
