import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:cors});
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL")!, serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
 const publicKey=Deno.env.get("SUPABASE_ANON_KEY")??Deno.env.get("SUPABASE_PUBLISHABLE_KEY")??"";
 const auth=req.headers.get("Authorization")??"";
 if(!auth.startsWith("Bearer ")||!publicKey)return json({error:"Unauthorized"},401);
 const who=await fetch(url+"/auth/v1/user",{headers:{apikey:publicKey,Authorization:auth}});
 if(!who.ok)return json({error:"Invalid session"},401);
 const caller=await who.json();
 if(caller?.app_metadata?.role!=="super_admin")return json({error:"Forbidden"},403);
 let b:any;try{b=await req.json()}catch{return json({error:"Invalid JSON"},400)}
 const {target_user_id,service_key,action,reason}=b??{};
 const actions=["approve_access","reject_access","revoke_access","suspend_account","reactivate_account"];
 if(!target_user_id||!actions.includes(action))return json({error:"Invalid request"},400);
 if(["approve_access","reject_access","revoke_access"].includes(action)&&!["yuosant_ai","yuosant_finlab"].includes(service_key))return json({error:"Invalid service"},400);
 const h={apikey:serviceKey,Authorization:"Bearer "+serviceKey,"Content-Type":"application/json",Prefer:"return=representation"};
 const rest=(p:string,i:RequestInit={})=>fetch(url+"/rest/v1/"+p,{...i,headers:{...h,...(i.headers??{})}});
 if(action==="suspend_account"||action==="reactivate_account"){
  const q=await rest("yuosant_profiles?auth_user_id=eq."+encodeURIComponent(target_user_id)+"&select=account_status");
  const old=await q.json();if(!q.ok||!old?.length)return json({error:"Profile not found"},404);
  const status=action==="suspend_account"?"suspended":"active";
  const u=await rest("yuosant_profiles?auth_user_id=eq."+encodeURIComponent(target_user_id),{method:"PATCH",body:JSON.stringify({account_status:status,updated_at:new Date().toISOString()})});
  if(!u.ok)return json({error:"Account update failed"},500);
  const a=await rest("yuosant_admin_audit_log",{method:"POST",body:JSON.stringify({actor_auth_user_id:caller.id,target_auth_user_id:target_user_id,action,old_value:old[0],new_value:{account_status:status},reason:reason??null})});
  if(!a.ok)return json({error:"Account changed but audit write failed"},500);
  return json({success:true,account_status:status});
 }
 const q=await rest("yuosant_service_access?auth_user_id=eq."+encodeURIComponent(target_user_id)+"&service_key=eq."+service_key+"&select=*");
 const old=await q.json();if(!q.ok||!old?.length)return json({error:"Access request not found"},404);
 const status=action==="approve_access"?"approved":action==="reject_access"?"rejected":"revoked";
 const u=await rest("yuosant_service_access?auth_user_id=eq."+encodeURIComponent(target_user_id)+"&service_key=eq."+service_key,{method:"PATCH",body:JSON.stringify({request_status:status,decided_at:new Date().toISOString(),decided_by:caller.id,decision_reason:reason??null})});
 const updated=await u.json();if(!u.ok||!updated?.length)return json({error:"Access update failed"},500);
 const a=await rest("yuosant_admin_audit_log",{method:"POST",body:JSON.stringify({actor_auth_user_id:caller.id,target_auth_user_id:target_user_id,service_key,action,old_value:old[0],new_value:{request_status:status},reason:reason??null})});
 if(!a.ok)return json({error:"Access changed but audit write failed"},500);
 return json({success:true,request_status:status});
});