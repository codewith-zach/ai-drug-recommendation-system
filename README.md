# OTC Wellness Demo

A presentation-ready AI-powered OTC wellness SaaS demo built with Next.js and the OpenAI API.

## Features

- Marketing landing page with pricing
- Demo login and sign-up flows
- OpenAI-driven assessment for age, sex, body weight, allergies, conditions, current medications, pregnancy status, severity, duration, and symptoms
- Safety-first OTC suggestions with OpenAI as the recommendation engine and local output guardrails
- Mock subscription checkout
- Ready for Vercel deployment

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

## Environment variables

- `OPENAI_API_KEY`: required for the AI recommendation engine
- `OPENAI_MODEL`: optional, defaults to `gpt-5.2`

If no OpenAI key is provided, the app falls back to a simpler local recommendation path so the demo still runs.
