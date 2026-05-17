create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  display_name text not null,
  created_at timestamptz default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  starts_on date,
  ends_on date,
  created_at timestamptz default now()
);

create table if not exists public.challenge_members (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  joined_at timestamptz default now(),
  unique(challenge_id, user_id)
);

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date not null,
  calorie_limit_met boolean default false,
  gym_completed boolean default false,
  steps_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, entry_date)
);

alter table public.profiles enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_members enable row level security;
alter table public.daily_entries enable row level security;

create policy "Users can read their own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can read profiles in shared challenge" on public.profiles for select using (
  exists (
    select 1 from public.challenge_members mine
    join public.challenge_members theirs on mine.challenge_id = theirs.challenge_id
    where mine.user_id = auth.uid() and theirs.user_id = profiles.user_id
  )
);
create policy "Users can upsert their own profile" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can create challenge" on public.challenges for insert with check (auth.uid() = created_by);
create policy "Users can read own challenges" on public.challenges for select using (
  exists (select 1 from public.challenge_members cm where cm.challenge_id = challenges.id and cm.user_id = auth.uid())
);

create policy "Users can read challenge members in their challenges" on public.challenge_members for select using (
  exists (select 1 from public.challenge_members mine where mine.challenge_id = challenge_members.challenge_id and mine.user_id = auth.uid())
);
create policy "Users can join challenge by code if space available" on public.challenge_members for insert with check (
  auth.uid() = user_id and (
    select count(*) from public.challenge_members cm where cm.challenge_id = challenge_members.challenge_id
  ) < 2
);

create policy "Users can select own/shared entries" on public.daily_entries for select using (
  auth.uid() = user_id or exists (
    select 1
    from public.challenge_members mine
    join public.challenge_members theirs on mine.challenge_id = theirs.challenge_id
    where mine.user_id = auth.uid() and theirs.user_id = daily_entries.user_id
  )
);
create policy "Users can insert their own entries" on public.daily_entries for insert with check (auth.uid() = user_id);
create policy "Users can update their own entries" on public.daily_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own entries" on public.daily_entries for delete using (auth.uid() = user_id);

create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_daily_entries_updated_at on public.daily_entries;
create trigger trg_daily_entries_updated_at before update on public.daily_entries for each row execute function public.set_updated_at();
