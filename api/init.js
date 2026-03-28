// api/init.js
// Serves environment variables as JavaScript to the frontend
// Called as <script src="/api/init"></script>

export default function handler(req, res) {
  const supabaseUrl  = process.env.SUPABASE_URL        || '';
  const supabaseKey  = process.env.SUPABASE_ANON_KEY   || '';
  const stripeKey    = process.env.STRIPE_PUBLISHABLE_KEY || '';

  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  res.status(200).send(`
window.__NC_CONFIG__ = {
  supabaseUrl:  "${supabaseUrl}",
  supabaseKey:  "${supabaseKey}",
  stripeKey:    "${stripeKey}"
};
console.log('[Nutragen] Config loaded:', window.__NC_CONFIG__.supabaseUrl ? '✅' : '❌ Missing SUPABASE_URL');
`);
}
