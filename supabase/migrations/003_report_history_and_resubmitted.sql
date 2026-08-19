alter type public.report_status add value if not exists 'resubmitted' after 'revision_requested';

create table if not exists public.report_history (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.daily_reports(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  previous_status public.report_status,
  new_status public.report_status not null,
  action text not null,
  created_at timestamptz not null default now()
);

alter table public.report_history enable row level security;

drop policy if exists report_history_select_scope on public.report_history;
create policy report_history_select_scope on public.report_history
for select to authenticated
using (
  exists (
    select 1 from public.daily_reports r
    where r.id = report_history.report_id
      and (r.user_id = (select auth.uid()) or private.can_review(r.user_id))
  )
);

create or replace function private.log_report_history()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
begin
  if new.status is distinct from old.status then
    insert into public.report_history(report_id, actor_id, previous_status, new_status, action)
    values(new.id, (select auth.uid()), old.status, new.status,
      case new.status
        when 'submitted' then 'submitted'
        when 'revision_requested' then 'revision_requested'
        when 'resubmitted' then 'resubmitted'
        when 'approved' then 'approved'
        else 'status_changed'
      end
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_report_history_changed on public.daily_reports;
create trigger on_report_history_changed
after update of status on public.daily_reports
for each row execute function private.log_report_history();

create or replace function private.notify_report_status()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
begin
  if new.status is distinct from old.status then
    if new.status in ('submitted','resubmitted') then
      insert into public.in_app_notifications(user_id,title,message,report_id)
      select p.leader_id,
        case when new.status='resubmitted' then '재제출 완료' else '제출 완료' end,
        new.title || case when new.status='resubmitted' then ' 보고서가 재제출되었습니다.' else ' 보고서가 제출되었습니다.' end,
        new.id
      from public.profiles p where p.id=new.user_id and p.leader_id is not null;
    elsif new.status='revision_requested' then
      insert into public.in_app_notifications(user_id,title,message,report_id)
      values(new.user_id,'보완 요청',new.title||' 보고서에 보완 요청이 있습니다.',new.id);
    elsif new.status='approved' then
      insert into public.in_app_notifications(user_id,title,message,report_id)
      values(new.user_id,'승인 완료',new.title||' 보고서가 승인되었습니다.',new.id);
    end if;
  end if;
  return new;
end;
$$;

drop policy if exists reports_insert_own on public.daily_reports;
create policy reports_insert_own on public.daily_reports
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and status in ('draft','submitted','resubmitted')
);

drop policy if exists reports_update_scope on public.daily_reports;
create policy reports_update_scope on public.daily_reports
for update to authenticated
using (
  (user_id = (select auth.uid()) and status in ('draft','revision_requested'))
  or (private.can_review(user_id) and status in ('submitted','resubmitted'))
)
with check (
  (user_id = (select auth.uid()) and status in ('draft','submitted','resubmitted'))
  or (private.can_review(user_id) and status in ('revision_requested','approved'))
);
