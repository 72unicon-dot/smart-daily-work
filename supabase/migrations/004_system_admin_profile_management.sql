drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
for update to authenticated
using (private."current_role"() = 'admin'::public.app_role)
with check (private."current_role"() = 'admin'::public.app_role);
