-- ============================================================
-- CLEANSNAP APP — Supabase Schema
-- Run this in Supabase → SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default now()
);

-- 2. REPORTS TABLE
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer not null check (age > 0 and age < 121),
  gender text not null check (gender in ('Male', 'Female', 'Other')),
  description text not null,
  latitude float not null,
  longitude float not null,
  image_url text,
  status text not null default 'pending' check (status in ('pending', 'found', 'closed')),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.reports  enable row level security;

-- PROFILES POLICIES
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Admin can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- REPORTS POLICIES
create policy "Users can insert own reports"
  on public.reports for insert
  with check (auth.uid() = user_id);

create policy "Users can read own reports"
  on public.reports for select
  using (auth.uid() = user_id);

create policy "Admin can read all reports"
  on public.reports for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admin can update report status"
  on public.reports for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================
-- STORAGE BUCKET
-- ============================================================

insert into storage.buckets (id, name, public)
  values ('report-images', 'report-images', true)
  on conflict (id) do nothing;

create policy "Users can upload report images"
  on storage.objects for insert
  with check (bucket_id = 'report-images' and auth.uid() is not null);

create policy "Public read access to report images"
  on storage.objects for select
  using (bucket_id = 'report-images');

-- ============================================================
-- SEED: Create first admin (run AFTER registering your account)
-- Replace the email below with your admin email
-- ============================================================

-- update public.profiles set role = 'admin' where email = 'admin@yourdomain.com';
