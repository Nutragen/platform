import Stripe from 'stripe';
import{createClient}from '@supabase/supabase-js';
export const config={api:{bodyParser:false}};
async function getRawBody(req){return new Promise((resolve,reject)=>{const chunks=[];req.on('data',c=>chunks.push(c));req.on('end',()=>resolve(Buffer.concat(chunks)));req.on('error',reject);});}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY);
  let event;
  try{event=stripe.webhooks.constructEvent(await getRawBody(req),req.headers['stripe-signature'],process.env.STRIPE_WEBHOOK_SECRET);}
  catch(err){return res.status(400).json({error:err.message});}
  if(event.type==='checkout.session.completed'){
    const{metadata,customer,subscription}=event.data.object;
    if(metadata?.userId){const e=new Date();e.setMonth(e.getMonth()+1);await supabase.from('profiles').upsert({id:metadata.userId,stripe_customer_id:customer,stripe_subscription_id:subscription,membership_status:'active',membership_expires_at:e.toISOString(),role:'member'});}
  }else if(event.type==='customer.subscription.deleted'){
    await supabase.from('profiles').update({membership_status:'cancelled'}).eq('stripe_customer_id',event.data.object.customer);
  }
  res.status(200).json({received:true});
}
