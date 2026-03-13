import OpenAI from "openai";
import {
  applySafetyGuardrails,
  buildFallbackAssessment,
  isAssessmentResponse,
  OTC_PRODUCT_CATALOG,
  type AssessmentInput,
  type AssessmentResponse,
} from "@/lib/assessment";

let cachedClient: OpenAI | null | undefined;

function getOpenAIClient() {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  cachedClient = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
  return cachedClient;
}

function extractJson(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  return match?.[0] ?? null;
}

export async function generateAssessmentWithAI(
  input: AssessmentInput,
): Promise<AssessmentResponse> {
  const client = getOpenAIClient();

  if (!client) {
    return buildFallbackAssessment(input);
  }

  const completion = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5.2",
    temperature: 0.2,
    input: [
      {
        role: "system",
        content: `
You are the primary OTC product recommendation engine for a personalized suggestion system.
Use the user's age group, symptoms, current medications, allergies, and symptom duration to decide which OTC products are appropriate.
You must only recommend products from this exact approved catalog:
${OTC_PRODUCT_CATALOG.map(
  (product) =>
    `- ${product.name}: ${product.indications}. Avoid when: ${product.avoidWhen}. Adult dosage: ${product.dosageAdult}`,
).join("\n")}

Rules:
- Use the entire profile: age group, symptoms, current medications, allergies, and symptom duration.
- This system does not diagnose disease.
- Prioritize medication safety, age restrictions, interaction filtering, and explainable OTC suggestions.
- If current medication includes warfarin, avoid NSAIDs such as ibuprofen, aspirin, and diclofenac.
- Recommend at most 3 products.
- If the case looks risky, unclear, or more appropriate for pharmacist/clinician review, return an empty product list and say so.
- Never invent products outside the approved catalog.
- Return JSON only with this shape:
{
  "summary": "string",
  "symptomClusters": ["string"],
  "avoidedProducts": ["string"],
  "recommendedProducts": [
    {
      "name": "exact catalog name",
      "dosage": "string",
      "function": "string",
      "reason": "string",
      "caution": "string optional"
    }
  ],
  "explanation": "string",
  "safetyNotes": ["string"],
  "escalationAdvice": "string",
  "disclaimer": "string",
  "flags": {
    "severity": "low|medium|high",
    "needsClinician": true,
    "redFlags": ["string"]
  }
}
`.trim(),
      },
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });

  try {
    const rawJson = extractJson(completion.output_text);

    if (!rawJson) {
      return buildFallbackAssessment(input);
    }

    const parsed = JSON.parse(rawJson);

    if (!isAssessmentResponse(parsed)) {
      return buildFallbackAssessment(input);
    }

    return applySafetyGuardrails(parsed, input);
  } catch {
    return buildFallbackAssessment(input);
  }
}
