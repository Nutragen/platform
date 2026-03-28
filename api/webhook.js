// api/webhook.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (userId) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        await supabase.from('profiles').upsert({
          id: userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          membership_status: 'active',
          membership_expires_at: expiresAt.toISOString(),
          role: 'member',
        });
      }
      break;
    }
    case 'invoice.payment_succeeded': {
      const customerId = event.data.object.customer;
      const { data: profile } = await supabase.from('profiles').select('id').eq('stripe_customer_id', customerId).single();
      if (profile?.id) {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        await supabase.from('profiles').update({ membership_status: 'active', membership_expires_at: expiresAt.toISOString() }).eq('id', profile.id);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const customerId = event.data.object.customer;
      await supabase.from('profiles').update({ membership_status: 'cancelled' }).eq('stripe_customer_id', customerId);
      break;
    }
  }

  res.status(200).json({ received: true });
}
