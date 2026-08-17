create index attachments_user_id_idx on public.report_attachments(user_id);
create index feedback_reviewer_id_idx on public.report_feedback(reviewer_id);
create index notifications_report_id_idx on public.in_app_notifications(report_id) where report_id is not null;
drop policy reports_update_own on public.daily_reports;
drop policy reports_review_management on public.daily_reports;
create policy reports_update_scope on public.daily_reports for update to authenticated using((user_id=(select auth.uid()) and status in ('draft','revision_requested')) or (private.can_review(user_id) and status='submitted')) with check((user_id=(select auth.uid()) and status in ('draft','submitted')) or (private.can_review(user_id) and status in ('revision_requested','approved')));
create function private.notify_report_status() returns trigger language plpgsql security definer set search_path='' as $$begin if new.status is distinct from old.status then if new.status='submitted' then insert into public.in_app_notifications(user_id,title,message,report_id) select p.leader_id,'제출 완료',new.title||' 보고서가 제출되었습니다.',new.id from public.profiles p where p.id=new.user_id and p.leader_id is not null; elsif new.status='revision_requested' then insert into public.in_app_notifications(user_id,title,message,report_id) values(new.user_id,'보완 요청',new.title||' 보고서에 보완 요청이 있습니다.',new.id); elsif new.status='approved' then insert into public.in_app_notifications(user_id,title,message,report_id) values(new.user_id,'승인 완료',new.title||' 보고서가 승인되었습니다.',new.id); end if; end if; return new; end;$$;
revoke all on function private.notify_report_status() from public;
create trigger on_report_status_changed after update of status on public.daily_reports for each row execute function private.notify_report_status();
