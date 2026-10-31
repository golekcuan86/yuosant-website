import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type","Access-Control-Allow-Methods":"GET, POST, OPTIONS","Content-Type":"application/json"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:cors});
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(!["GET","POST"].includes(req.method))return json({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL")!,serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
 const publicKey=Deno.env.get("SUPABASE_ANON_KEY")??Deno.env.get("SUPABASE_PUBLISHABLE_KEY")??"";
 const auth=req.headers.get("Authorization")??"";
 if(!auth.startsWith("Bearer ")||!publicKey)return json({error:"Unauthorized"},401);
 const u=await fetch(url+"/auth/v1/user",{headers:{apikey:publicKey,Authorization:auth}});
 if(!u.ok)return json({error:"Invalid session"},401);
 const user=await u.json();let service=new URL(req.url).searchParams.get("service_key");
 if(req.method==="POST"){try{service=(await req.json())?.service_key??service}catch{}}
 if(!["yuosant_ai","yuosant_finlab"].includes(service??""))return json({error:"Invalid service_key"},400);
 const h={apikey:serviceKey,Authorization:"Bearer "+serviceKey};
 const p=await fetch(url+"/rest/v1/yuosant_profiles?auth_user_id=eq."+encodeURIComponent(user.id)+"&select=account_status",{headers:h});
 const profiles=await p.json();if(!p.ok||!profiles?.length)return json({allowed:false,reason:"profile_missing"});
 if(profiles[0].account_status!=="active")return json({allowed:false,reason:"account_"+profiles[0].account_status});
 const a=await fetch(url+"/rest/v1/yuosant_service_access?auth_user_id=eq."+encodeURIComponent(user.id)+"&service_key=eq."+service+"&select=request_status",{headers:h});
 const access=await a.json();if(!a.ok)return json({error:"Access lookup failed"},500);
 const allowed=access?.[0]?.request_status==="approved";
 return json({allowed,reason:allowed?"approved":(access?.[0]?.request_status??"not_requested")});
});