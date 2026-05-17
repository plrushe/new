create extension if not exists pgcrypto;

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date date not null,
  calorie_limit_met boolean default false,
  gym_completed boolean default false,
  steps_completed boolean default false,
  is_successful boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, entry_date)
);

alter table public.daily_entries enable row level security;

create policy "Users can view own entries"
  on public.daily_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.daily_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.daily_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.daily_entries for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_daily_entries_updated_at on public.daily_entries;
create trigger trg_daily_entries_updated_at
before update on public.daily_entries
for each row execute function public.set_updated_at();
