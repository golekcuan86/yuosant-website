import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:cors});
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL")??"",serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")??"";
 const publicKey=Deno.env.get("SUPABASE_ANON_KEY")??Deno.env.get("SUPABASE_PUBLISHABLE_KEY")??"";
 const authorization=req.headers.get("Authorization")??"";
 if(!url||!serviceKey||!publicKey||!authorization.startsWith("Bearer "))return json({error:"Unauthorized"},401);
 const who=await fetch(url+"/auth/v1/user",{headers:{apikey:publicKey,Authorization:authorization}});
 if(!who.ok)return json({error:"Invalid session"},401);
 const caller=await who.json();
 if(caller?.app_metadata?.role!=="super_admin")return json({error:"Forbidden"},403);
 let b:any;try{b=await req.json()}catch{return json({error:"Invalid JSON"},400)}
 const {target_user_id,service_key,action,reason}=b??{};
 const actions=["approve_access","reject_access","revoke_access","suspend_account","reactivate_account"];
 if(!target_user_id||!actions.includes(action))return json({error:"Invalid request"},400);
 if(["approve_access","reject_access","revoke_access"].includes(action)){
  if(!["yuosant_ai","yuosant_finlab"].includes(service_key))return json({error:"Invalid service"},400);
  const rpc=await fetch(url+"/rest/v1/rpc/admin_manage_service_access",{
   method:"POST",headers:{apikey:serviceKey,Authorization:"Bearer "+serviceKey,"Content-Type":"application/json"},
   body:JSON.stringify({p_actor_auth_user_id:caller.id,p_target_user_id:target_user_id,p_service_key:service_key,p_action:action,p_reason:typeof reason==="string"?reason:null})
  });
  const result=await rpc.json().catch(()=>({}));
  if(!rpc.ok)return json({error:result?.message||result?.error||"Access decision failed"},rpc.status===404?404:rpc.status===401||rpc.status===403?rpc.status:409);
  return json(result);
 }
 const headers={apikey:serviceKey,Authorization:"Bearer "+serviceKey,"Content-Type":"application/json",Prefer:"return=representation"};
 const rest=(path:string,init:RequestInit={})=>fetch(url+"/rest/v1/"+path,{...init,headers:{...headers,...(init.headers??{})}});
 const q=await rest("yuosant_profiles?auth_user_id=eq."+encodeURIComponent(target_user_id)+"&select=account_status");
 const old=await q.json();if(!q.ok||!old?.length)return json({error:"Profile not found"},404);
 const status=action==="suspend_account"?"suspended":"active";
 const u=await rest("yuosant_profiles?auth_user_id=eq."+encodeURIComponent(target_user_id),{method:"PATCH",body:JSON.stringify({account_status:status,updated_at:new Date().toISOString()})});
 if(!u.ok)return json({error:"Account update failed"},500);
 const a=await rest("yuosant_admin_audit_log",{method:"POST",body:JSON.stringify({actor_auth_user_id:caller.id,target_auth_user_id:target_user_id,action,old_value:old[0],new_value:{account_status:status},reason:reason??null})});
 if(!a.ok)return json({error:"Account changed but audit write failed"},500);
 return json({success:true,account_status:status});
});