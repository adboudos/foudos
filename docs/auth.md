# Foudos sign-in and access levels

| Level  | Who                                   | Can do                                              |
| ------ | ------------------------------------- | --------------------------------------------------- |
| General | Anyone, signed in or not              | View everything                                     |
| Friend | Anyone who signs in (the default)     | Add recipes and drinks; edit and delete their own   |
| Family | Promoted by hand                      | Add, edit and delete anything; change people's levels |

Sign-in is Google, with an emailed magic link as a backup. Only an id and a
level are stored per person (`public.profiles`). The email address stays in
Supabase's own auth system and is never copied into the site's tables. Please
keep sensitive information out of recipes and notes.

Permissions are enforced by Row Level Security in the database (see
`supabase/migrations`). The buttons hidden in the UI are cosmetic.

## Managing people

Run these in the Supabase SQL editor (or ask Claude to run them).

Promote someone to Family:

```sql
update public.profiles
set role = 'family'
where id = (select id from auth.users where email = 'person@example.com');
```

Revoke access (they can still view the site, but can't add or change anything):

```sql
update public.profiles
set role = 'general'
where id = (select id from auth.users where email = 'person@example.com');
```

Restore someone to Friend: set `role = 'friend'` the same way.

See everyone and their level:

```sql
select u.email, p.role, p.created_at
from public.profiles p
join auth.users u on u.id = p.id
order by p.created_at;
```

Fully remove a person: delete them under Authentication → Users in the
Supabase dashboard. Their recipes stay, and become editable by Family only.

## Rolling back

- Data from before sign-in was added: schema `backup_20261029` in the database.
- Undo the permissions change: `supabase/rollbacks/20261029000000_roles_and_rls.down.sql`.
  That turns Row Level Security off again, so use it only to recover.
