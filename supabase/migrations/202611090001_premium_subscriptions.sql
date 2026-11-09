-- LearnerKits Premium: Paddle subscriptions and AI tutor usage.
-- Apply once in the Supabase SQL Editor (after enabling Google sign-in) or with `supabase db push`.
begin;

-- One row per Paddle subscription (sub_...). A user who cancels and later re-subscribes gets a new
-- row, so an old subscription's late events can never overwrite a newer one.
create table public.subscriptions (
  provider_subscription_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  provider_customer_id text,
  provider_price_id text,
  status text not null check (status in ('active', 'trialing', 'past_due', 'paused', 'canceled')),
  renews_at timestamptz,
  ends_at timestamptz,
  provider_updated_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index subscriptions_user_id_idx on public.subscriptions (user_id);
alter table public.subscriptions enable row level security;
revoke all on public.subscriptions from anon, authenticated;
-- Signed-in users may read only their own rows (the browser uses this to show Premium status).
grant select on public.subscriptions to authenticated;
create policy subscriptions_select_own on public.subscriptions for select to authenticated using ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.subscriptions to service_role;

-- Called only by the verified Paddle webhook (server key). Ignores events older than the stored
-- state, because webhooks can arrive out of order. With no user id (custom data missing), it only
-- updates a subscription that is already known.
create function public.upsert_subscription(
  p_subscription_id text, p_user_id uuid, p_customer_id text, p_price_id text,
  p_status text, p_renews_at timestamptz, p_ends_at timestamptz, p_updated_at timestamptz
) returns void language plpgsql security invoker set search_path = '' as $$
begin
  if p_user_id is null then
    update public.subscriptions
      set status = p_status, renews_at = p_renews_at, ends_at = p_ends_at, provider_updated_at = p_updated_at
      where provider_subscription_id = p_subscription_id and provider_updated_at <= p_updated_at;
    return;
  end if;
  insert into public.subscriptions as s (provider_subscription_id, user_id, provider_customer_id, provider_price_id, status, renews_at, ends_at, provider_updated_at)
    values (p_subscription_id, p_user_id, p_customer_id, p_price_id, p_status, p_renews_at, p_ends_at, p_updated_at)
  on conflict (provider_subscription_id) do update
    set provider_customer_id = excluded.provider_customer_id, provider_price_id = excluded.provider_price_id,
        status = excluded.status, renews_at = excluded.renews_at, ends_at = excluded.ends_at,
        provider_updated_at = excluded.provider_updated_at
    where s.provider_updated_at <= excluded.provider_updated_at;
end;
$$;
revoke all on function public.upsert_subscription(text, uuid, text, text, text, timestamptz, timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.upsert_subscription(text, uuid, text, text, text, timestamptz, timestamptz, timestamptz) to service_role;

-- Daily AI tutor request counts (UTC days), used to cap cost per subscriber. Questions and
-- answers themselves are not stored.
create table public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  requests integer not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon, authenticated;
grant select, insert, update, delete on public.ai_usage to service_role;

-- Atomically counts one request; returns false once the daily limit is reached.
create function public.consume_ai_request(p_user_id uuid, p_daily_limit integer)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare used integer;
begin
  if p_daily_limit < 1 then return false; end if;
  insert into public.ai_usage as u (user_id, day, requests)
    values (p_user_id, (now() at time zone 'utc')::date, 1)
  on conflict (user_id, day) do update set requests = u.requests + 1
    where u.requests < p_daily_limit
  returning u.requests into used;
  return used is not null;
end;
$$;
revoke all on function public.consume_ai_request(uuid, integer) from public, anon, authenticated;
grant execute on function public.consume_ai_request(uuid, integer) to service_role;

commit;
