create extension if not exists pgcrypto;

create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can select their own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

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

alter table public.daily_entries enable row level security;

create policy "Users can select their own entries" on public.daily_entries for select using (auth.uid() = user_id);
create policy "Users can insert their own entries" on public.daily_entries for insert with check (auth.uid() = user_id);
create policy "Users can update their own entries" on public.daily_entries for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own entries" on public.daily_entries for delete using (auth.uid() = user_id);

drop trigger if exists trg_daily_entries_updated_at on public.daily_entries;
create trigger trg_daily_entries_updated_at before update on public.daily_entries for each row execute function public.set_updated_at();

create or replace function public.get_site_leaderboard()
returns table (
  user_id uuid,
  display_name text,
  completed_days integer,
  rank integer,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  with completed as (
    select
      p.user_id,
      coalesce(nullif(trim(p.display_name), ''), 'Anonymous') as display_name,
      p.created_at,
      count(d.id) filter (
        where d.calorie_limit_met = true
        and (d.gym_completed = true or d.steps_completed = true)
      )::integer as completed_days
    from public.profiles p
    left join public.daily_entries d on d.user_id = p.user_id
    group by p.user_id, p.display_name, p.created_at
  )
  select
    user_id,
    display_name,
    completed_days,
    row_number() over (order by completed_days desc, created_at asc)::integer as rank,
    created_at
  from completed
  order by completed_days desc, created_at asc;
$$;

grant execute on function public.get_site_leaderboard() to authenticated;
