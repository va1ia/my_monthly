// 目录：1. 认证与输入校验 2. 名单写入 3. 来源检查与 CORS
// Newsletter: validate public key, validate input, save without exposing subscriber data.
import { withSupabase } from 'npm:@supabase/server@1';
const handler = withSupabase({auth:'publishable'}, async (req,ctx) => {
  if(req.method!=='POST') return Response.json({ok:false},{status:405});
  if(!req.headers.get('content-type')?.startsWith('application/json')) return Response.json({ok:false},{status:415});
  let data;
  try {
    const reader=req.body?.getReader(); if(!reader) throw Error();
    const chunks=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2048){await reader.cancel();return Response.json({ok:false},{status:413});}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
    data=JSON.parse(new TextDecoder().decode(bytes));
  }catch{return Response.json({ok:false},{status:400});}
  if(typeof data?.email!=='string')return Response.json({ok:false},{status:400});
  const email=data.email.trim().toLowerCase();
  if(email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return Response.json({ok:false},{status:400});
  const {error}=await ctx.supabaseAdmin.from('newsletter_subscribers').upsert({email,source:'website-footer'},{onConflict:'email',ignoreDuplicates:true});
  return Response.json({ok:!error},{status:error?503:200});
});
Deno.serve(async req=>{
  const origin=req.headers.get('origin')||'';
  const allowed=(Deno.env.get('NEWSLETTER_ALLOWED_ORIGINS')||'http://127.0.0.1:4173,http://localhost:4173').split(',').map(s=>s.trim());
  if(!allowed.includes(origin))return new Response('Origin not allowed',{status:403});
  const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'content-type, apikey','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin'};
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
  let r;try{r=await handler(req);}catch{r=Response.json({ok:false},{status:500});}
  const response=new Response(r.body,r);for(const [k,v]of Object.entries(headers))response.headers.set(k,v);return response;
});
