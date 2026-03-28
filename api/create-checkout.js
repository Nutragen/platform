// api/create-checkout.js
// Creates a Stripe Checkout session for $149 MXN/month membership

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, userId, name } = req.body || {};
  if (!email || !userId) return res.status(400).json({ error: 'Email and userId required' });

  const stripe = await import('stripe').then(m => m.default(process.env.STRIPE_SECRET_KEY));

  // Get the base URL for redirect
  const baseUrl = req.headers.origin || 'https://www.nutragencentral.com';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'mxn',
          product_data: {
            name: 'Nutragen Central — Membresía Mensual',
            description: 'Acceso completo: Athena IA, videos, meditaciones, guías y tienda exclusiva',
            images: [],
          },
          unit_amount: 14900, // $149 MXN in centavos
          recurring: { interval: 'month' },
        },
        quantity: 1,
      }],
      metadata: {
        userId,
        name: name || '',
      },
      success_url: `${baseUrl}/central.html?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url:  `${baseUrl}/central.html?status=cancelled`,
      locale: 'es',
    });

    res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
}
