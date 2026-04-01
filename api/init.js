export default function handler(req,res){
  const u=process.env.SUPABASE_URL||'',k=process.env.SUPABASE_ANON_KEY||'',s=process.env.STRIPE_PUBLISHABLE_KEY||'';
  res.setHeader('Content-Type','application/javascript');
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Cache-Control','no-cache');
  res.status(200).send(`window.__NC_CONFIG__={"supabaseUrl":"${u}","supabaseKey":"${k}","stripeKey":"${s}"};\nconsole.log('[Nutragen] Config loaded:',window.__NC_CONFIG__.supabaseUrl?'✅':'❌');`);
}
