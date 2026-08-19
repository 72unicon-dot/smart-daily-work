drop policy if exists profiles_update_own on public.profiles;

create or replace function public.get_available_managers()
returns table(id uuid, name text, company text, department text, role public.app_role)
language sql
stable
security definer
set search_path=''
as $$
  select p.id, p.name, p.company, p.department, p.role
  from public.profiles p
  where p.role in ('leader'::public.app_role, 'admin'::public.app_role)
    and p.id <> (select auth.uid())
  order by p.company nulls last, p.department nulls last, p.name;
$$;

revoke all on function public.get_available_managers() from public;
grant execute on function public.get_available_managers() to authenticated;

create or replace function public.update_my_work_settings(p_department text, p_leader_id uuid)
returns void
language plpgsql
security definer
set search_path=''
as $$
declare
  v_uid uuid := (select auth.uid());
begin
  if v_uid is null then
    raise exception '로그인이 필요합니다.';
  end if;
  if length(trim(coalesce(p_department,''))) = 0 then
    raise exception '부서를 입력해 주세요.';
  end if;
  if p_leader_id is not null and not exists (
    select 1 from public.profiles p
    where p.id = p_leader_id
      and p.role in ('leader'::public.app_role, 'admin'::public.app_role)
      and p.id <> v_uid
  ) then
    raise exception '선택한 관리자를 확인할 수 없습니다.';
  end if;
  update public.profiles
  set department = trim(p_department),
      leader_id = p_leader_id,
      updated_at = now()
  where id = v_uid;
end;
$$;

revoke all on function public.update_my_work_settings(text,uuid) from public;
grant execute on function public.update_my_work_settings(text,uuid) to authenticated;
