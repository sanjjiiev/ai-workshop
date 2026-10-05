-- ─────────────────────────────────────────────────────────────────────────────
-- NxtWave AI Workshop · Initial Schema
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Registrations ───────────────────────────────────────────────────────────
create table if not exists public.registrations (
  id                  uuid        primary key default uuid_generate_v4(),
  name                text        not null,
  email               text        unique not null,
  phone               text        not null,
  college             text        not null,
  year                text        not null
                      check (year in ('1st Year','2nd Year','3rd Year','4th Year','Post-Graduate')),
  track               text        not null
                      check (track in ('chatbot','vision','generator','automation')),
  referral_code       text        unique not null,
  referred_by         text        references public.registrations(referral_code) on update cascade on delete set null,
  ai_welcome_message  text,
  ip_address          text,
  user_agent          text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Indexes for fast lookups
create index if not exists idx_registrations_referral_code on public.registrations(referral_code);
create index if not exists idx_registrations_referred_by   on public.registrations(referred_by);
create index if not exists idx_registrations_email         on public.registrations(email);
create index if not exists idx_registrations_created_at    on public.registrations(created_at desc);

-- ─── Workshop Config ──────────────────────────────────────────────────────────
create table if not exists public.workshop_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

insert into public.workshop_config (key, value) values
  ('total_seats',    '500'),
  ('workshop_date',  'Saturday, 18 Oct 2026'),
  ('workshop_time',  '7:00 PM IST'),
  ('workshop_topic', 'Build Your First AI Project in 60 Minutes'),
  ('registration_open', 'true')
on conflict (key) do nothing;

-- ─── Auto-updated timestamp trigger ─────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger set_updated_at
  before update on public.registrations
  for each row execute function public.handle_updated_at();

-- ─── Leaderboard Function ────────────────────────────────────────────────────
create or replace function public.get_leaderboard(limit_count int default 10)
returns table (
  referral_code  text,
  name           text,
  college        text,
  referral_count bigint
) language sql security definer stable as $$
  select
    r.referral_code,
    r.name,
    r.college,
    count(r2.id) as referral_count
  from public.registrations r
  left join public.registrations r2 on r2.referred_by = r.referral_code
  group by r.referral_code, r.name, r.college
  having count(r2.id) > 0
  order by referral_count desc
  limit limit_count;
$$;

-- ─── Referral Stats Function ─────────────────────────────────────────────────
create or replace function public.get_referral_stats(p_code text)
returns table (
  total_referred bigint,
  rank           bigint
) language sql security definer stable as $$
  with counts as (
    select
      r.referral_code,
      count(r2.id) as cnt
    from public.registrations r
    left join public.registrations r2 on r2.referred_by = r.referral_code
    group by r.referral_code
  ),
  ranked as (
    select referral_code, cnt,
           rank() over (order by cnt desc) as rnk
    from counts
  )
  select cnt as total_referred, rnk as rank
  from ranked
  where referral_code = p_code;
$$;

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table public.registrations    enable row level security;
alter table public.workshop_config  enable row level security;

-- Public read access for workshop_config
create policy "Public read config"
  on public.workshop_config for select to anon using (true);

-- Anyone can register (insert)
create policy "Anyone can register"
  on public.registrations for insert to anon with check (true);

-- Public can read non-sensitive columns (for leaderboard/referral lookup)
create policy "Public read registrations"
  on public.registrations for select to anon using (true);

-- Service role has full access
create policy "Service role full access registrations"
  on public.registrations for all to service_role using (true) with check (true);

create policy "Service role full access config"
  on public.workshop_config for all to service_role using (true) with check (true);
