-- Foudos access levels and Row Level Security.
--
--   general : view only (signed out, or signed in but revoked)
--   friend  : add recipes and drinks; edit and delete their own
--   family  : add, edit and delete anything
--
-- Anyone who signs up becomes a friend. To revoke someone, set their role to
-- 'general' (see docs/auth.md). Only an id and a role are stored per person;
-- the email address stays in Supabase's own auth system.
--
-- Roll back with supabase/rollbacks/20261029000000_roles_and_rls.down.sql.
-- A copy of the data from before this change is in schema backup_20261029.

-- ---------------------------------------------------------------
-- Helper schema (not exposed through the public API)
-- ---------------------------------------------------------------
create schema if not exists private;
grant usage on schema private to authenticated;

-- ---------------------------------------------------------------
-- profiles: one row per signed-in person
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'friend'
    check (role in ('general', 'friend', 'family')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ---------------------------------------------------------------
-- Role lookup used by the policies below
-- ---------------------------------------------------------------
create or replace function private.app_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.role from public.profiles p where p.id = (select auth.uid())),
    'general'
  );
$$;

revoke all on function private.app_role() from public, anon;
grant execute on function private.app_role() to authenticated;

-- ---------------------------------------------------------------
-- New sign-ups become friends automatically
-- ---------------------------------------------------------------
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Anyone who already exists gets a profile too.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------
-- profiles policies
-- ---------------------------------------------------------------
drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles: family reads all" on public.profiles;
create policy "profiles: family reads all"
  on public.profiles for select
  to authenticated
  using ((select private.app_role()) = 'family');

drop policy if exists "profiles: family changes roles" on public.profiles;
create policy "profiles: family changes roles"
  on public.profiles for update
  to authenticated
  using ((select private.app_role()) = 'family')
  with check ((select private.app_role()) = 'family');

-- ---------------------------------------------------------------
-- Ownership: who added each recipe or drink.
-- Existing rows stay empty, so only family can change them.
-- ---------------------------------------------------------------
alter table public.food   add column if not exists created_by uuid
  references auth.users (id) on delete set null;
alter table public.drinks add column if not exists created_by uuid
  references auth.users (id) on delete set null;

alter table public.food   alter column created_by set default auth.uid();
alter table public.drinks alter column created_by set default auth.uid();

create index if not exists food_created_by_idx   on public.food   (created_by);
create index if not exists drinks_created_by_idx on public.drinks (created_by);

-- ---------------------------------------------------------------
-- food and drinks policies (same rules for both)
-- ---------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['food', 'drinks'] loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists %I on public.%I', t || ': anyone can view', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || ': anyone can view', t
    );

    execute format('drop policy if exists %I on public.%I', t || ': friends and family can add', t);
    execute format(
      'create policy %I on public.%I for insert to authenticated
         with check (
           (select private.app_role()) in (''friend'', ''family'')
           and created_by = (select auth.uid())
         )',
      t || ': friends and family can add', t
    );

    execute format('drop policy if exists %I on public.%I', t || ': family or owner can edit', t);
    execute format(
      'create policy %I on public.%I for update to authenticated
         using (
           (select private.app_role()) = ''family''
           or ((select private.app_role()) = ''friend'' and created_by = (select auth.uid()))
         )
         with check (
           (select private.app_role()) = ''family''
           or ((select private.app_role()) = ''friend'' and created_by = (select auth.uid()))
         )',
      t || ': family or owner can edit', t
    );

    execute format('drop policy if exists %I on public.%I', t || ': family or owner can delete', t);
    execute format(
      'create policy %I on public.%I for delete to authenticated
         using (
           (select private.app_role()) = ''family''
           or ((select private.app_role()) = ''friend'' and created_by = (select auth.uid()))
         )',
      t || ': family or owner can delete', t
    );
  end loop;
end
$$;
