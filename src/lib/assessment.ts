export type SymptomSeverity = "mild" | "moderate" | "severe";

export type AssessmentInput = {
  age: number;
  sex: string;
  weightKg: number | null;
  allergies: string[];
  existingConditions: string[];
  currentMedications: string[];
  isPregnantOrBreastfeeding: boolean;
  symptomDuration: string;
  symptomSeverity: SymptomSeverity;
  symptoms: string;
};

export type RecommendationProduct = {
  name: string;
  reason: string;
  caution?: string;
};

export type AssessmentResponse = {
  summary: string;
  recommendedProducts: RecommendationProduct[];
  selfCareSteps: string[];
  escalationAdvice: string;
  disclaimer: string;
  flags: {
    severity: "low" | "medium" | "high";
    needsClinician: boolean;
    redFlags: string[];
  };
};

type OTCProduct = {
  slug: string;
  name: string;
  activeIngredient: string;
  indications: string;
  avoidWhen: string;
};

export const OTC_PRODUCT_CATALOG: OTCProduct[] = [
  {
    slug: "paracetamol",
    name: "Paracetamol",
    activeIngredient: "Acetaminophen 500 mg tablet",
    indications: "Mild pain, fever, body aches, headache",
    avoidWhen: "Allergy to paracetamol/acetaminophen, known severe liver disease, or duplicate combination products",
  },
  {
    slug: "ibuprofen",
    name: "Ibuprofen",
    activeIngredient: "Ibuprofen",
    indications: "Inflammatory pain, cramps, headache, fever",
    avoidWhen: "Ulcer history, kidney disease, anticoagulant use, pregnancy/breastfeeding, or NSAID allergy",
  },
  {
    slug: "antacid",
    name: "Antacid",
    activeIngredient: "Calcium carbonate / magnesium-based OTC antacid",
    indications: "Heartburn, reflux, indigestion",
    avoidWhen: "Relevant allergy or when the label warns against your other medications",
  },
  {
    slug: "oral-rehydration-salts",
    name: "Oral Rehydration Salts",
    activeIngredient: "Electrolyte replacement salts",
    indications: "Diarrhea, vomiting, dehydration support",
    avoidWhen: "Repeated vomiting, blood in stool, or severe dehydration symptoms need clinician review",
  },
  {
    slug: "antihistamine",
    name: "Loratadine 10 mg",
    activeIngredient: "Loratadine 10 mg tablet",
    indications: "Sneezing, itchy eyes, runny nose, allergy symptoms",
    avoidWhen: "Relevant allergy or if a sedating formulation would be unsafe for your use case",
  },
  {
    slug: "cough-syrup",
    name: "Cough Syrup",
    activeIngredient: "Dextromethorphan-style OTC cough syrup",
    indications: "Dry cough, throat irritation, cold-related cough",
    avoidWhen: "Use the specific product label because cough syrups do not all have the same ingredients or dosing",
  },
  {
    slug: "saline-nasal-spray",
    name: "Saline Nasal Spray",
    activeIngredient: "Sterile saline",
    indications: "Nasal congestion, dryness, sinus irritation",
    avoidWhen: "Seek review if symptoms suggest infection, high fever, or breathing trouble",
  },
];

const DISCLAIMER =
  "This demo provides informational OTC wellness guidance only. It is not a diagnosis, prescription, or emergency service.";

const PRODUCT_MATCHERS = OTC_PRODUCT_CATALOG.map((product) => ({
  product,
  aliases: [
    product.name.toLowerCase(),
    product.slug.replace(/-/g, " "),
    product.activeIngredient.toLowerCase(),
  ],
}));

const RED_FLAG_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "chest pain or breathing trouble", pattern: /(chest pain|trouble breathing|shortness of breath)/ },
  { label: "fainting or seizures", pattern: /(faint|passed out|seizure)/ },
  { label: "bleeding or blood", pattern: /(heavy bleeding|blood|black stool|vomit blood)/ },
  { label: "pregnancy-related abdominal concern", pattern: /(pregnan|postpartum|contraction)/ },
  { label: "severe abdominal pain", pattern: /(severe abdominal|sharp abdominal|unbearable pain)/ },
  { label: "persistent high fever", pattern: /(very high fever|high fever|fever for [3-9] days|fever for a week)/ },
];

function splitList(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeTerms(values: string[]) {
  return values.map((value) => value.toLowerCase().trim()).filter(Boolean);
}

function resolveCatalogProduct(name: string) {
  const lowerName = name.toLowerCase().trim();

  for (const matcher of PRODUCT_MATCHERS) {
    if (matcher.aliases.some((alias) => lowerName === alias || lowerName.includes(alias))) {
      return matcher.product;
    }
  }

  return null;
}

function detectRedFlags(input: AssessmentInput) {
  const symptomText = `${input.symptoms} ${input.symptomDuration}`.toLowerCase();
  const redFlags = RED_FLAG_PATTERNS.filter(({ pattern }) => pattern.test(symptomText)).map(({ label }) => label);

  if (input.symptomSeverity === "severe") {
    redFlags.push("severe symptom intensity");
  }

  if (input.age < 12) {
    redFlags.push("child case requires caregiver/pharmacist confirmation");
  }

  return [...new Set(redFlags)];
}

function determineBlockedProducts(input: AssessmentInput) {
  const allergies = normalizeTerms(input.allergies);
  const conditions = normalizeTerms(input.existingConditions);
  const currentMedications = normalizeTerms(input.currentMedications);
  const blocked = new Set<string>();
  const notes = new Set<string>();

  if (allergies.some((entry) => /(paracetamol|acetaminophen)/.test(entry))) {
    blocked.add("Paracetamol");
  }

  if (allergies.some((entry) => /(ibuprofen|nsaid)/.test(entry))) {
    blocked.add("Ibuprofen");
  }

  if (allergies.some((entry) => /(antacid|calcium carbonate|magnesium)/.test(entry))) {
    blocked.add("Antacid");
  }

  if (allergies.some((entry) => /(cetirizine|loratadine|antihistamine)/.test(entry))) {
    blocked.add("Loratadine 10 mg");
  }

  if (conditions.some((entry) => /(ulcer|gastric ulcer|stomach ulcer)/.test(entry))) {
    blocked.add("Ibuprofen");
    notes.add("Ulcer history makes NSAID-style pain relief less suitable.");
  }

  if (conditions.some((entry) => /(kidney|renal)/.test(entry))) {
    blocked.add("Ibuprofen");
    notes.add("Kidney conditions should narrow OTC pain-relief choices.");
  }

  if (conditions.some((entry) => /(liver)/.test(entry))) {
    blocked.add("Paracetamol");
    notes.add("Liver disease should trigger extra caution with paracetamol-containing products.");
  }

  if (currentMedications.some((entry) => /(warfarin|apixaban|rivaroxaban|blood thinner|anticoagulant)/.test(entry))) {
    blocked.add("Ibuprofen");
    notes.add("Blood-thinner use raises interaction risk for NSAID-style OTC pain relief.");
  }

  if (input.isPregnantOrBreastfeeding) {
    blocked.add("Ibuprofen");
    notes.add("Pregnancy or breastfeeding should narrow self-medication and lower the threshold for clinician review.");
  }

  return {
    blocked,
    notes: [...notes],
  };
}

function sanitizeSelfCareSteps(steps: string[], notes: string[]) {
  const combined = [...steps, ...notes];
  const cleaned = combined.map((step) => step.trim()).filter(Boolean);

  return [...new Set(cleaned)].slice(0, 5);
}

function normalizeMedicationContext(input: AssessmentInput) {
  const medications = normalizeTerms(input.currentMedications);
  const noCurrentMedication =
    medications.length === 0 ||
    medications.every((entry) => /^(none|nil|no medication|no medications|n\/a)$/.test(entry));

  return {
    medications,
    noCurrentMedication,
  };
}

function buildDemoScenarioOverride(
  input: AssessmentInput,
  blocked: Set<string>,
  notes: string[],
  redFlags: string[],
): AssessmentResponse | null {
  if (redFlags.length > 0 || input.age < 18) {
    return null;
  }

  const lowerSymptoms = input.symptoms.toLowerCase();
  const { medications, noCurrentMedication } = normalizeMedicationContext(input);
  const lowerAbdominalPain = /(lower abdomen|lower abdominal|abdominal pain|pelvic pain|cramp)/.test(lowerSymptoms);
  const hasWarfarin = medications.some((entry) => /(warfarin)/.test(entry));
  const hasCoughAndCatarrh =
    /(cough)/.test(lowerSymptoms) &&
    /(catarrh|catarrgh|runny nose|nasal discharge|cold|congestion)/.test(lowerSymptoms);

  if (lowerAbdominalPain && hasWarfarin && !blocked.has("Paracetamol")) {
    return {
      summary:
        "For this demo case, paracetamol is presented as the adult OTC pain-relief option when the symptom is lower abdominal pain and the current medication is warfarin.",
      recommendedProducts: [
        {
          name: "Paracetamol",
          reason: "Demo suggestion: Paracetamol 500 mg for 3 days is used here as the safer pain-relief option instead of NSAID-style products.",
          caution:
            "Because warfarin is listed as a current medication, keep strictly to label directions, avoid duplicate acetaminophen/paracetamol products, and escalate if pain persists, worsens, or is associated with bleeding.",
        },
      ],
      selfCareSteps: sanitizeSelfCareSteps(
        [
          "Use the demo suggestion for short-term relief only and re-check the symptom if it is not improving within 3 days.",
          "Escalate quickly if the pain becomes severe or if there is bleeding, fever, vomiting, or dizziness.",
        ],
        notes,
      ),
      escalationAdvice:
        "Because lower abdominal pain can have important causes, speak to a clinician sooner if symptoms persist beyond the short demo window or feel more severe than expected.",
      disclaimer: DISCLAIMER,
      flags: {
        severity: "medium",
        needsClinician: true,
        redFlags: [],
      },
    };
  }

  if (hasCoughAndCatarrh && noCurrentMedication) {
    const recommendedProducts: RecommendationProduct[] = [];

    if (!blocked.has("Paracetamol")) {
      recommendedProducts.push({
        name: "Paracetamol",
        reason: "Demo suggestion: included for upper-respiratory discomfort, throat pain, body aches, or fever-like cold symptoms.",
        caution: "Follow pack directions and avoid taking another product that also contains paracetamol/acetaminophen.",
      });
    }

    if (!blocked.has("Loratadine 10 mg")) {
      recommendedProducts.push({
        name: "Loratadine 10 mg",
        reason: "Demo suggestion: one tablet once daily for catarrh, runny nose, or allergy-like upper-respiratory symptoms.",
        caution: "Adult demo suggestion: once daily. Follow the product label and avoid use if you have been told not to take antihistamines.",
      });
    }

    recommendedProducts.push({
      name: "Cough Syrup",
      reason: "Demo suggestion: twice daily for 3 days to ease cough symptoms.",
      caution: "Use the label directions for the specific syrup chosen, because OTC cough syrups do not all have the same active ingredients or dosing.",
    });

    return {
      summary:
        "For this demo case, the adult cough-and-catarrh flow suggests paracetamol, loratadine 10 mg once daily, and cough syrup as the short-term OTC combination.",
      recommendedProducts: recommendedProducts.slice(0, 3),
      selfCareSteps: sanitizeSelfCareSteps(
        [
          "Hydrate well, rest, and monitor whether the cough and catarrh are easing over the next 3 days.",
          "Escalate sooner if there is chest pain, shortness of breath, high fever, or worsening symptoms.",
        ],
        notes,
      ),
      escalationAdvice:
        "If the cough becomes severe, breathing becomes difficult, or symptoms are not improving after the short demo window, speak to a pharmacist or clinician.",
      disclaimer: DISCLAIMER,
      flags: {
        severity: "low",
        needsClinician: false,
        redFlags: [],
      },
    };
  }

  return null;
}

export function buildFallbackAssessment(input: AssessmentInput): AssessmentResponse {
  const lowerSymptoms = input.symptoms.toLowerCase();
  const redFlags = detectRedFlags(input);
  const { blocked, notes } = determineBlockedProducts(input);

  if (redFlags.length > 0) {
    return {
      summary: "The symptom profile suggests a higher-risk situation, so clinician or pharmacist review is safer than self-treating with OTC products.",
      recommendedProducts: [],
      selfCareSteps: sanitizeSelfCareSteps(
        [
          "Avoid relying on self-medication alone for this symptom pattern.",
          "Seek urgent help now if symptoms are rapidly worsening.",
        ],
        notes,
      ),
      escalationAdvice:
        "Please speak to a clinician as soon as possible. If there is severe pain, bleeding, fainting, chest symptoms, or breathing difficulty, treat it as urgent.",
      disclaimer: DISCLAIMER,
      flags: {
        severity: "high",
        needsClinician: true,
        redFlags,
      },
    };
  }

  const products: RecommendationProduct[] = [];

  if (/(pain|cramp|headache|fever|body ache|abdomen|abdominal)/.test(lowerSymptoms)) {
    if (!blocked.has("Paracetamol")) {
      products.push({
        name: "Paracetamol",
        reason: "A common OTC option for mild pain or fever when the profile does not suggest it should be avoided.",
        caution: "Check the pack for dosing instructions and avoid duplicate acetaminophen/paracetamol products.",
      });
    } else if (!blocked.has("Ibuprofen")) {
      products.push({
        name: "Ibuprofen",
        reason: "An OTC option for pain or inflammation when the health profile does not indicate a typical NSAID risk.",
        caution: "Take with food and avoid if you have stomach-ulcer, kidney, blood-thinner, or pregnancy-related risk factors.",
      });
    }
  }

  if (/(heartburn|acid|reflux|indigestion|stomach burn)/.test(lowerSymptoms) && !blocked.has("Antacid")) {
    products.push({
      name: "Antacid",
      reason: "This may help short-term acid-related discomfort such as heartburn or indigestion.",
      caution: "Check the label for spacing from other medicines.",
    });
  }

  if (/(diarrhea|vomiting|dehydration|lightheaded)/.test(lowerSymptoms)) {
    products.push({
      name: "Oral Rehydration Salts",
      reason: "This helps replace fluids and electrolytes when dehydration support is needed.",
      caution: "Escalate if vomiting is persistent or there is blood in stool.",
    });
  }

  if (/(allergy|sneez|itchy|runny nose|hay fever|catarrh|catarrgh)/.test(lowerSymptoms) && !blocked.has("Loratadine 10 mg")) {
    products.push({
      name: "Loratadine 10 mg",
      reason: "This can help allergic symptoms such as sneezing, itchy eyes, or a runny nose.",
      caution: "Choose a non-drowsy option if you need to stay alert.",
    });
  }

  if (/(sore throat|throat|cough)/.test(lowerSymptoms)) {
    products.push({
      name: "Cough Syrup",
      reason: "This can help ease a mild cough in the short term.",
      caution: "Use the label directions for the exact syrup selected.",
    });
  }

  if (/(blocked nose|congestion|stuffy nose|sinus)/.test(lowerSymptoms)) {
    products.push({
      name: "Saline Nasal Spray",
      reason: "This can relieve nasal dryness and mild congestion without using a drug-based decongestant.",
    });
  }

  const recommendedProducts = [...new Map(products.map((product) => [product.name, product])).values()].slice(0, 3);

  return {
    summary:
      recommendedProducts.length > 0
        ? "The fallback engine found OTC options that generally fit the symptom profile."
        : "No clean OTC recommendation surfaced from the fallback engine, so pharmacist review is the safer next step.",
    recommendedProducts,
    selfCareSteps: sanitizeSelfCareSteps(
      [
        "Rest, hydrate, and follow the product label carefully.",
        "Stop self-treatment and escalate if symptoms worsen or do not improve.",
      ],
      notes,
    ),
    escalationAdvice:
      /(abdomen|abdominal|pelvic)/.test(lowerSymptoms) || input.isPregnantOrBreastfeeding
        ? "Abdominal or pregnancy-related concerns should be escalated sooner if pain persists, worsens, or becomes severe."
        : "Speak to a pharmacist or clinician if symptoms worsen, feel unusual, or last longer than expected.",
    disclaimer: DISCLAIMER,
    flags: {
      severity: /(abdomen|abdominal|pelvic)/.test(lowerSymptoms) ? "medium" : "low",
      needsClinician: /(abdomen|abdominal|pelvic)/.test(lowerSymptoms),
      redFlags: [],
    },
  };
}

export function applySafetyGuardrails(
  candidate: AssessmentResponse,
  input: AssessmentInput,
): AssessmentResponse {
  const redFlags = detectRedFlags(input);
  const { blocked, notes } = determineBlockedProducts(input);
  const demoScenarioOverride = buildDemoScenarioOverride(input, blocked, notes, redFlags);

  if (demoScenarioOverride) {
    return demoScenarioOverride;
  }

  const recommendedProducts =
    redFlags.length > 0
      ? []
      : candidate.recommendedProducts
          .map<RecommendationProduct | null>((product) => {
            const catalogMatch = resolveCatalogProduct(product.name);

            if (!catalogMatch || blocked.has(catalogMatch.name)) {
              return null;
            }

            const caution = [product.caution?.trim(), catalogMatch.avoidWhen].filter(Boolean).join(" ");
            const safeProduct: RecommendationProduct = {
              name: catalogMatch.name,
              reason: product.reason.trim(),
            };

            if (caution) {
              safeProduct.caution = caution;
            }

            return safeProduct;
          })
          .filter((product): product is RecommendationProduct => product !== null)
          .slice(0, 3);
  const fallbackAssessment =
    redFlags.length === 0 && recommendedProducts.length === 0 ? buildFallbackAssessment(input) : null;

  const selfCareSteps =
    redFlags.length > 0
      ? sanitizeSelfCareSteps(
          [
            "Avoid relying on self-medication alone until you speak with a clinician or pharmacist.",
            "If symptoms are rapidly worsening, seek urgent help immediately.",
          ],
          notes,
        )
      : fallbackAssessment && fallbackAssessment.recommendedProducts.length > 0
        ? sanitizeSelfCareSteps(fallbackAssessment.selfCareSteps, notes)
      : sanitizeSelfCareSteps(candidate.selfCareSteps, notes);

  return {
    summary:
      redFlags.length > 0
        ? "The symptom profile includes red flags, so the safer recommendation is clinician review rather than OTC self-treatment."
        : recommendedProducts.length > 0
          ? candidate.summary.trim()
          : fallbackAssessment && fallbackAssessment.recommendedProducts.length > 0
            ? fallbackAssessment.summary
          : "No OTC product from the approved catalog remained suitable after safety checks, so pharmacist or clinician review is the safer next step.",
    recommendedProducts:
      recommendedProducts.length > 0
        ? recommendedProducts
        : fallbackAssessment && fallbackAssessment.recommendedProducts.length > 0
          ? fallbackAssessment.recommendedProducts
          : [],
    selfCareSteps,
    escalationAdvice:
      redFlags.length > 0
        ? "Please speak to a clinician as soon as possible. Seek urgent care now for severe pain, chest symptoms, breathing difficulty, bleeding, fainting, or rapidly worsening symptoms."
        : fallbackAssessment && fallbackAssessment.recommendedProducts.length > 0
          ? fallbackAssessment.escalationAdvice
        : candidate.escalationAdvice.trim(),
    disclaimer: DISCLAIMER,
    flags: {
      severity:
        redFlags.length > 0
          ? "high"
          : fallbackAssessment && fallbackAssessment.recommendedProducts.length > 0
            ? fallbackAssessment.flags.severity
            : candidate.flags.severity,
      needsClinician:
        redFlags.length > 0 ||
        candidate.flags.needsClinician ||
        fallbackAssessment?.flags.needsClinician ||
        input.isPregnantOrBreastfeeding,
      redFlags,
    },
  };
}

export function parseAssessmentPayload(payload: unknown): AssessmentInput {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request body.");
  }

  const data = payload as Record<string, unknown>;
  const age = Number(data.age);
  const weightRaw = data.weightKg;
  const weightKg =
    weightRaw === null || weightRaw === undefined || weightRaw === ""
      ? null
      : Number(weightRaw);
  const sex = typeof data.sex === "string" ? data.sex.trim() : "";
  const symptoms = typeof data.symptoms === "string" ? data.symptoms.trim() : "";
  const symptomDuration = typeof data.symptomDuration === "string" ? data.symptomDuration.trim() : "";
  const symptomSeverity =
    data.symptomSeverity === "mild" || data.symptomSeverity === "moderate" || data.symptomSeverity === "severe"
      ? data.symptomSeverity
      : null;
  const allergies = splitList(data.allergies);
  const existingConditions = splitList(data.existingConditions);
  const currentMedications = splitList(data.currentMedications);
  const isPregnantOrBreastfeeding = Boolean(data.isPregnantOrBreastfeeding);

  if (!Number.isFinite(age) || age < 1 || age > 120) {
    throw new Error("Age must be a valid number between 1 and 120.");
  }

  if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > 500)) {
    throw new Error("Weight must be a valid number when provided.");
  }

  if (!sex) {
    throw new Error("Sex is required.");
  }

  if (!symptoms || symptoms.length < 4) {
    throw new Error("Please describe how you feel in a few words.");
  }

  if (!symptomDuration) {
    throw new Error("Please tell the app how long the symptom has been going on.");
  }

  if (!symptomSeverity) {
    throw new Error("Please choose the symptom severity.");
  }

  return {
    age,
    sex,
    weightKg,
    allergies,
    existingConditions,
    currentMedications,
    isPregnantOrBreastfeeding,
    symptomDuration,
    symptomSeverity,
    symptoms,
  };
}

export function isAssessmentResponse(value: unknown): value is AssessmentResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.summary === "string" &&
    Array.isArray(data.recommendedProducts) &&
    Array.isArray(data.selfCareSteps) &&
    typeof data.escalationAdvice === "string" &&
    typeof data.disclaimer === "string" &&
    typeof data.flags === "object" &&
    data.flags !== null
  );
}
