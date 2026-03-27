# Nutragen Central — Netlify Deployment Guide

## Your folder structure (upload everything inside this folder)

nutragen-central/
├── index.html              ← Landing page (homepage)
├── central.html            ← Member dashboard
├── netlify.toml            ← Netlify configuration
└── netlify/
    └── functions/
        └── chat.js         ← Athena AI proxy (hides your API key)

---

## STEP 1 — Get your Anthropic API Key

1. Go to https://console.anthropic.com
2. Click "API Keys" in the left menu
3. Click "Create Key" — copy it somewhere safe
   It looks like: sk-ant-api03-XXXXXXXXXXXX...

---

## STEP 2 — Create your Netlify account

1. Go to https://netlify.com
2. Sign up free (use your email or GitHub)

---

## STEP 3 — Deploy your site (drag & drop — no coding needed)

1. In Netlify dashboard, click "Add new site"
2. Choose "Deploy manually"
3. Drag the entire "nutragen-central" FOLDER onto the upload area
4. Netlify gives you a random URL like: https://funny-name-123.netlify.app
   Your site is already live at that URL!

---

## STEP 4 — Add your Anthropic API Key (REQUIRED for Athena chat)

This keeps your key 100% hidden from visitors.

1. In Netlify, go to: Site Settings → Environment Variables
2. Click "Add a variable"
3. Key:   ANTHROPIC_API_KEY
   Value: sk-ant-api03-XXXXXXXXXXXX  (paste your real key)
4. Click Save
5. Go to: Deploys → click "Trigger deploy" → "Deploy site"
   (The site needs one redeploy to pick up the new variable)

---

## STEP 5 — Connect your custom domain

1. In Netlify: Site Settings → Domain Management → Add custom domain
2. Type your domain (e.g. nutragen.mx) and click Verify
3. Netlify shows you nameservers to set at your domain registrar:
   - dns1.p01.nsone.net
   - dns2.p01.nsone.net
   - dns3.p01.nsone.net
   - dns4.p01.nsone.net
4. Log into wherever you bought your domain
5. Find "Nameservers" or "DNS Settings"
6. Replace existing nameservers with the 4 Netlify ones above
7. Wait 15–60 minutes for it to propagate
8. Netlify automatically adds free SSL (the padlock)

---

## Your live URLs once domain is connected

| Page            | URL                          |
|-----------------|------------------------------|
| Landing Page    | https://tudominio.com        |
| Member Dashboard| https://tudominio.com/central|

---

## Updating your site in the future

Just drag and drop the updated files again onto Netlify.
Changes go live in about 30 seconds.
