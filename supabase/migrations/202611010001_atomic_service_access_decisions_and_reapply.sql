create or replace function public.admin_manage_service_access(
  p_target_user_id uuid, p_service_key text, p_action text, p_reason text default null
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_actor uuid := auth.uid();
  v_role text;
  v_old public.yuosant_service_access%rowtype;
  v_new public.yuosant_service_access%rowtype;
  v_status text;
begin
  if v_actor is null then raise exception 'Unauthorized' using errcode = '42501'; end if;
  select coalesce(raw_app_meta_data->>'role','') into v_role from auth.users where id = v_actor;
  if v_role <> 'super_admin' then raise exception 'Forbidden' using errcode = '42501'; end if;
  if p_target_user_id is null or p_service_key not in ('yuosant_ai','yuosant_finlab')
     or p_action not in ('approve_access','reject_access','revoke_access') then
    raise exception 'Invalid request' using errcode = '22023';
  end if;
  select * into v_old from public.yuosant_service_access
   where auth_user_id = p_target_user_id and service_key = p_service_key for update;
  if not found then raise exception 'Access request not found' using errcode = 'P0002'; end if;
  if p_action in ('approve_access','reject_access') and v_old.request_status <> 'pending' then
    raise exception 'Only pending requests can be approved or rejected' using errcode = '55000';
  elsif p_action = 'revoke_access' and v_old.request_status <> 'approved' then
    raise exception 'Only approved access can be revoked' using errcode = '55000';
  end if;
  v_status := case p_action when 'approve_access' then 'approved' when 'reject_access' then 'rejected' else 'revoked' end;
  update public.yuosant_service_access set request_status=v_status,decided_at=now(),decided_by=v_actor,
    decision_reason=nullif(btrim(coalesce(p_reason,'')),'') where id=v_old.id returning * into v_new;
  insert into public.yuosant_admin_audit_log(actor_auth_user_id,target_auth_user_id,service_key,action,old_value,new_value,reason)
  values(v_actor,p_target_user_id,p_service_key,p_action,to_jsonb(v_old),to_jsonb(v_new),nullif(btrim(coalesce(p_reason,'')),''));
  return jsonb_build_object('success',true,'request_status',v_new.request_status,'decided_at',v_new.decided_at);
end; $$;
revoke all on function public.admin_manage_service_access(uuid,text,text,text) from public,anon;
grant execute on function public.admin_manage_service_access(uuid,text,text,text) to authenticated;

create or replace function public.request_service_access(p_service_key text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid(); v_profile_status text; v_email_confirmed timestamptz;
  v_row public.yuosant_service_access%rowtype;
begin
  if v_user is null then raise exception 'Unauthorized' using errcode = '42501'; end if;
  if p_service_key not in ('yuosant_ai','yuosant_finlab') then raise exception 'Invalid service' using errcode = '22023'; end if;
  select p.account_status,u.email_confirmed_at into v_profile_status,v_email_confirmed
  from public.yuosant_profiles p join auth.users u on u.id=p.auth_user_id where p.auth_user_id=v_user;
  if not found then raise exception 'Account profile not found' using errcode = 'P0002'; end if;
  if v_profile_status <> 'active' then raise exception 'Account is not active' using errcode = '55000'; end if;
  if v_email_confirmed is null then raise exception 'Email verification required' using errcode = '55000'; end if;
  select * into v_row from public.yuosant_service_access
   where auth_user_id=v_user and service_key=p_service_key for update;
  if not found then
    insert into public.yuosant_service_access(auth_user_id,service_key,request_status)
    values(v_user,p_service_key,'pending') returning * into v_row;
  elsif v_row.request_status in ('rejected','revoked') then
    update public.yuosant_service_access set request_status='pending',requested_at=now(),
      decided_at=null,decided_by=null,decision_reason=null where id=v_row.id returning * into v_row;
  else
    raise exception 'A request is already pending or access is already approved' using errcode = '55000';
  end if;
  return jsonb_build_object('success',true,'request_status',v_row.request_status,'requested_at',v_row.requested_at);
end; $$;
revoke all on function public.request_service_access(text) from public,anon;
grant execute on function public.request_service_access(text) to authenticated;
