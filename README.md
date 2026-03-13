# AI OTC Personalized Suggestion System

A presentation-ready OTC product recommendation demo built with Next.js and the OpenAI API.

## Features

- Marketing landing page with pricing
- Demo login and sign-up flows
- OTC assessment for age group, symptoms, current medications, optional allergies, and symptom duration
- Symptom clustering, medication-safety filtering, avoided-product logic, and explainable OTC suggestions
- Two built-in demo scenarios from the requirements doc: warfarin with abdominal pain, and cough with catarrh
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

If no OpenAI key is provided, the app falls back to the local rule-based OTC recommendation engine so the demo still runs.
