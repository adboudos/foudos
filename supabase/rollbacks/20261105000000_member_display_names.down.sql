-- Undo 20261105000000_member_display_names.sql.
-- Recipes keep whatever contributor text they have at the moment of rollback.
-- Restores the sign-up trigger to its earlier version (profiles only).

drop trigger if exists food_tag_contributor on public.food;
drop trigger if exists drinks_tag_contributor on public.drinks;
drop trigger if exists members_sync_contributor on public.members;
drop trigger if exists members_touch on public.members;

drop function if exists private.tag_contributor();
drop function if exists private.sync_contributor_name();
drop function if exists private.touch_member();

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

drop policy if exists "members: anyone can view" on public.members;
drop policy if exists "members: add own" on public.members;
drop policy if exists "members: change own or family" on public.members;
drop table if exists public.members;
