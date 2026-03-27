// ============================================================
//  Nutragen Central — Athena AI Proxy
//  Vercel Serverless Function
//  File location: api/chat.js
//  Your API key lives in Vercel Environment Variables — never exposed to browser
// ============================================================

export default async function handler(req, res) {

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate body
  const body = req.body;
  if (!body || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: 'Missing messages array' });
  }

  // API key from Vercel Environment Variables
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Forward to Anthropic
  const payload = {
    model:      'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system:     body.system || '',
    messages:   body.messages,
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Anthropic: ' + err.message });
  }
}
