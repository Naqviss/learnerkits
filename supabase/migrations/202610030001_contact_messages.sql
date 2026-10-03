-- Apply once in the Supabase SQL Editor or with `supabase db push`.
begin;
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  topic text not null check (topic in ('General question', 'Technical problem', 'Science correction', 'Accessibility', 'Privacy request', 'Classroom use', 'Donation support', 'Partnership or licensing')),
  message text not null check (char_length(message) between 20 and 5000),
  locale text not null check (locale in ('en', 'es', 'zh', 'ar', 'pt', 'fr', 'ru', 'ja', 'de')),
  privacy_policy_version text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed'))
);
create index contact_messages_email_created_idx on public.contact_messages (email, created_at);
alter table public.contact_messages enable row level security;
revoke all on public.contact_messages from anon, authenticated;
grant select, insert, update, delete on public.contact_messages to service_role;

-- A transaction-level lock makes the per-email limit work across server instances.
-- Only the trusted server key may call this function; there are no public write policies.
create function public.submit_contact_message(p_name text, p_email text, p_topic text, p_message text, p_locale text, p_policy_version text)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare message_id uuid;
begin
  perform pg_advisory_xact_lock(hashtextextended(lower(trim(p_email)), 0));
  if (select count(*) from public.contact_messages where email = lower(trim(p_email)) and created_at > now() - interval '15 minutes') >= 3 then
    raise sqlstate 'PT429' using message = 'Contact rate limit exceeded';
  end if;
  insert into public.contact_messages (name, email, topic, message, locale, privacy_policy_version)
    values (trim(p_name), lower(trim(p_email)), p_topic, trim(p_message), p_locale, p_policy_version)
    returning id into message_id;
  return message_id;
end;
$$;
revoke all on function public.submit_contact_message(text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_contact_message(text, text, text, text, text, text) to service_role;
commit;
