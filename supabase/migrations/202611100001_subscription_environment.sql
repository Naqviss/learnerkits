-- Record whether each subscription came from Paddle's sandbox (test cards) or live mode, so test
-- subscriptions never grant Premium once the site switches to real payments (PADDLE_TEST_MODE=false).
-- Apply in the Supabase SQL Editor BEFORE deploying the code that uses it.
begin;

alter table public.subscriptions add column environment text not null default 'sandbox'
  check (environment in ('sandbox', 'live'));
-- Every subscription recorded before this migration came from the Paddle sandbox.
alter table public.subscriptions alter column environment drop default;
create index subscriptions_user_environment_idx on public.subscriptions (user_id, environment);

drop function public.upsert_subscription(text, uuid, text, text, text, timestamptz, timestamptz, timestamptz);

create function public.upsert_subscription(
  p_environment text, p_subscription_id text, p_user_id uuid, p_customer_id text, p_price_id text,
  p_status text, p_renews_at timestamptz, p_ends_at timestamptz, p_updated_at timestamptz
) returns void language plpgsql security invoker set search_path = '' as $$
begin
  if p_user_id is null then
    update public.subscriptions
      set status = p_status, renews_at = p_renews_at, ends_at = p_ends_at, provider_updated_at = p_updated_at
      where provider_subscription_id = p_subscription_id and environment = p_environment
        and provider_updated_at <= p_updated_at;
    return;
  end if;
  insert into public.subscriptions as s (environment, provider_subscription_id, user_id, provider_customer_id, provider_price_id, status, renews_at, ends_at, provider_updated_at)
    values (p_environment, p_subscription_id, p_user_id, p_customer_id, p_price_id, p_status, p_renews_at, p_ends_at, p_updated_at)
  on conflict (provider_subscription_id) do update
    set provider_customer_id = excluded.provider_customer_id, provider_price_id = excluded.provider_price_id,
        status = excluded.status, renews_at = excluded.renews_at, ends_at = excluded.ends_at,
        provider_updated_at = excluded.provider_updated_at
    where s.environment = excluded.environment and s.provider_updated_at <= excluded.provider_updated_at;
end;
$$;
revoke all on function public.upsert_subscription(text, text, uuid, text, text, text, timestamptz, timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.upsert_subscription(text, text, uuid, text, text, text, timestamptz, timestamptz, timestamptz) to service_role;

commit;
