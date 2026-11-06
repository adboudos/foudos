-- Display names and contributor tagging.
--
-- public.members holds the one thing a person can edit about themselves: a
-- public display name. It is separate from public.profiles on purpose, because
-- profiles holds access levels that only Family may change.
--
-- No email address is stored here. The name is shown publicly as the
-- "Recipe by" credit, so the check below rejects '@' (emails) and angle
-- brackets, and the sign-up trigger never fills it from an email or Google name.
--
-- Roll back with supabase/rollbacks/20261105000000_member_display_names.down.sql.

create table if not exists public.members (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint members_display_name_valid check (
    display_name is null
    or (
      display_name = btrim(display_name)
      and char_length(display_name) between 2 and 40
      and display_name !~ '[@<>]'
    )
  )
);

alter table public.members enable row level security;

-- Names are public (they appear on recipes).
drop policy if exists "members: anyone can view" on public.members;
create policy "members: anyone can view"
  on public.members for select
  to anon, authenticated
  using (true);

drop policy if exists "members: add own" on public.members;
create policy "members: add own"
  on public.members for insert
  to authenticated
  with check (id = (select auth.uid()));

drop policy if exists "members: change own or family" on public.members;
create policy "members: change own or family"
  on public.members for update
  to authenticated
  using (id = (select auth.uid()) or (select private.app_role()) = 'family')
  with check (id = (select auth.uid()) or (select private.app_role()) = 'family');

-- Everyone who already exists gets an empty row (name chosen on /profile).
insert into public.members (id)
select id from auth.users
on conflict (id) do nothing;

-- New sign-ups get a profile (role) and an empty member row.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;

  insert into public.members (id) values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Keep updated_at fresh.
create or replace function private.touch_member()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists members_touch on public.members;
create trigger members_touch
  before update on public.members
  for each row execute function private.touch_member();

-- ---------------------------------------------------------------
-- Contributor tagging, enforced in the database so it can't be forged:
-- when a recipe has an owner (created_by) who has a display name, the
-- contributor text always equals that name. Rows without an owner keep
-- their old free-text contributor.
-- ---------------------------------------------------------------
create or replace function private.tag_contributor()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_name text;
begin
  if new.created_by is not null then
    select m.display_name into owner_name
    from public.members m
    where m.id = new.created_by;

    if owner_name is not null then
      new.contributor = owner_name;
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.tag_contributor() from public, anon, authenticated;

drop trigger if exists food_tag_contributor on public.food;
create trigger food_tag_contributor
  before insert or update on public.food
  for each row execute function private.tag_contributor();

drop trigger if exists drinks_tag_contributor on public.drinks;
create trigger drinks_tag_contributor
  before insert or update on public.drinks
  for each row execute function private.tag_contributor();

-- When someone renames themselves, their recipes follow.
create or replace function private.sync_contributor_name()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.display_name is not null
     and new.display_name is distinct from old.display_name then
    update public.food   set contributor = new.display_name where created_by = new.id;
    update public.drinks set contributor = new.display_name where created_by = new.id;
  end if;

  return new;
end;
$$;

revoke all on function private.sync_contributor_name() from public, anon, authenticated;

drop trigger if exists members_sync_contributor on public.members;
create trigger members_sync_contributor
  after update on public.members
  for each row execute function private.sync_contributor_name();
