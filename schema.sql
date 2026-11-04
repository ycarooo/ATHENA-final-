-- Execute no SQL Editor do Supabase. Auth usa email + senha.
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  notes text default '',
  task_date date not null,
  task_time time,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  mood text not null default '🌷',
  content text not null default '',
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.tasks enable row level security;
alter table public.diary_entries enable row level security;
create policy "own tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own diary" on public.diary_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Storage > Create bucket: diary-images (Private). Policies:
create policy "Users upload own diary images" on storage.objects for insert to authenticated with check (bucket_id = 'diary-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users read own diary images" on storage.objects for select to authenticated using (bucket_id = 'diary-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users delete own diary images" on storage.objects for delete to authenticated using (bucket_id = 'diary-images' and (storage.foldername(name))[1] = auth.uid()::text);
