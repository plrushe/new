create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  display_name text not null,
  created_at timestamptz default now()
);

create table if not exists public.leaderboards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

create table if not exists public.leaderboard_members (
  id uuid primary key default gen_random_uuid(),
  leaderboard_id uuid references public.leaderboards(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  joined_at timestamptz default now(),
  unique(leaderboard_id, user_id)
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
alter table public.leaderboards enable row level security;
alter table public.leaderboard_members enable row level security;
alter table public.daily_entries enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can read profiles in shared leaderboards" on public.profiles for select using (
  exists (
    select 1 from public.leaderboard_members me
    join public.leaderboard_members other on other.leaderboard_id = me.leaderboard_id
    where me.user_id = auth.uid() and other.user_id = profiles.user_id
  )
);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can create leaderboards" on public.leaderboards for insert with check (auth.uid() = created_by);
create policy "Users can read own leaderboards" on public.leaderboards for select using (
  exists (select 1 from public.leaderboard_members m where m.leaderboard_id = leaderboards.id and m.user_id = auth.uid())
);

create policy "Users can read membership in own leaderboards" on public.leaderboard_members for select using (
  exists (select 1 from public.leaderboard_members me where me.leaderboard_id = leaderboard_members.leaderboard_id and me.user_id = auth.uid())
);
create policy "Users can join leaderboard" on public.leaderboard_members for insert with check (auth.uid() = user_id);

create policy "Users can select own entries and leaderboard members" on public.daily_entries for select using (
  auth.uid() = user_id or exists (
    select 1 from public.leaderboard_members me
    join public.leaderboard_members other on other.leaderboard_id = me.leaderboard_id
    where me.user_id = auth.uid() and other.user_id = daily_entries.user_id
  )
);
create policy "Users can insert their own entries" on public.daily_entries for insert with check (auth.uid() = user_id);
create policy "Users can update their own entries" on public.daily_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own entries" on public.daily_entries for delete using (auth.uid() = user_id);

create or replace function public.get_leaderboard_results(target_leaderboard_id uuid, date_from date default null, date_to date default null)
returns table (user_id uuid, display_name text, completed_days bigint, rank bigint)
language sql
security definer
set search_path = public
as $$
  with rows as (
    select lm.user_id,
      p.display_name,
      lm.joined_at,
      count(de.*) filter (
        where de.calorie_limit_met = true
        and (de.gym_completed = true or de.steps_completed = true)
        and (date_from is null or de.entry_date >= date_from)
        and (date_to is null or de.entry_date <= date_to)
      ) as completed_days
    from leaderboard_members lm
    join profiles p on p.user_id = lm.user_id
    left join daily_entries de on de.user_id = lm.user_id
    where lm.leaderboard_id = target_leaderboard_id
      and exists (select 1 from leaderboard_members me where me.leaderboard_id = target_leaderboard_id and me.user_id = auth.uid())
    group by lm.user_id, p.display_name, lm.joined_at
  )
  select rows.user_id, rows.display_name, rows.completed_days,
    row_number() over (order by rows.completed_days desc, rows.joined_at asc) as rank
  from rows;
$$;

grant execute on function public.get_leaderboard_results(uuid, date, date) to authenticated;

create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_daily_entries_updated_at on public.daily_entries;
create trigger trg_daily_entries_updated_at before update on public.daily_entries for each row execute function public.set_updated_at();
