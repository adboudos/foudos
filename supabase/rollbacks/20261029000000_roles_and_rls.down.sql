-- Undo 20261029000000_roles_and_rls.sql.
--
-- WARNING: this turns Row Level Security back OFF on food and drinks, which
-- returns the tables to their original state where anyone holding the public
-- key can change any row. Only use it if sign-in is broken and you plan to
-- fix it right away.
--
-- It does NOT touch your data rows, except that it drops the created_by
-- column (ownership information). A full copy of food and drinks from before
-- the change lives in schema backup_20261029.

do $$
declare
  t text;
begin
  foreach t in array array['food', 'drinks'] loop
    execute format('drop policy if exists %I on public.%I', t || ': anyone can view', t);
    execute format('drop policy if exists %I on public.%I', t || ': friends and family can add', t);
    execute format('drop policy if exists %I on public.%I', t || ': family or owner can edit', t);
    execute format('drop policy if exists %I on public.%I', t || ': family or owner can delete', t);
    execute format('alter table public.%I disable row level security', t);
  end loop;
end
$$;

drop index if exists public.food_created_by_idx;
drop index if exists public.drinks_created_by_idx;
alter table public.food   drop column if exists created_by;
alter table public.drinks drop column if exists created_by;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists private.handle_new_user();

drop policy if exists "profiles: read own" on public.profiles;
drop policy if exists "profiles: family reads all" on public.profiles;
drop policy if exists "profiles: family changes roles" on public.profiles;
drop table if exists public.profiles;

drop function if exists private.app_role();
