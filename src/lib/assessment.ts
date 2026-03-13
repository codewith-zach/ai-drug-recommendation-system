export type AgeGroup = "adult" | "child";

export type AssessmentInput = {
  ageGroup: AgeGroup;
  symptoms: string;
  currentMedications: string[];
  allergies: string[];
  symptomDuration: string;
};

export type RecommendationProduct = {
  name: string;
  dosage: string;
  function: string;
  reason: string;
  caution?: string;
};

export type AssessmentResponse = {
  summary: string;
  symptomClusters: string[];
  avoidedProducts: string[];
  recommendedProducts: RecommendationProduct[];
  explanation: string;
  safetyNotes: string[];
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
  function: string;
  indications: string;
  dosageAdult: string;
  dosageChild?: string;
  adultOnly?: boolean;
  avoidWhen: string;
};

export const OTC_PRODUCT_CATALOG: OTCProduct[] = [
  {
    slug: "paracetamol",
    name: "Paracetamol",
    function: "Pain and fever relief",
    indications: "Pain, fever, mild body aches, mild abdominal discomfort",
    dosageAdult: "1 tablet every 8 hours. Maximum duration: 3 days. Maximum daily dose: 4,000 mg.",
    dosageChild: "Use a pediatric formulation with age- and weight-specific label dosing only.",
    avoidWhen: "Paracetamol allergy, duplicate paracetamol-containing products, or known severe liver disease.",
  },
  {
    slug: "flucorday-capsules",
    name: "Flucorday Capsules",
    function: "Relieves cold and flu symptoms and may reduce nasal congestion",
    indications: "Cold symptoms, cough, catarrh, upper respiratory irritation",
    dosageAdult: "2 capsules every 12 hours.",
    adultOnly: true,
    avoidWhen: "Children, ingredient allergy, or when the label warns against your current medicines.",
  },
  {
    slug: "cough-syrup",
    name: "Dextromethorphan Cough Syrup",
    function: "Suppresses persistent cough and soothes throat irritation",
    indications: "Cough, throat irritation, mild upper respiratory symptoms",
    dosageAdult: "10 ml every 8 hours.",
    adultOnly: true,
    avoidWhen: "Children without pharmacist or clinician advice, ingredient allergy, or when the label warns against combination use.",
  },
  {
    slug: "cetirizine",
    name: "Cetirizine 10 mg",
    function: "Reduces catarrh and allergy-related symptoms",
    indications: "Catarrh, allergy symptoms, runny nose, sneezing",
    dosageAdult: "Once daily.",
    adultOnly: true,
    avoidWhen: "Children without pharmacist advice or allergy to cetirizine or similar antihistamines.",
  },
];

const DISCLAIMER =
  "This system provides informational OTC guidance only. It does not diagnose illness and is not a substitute for urgent or professional medical care.";

const PRODUCT_MATCHERS = OTC_PRODUCT_CATALOG.map((product) => ({
  product,
  aliases: [product.name.toLowerCase(), product.slug.replace(/-/g, " ")],
}));

const SYMPTOM_CLUSTERS: Array<{ label: string; pattern: RegExp }> = [
  { label: "Pain / inflammation", pattern: /(pain|ache|cramp|abdominal|abdomen|headache|fever)/ },
  { label: "Respiratory", pattern: /(cough|cold|flu|throat|congestion|nasal|catarrh)/ },
  { label: "Allergic / respiratory", pattern: /(catarrh|runny nose|sneez|allerg|itchy)/ },
];

const RED_FLAG_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "severe abdominal pain", pattern: /(severe abdominal|unbearable pain|rigid abdomen|sharp abdominal)/ },
  { label: "bleeding or black stool", pattern: /(heavy bleeding|black stool|vomit blood|blood in stool)/ },
  { label: "difficulty breathing or chest symptoms", pattern: /(shortness of breath|trouble breathing|chest pain)/ },
  { label: "fainting or seizure", pattern: /(faint|passed out|seizure)/ },
  { label: "persistent high fever", pattern: /(very high fever|high fever for|fever for more than)/ },
];

function splitList(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/,|\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeTerms(values: string[]) {
  return values.map((value) => value.toLowerCase().trim()).filter(Boolean);
}

function detectSymptomClusters(symptoms: string) {
  const lowerSymptoms = symptoms.toLowerCase();

  return SYMPTOM_CLUSTERS.filter(({ pattern }) => pattern.test(lowerSymptoms)).map(({ label }) => label);
}

function detectRedFlags(input: AssessmentInput) {
  const haystack = `${input.symptoms} ${input.symptomDuration}`.toLowerCase();
  const flags = RED_FLAG_PATTERNS.filter(({ pattern }) => pattern.test(haystack)).map(({ label }) => label);

  if (/more than 7 days|more than a week|over a week/.test(haystack)) {
    flags.push("symptoms lasting longer than 7 days");
  }

  return [...new Set(flags)];
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

function dosageFor(product: OTCProduct, ageGroup: AgeGroup) {
  if (ageGroup === "child" && product.dosageChild) {
    return product.dosageChild;
  }

  return product.dosageAdult;
}

function noCurrentMedication(currentMedications: string[]) {
  const normalized = normalizeTerms(currentMedications);

  return (
    normalized.length === 0 ||
    normalized.every((item) => /^(none|nil|n\/a|no medication|no medications)$/.test(item))
  );
}

function determineAvoidances(input: AssessmentInput) {
  const medications = normalizeTerms(input.currentMedications);
  const allergies = normalizeTerms(input.allergies);
  const avoidedProducts = new Set<string>();
  const notes = new Set<string>();

  if (medications.some((item) => /(warfarin|blood thinner|anticoagulant)/.test(item))) {
    avoidedProducts.add("Ibuprofen");
    avoidedProducts.add("Aspirin");
    avoidedProducts.add("Diclofenac");
    notes.add("Warfarin and similar blood thinners increase bleeding risk with NSAIDs such as ibuprofen, aspirin, and diclofenac.");
  }

  if (allergies.some((item) => /(paracetamol|acetaminophen)/.test(item))) {
    avoidedProducts.add("Paracetamol");
    notes.add("Paracetamol is excluded because it appears in the recorded allergy list.");
  }

  if (allergies.some((item) => /(cetirizine|antihistamine)/.test(item))) {
    avoidedProducts.add("Cetirizine 10 mg");
    notes.add("Cetirizine is excluded because of the recorded antihistamine allergy history.");
  }

  if (allergies.some((item) => /(dextromethorphan|cough syrup)/.test(item))) {
    avoidedProducts.add("Dextromethorphan Cough Syrup");
    notes.add("The cough suppressant option is excluded because of the recorded allergy history.");
  }

  if (allergies.some((item) => /(flucorday|decongestant)/.test(item))) {
    avoidedProducts.add("Flucorday Capsules");
    notes.add("The cold-and-flu capsule option is excluded because of the recorded allergy history.");
  }

  if (input.ageGroup === "child") {
    avoidedProducts.add("Flucorday Capsules");
    avoidedProducts.add("Dextromethorphan Cough Syrup");
    avoidedProducts.add("Cetirizine 10 mg");
    notes.add("Child profiles require stricter age-based dosing, so adult-labelled cough, cold, and antihistamine products are not surfaced automatically.");
  }

  return {
    avoidedProducts: [...avoidedProducts],
    blocked: avoidedProducts,
    notes: [...notes],
  };
}

function buildProductRecommendation(productName: string, input: AssessmentInput, reason: string, caution?: string) {
  const product = OTC_PRODUCT_CATALOG.find((entry) => entry.name === productName);

  if (!product) {
    return null;
  }

  return {
    name: product.name,
    dosage: dosageFor(product, input.ageGroup),
    function: product.function,
    reason,
    caution,
  };
}

function buildLocalAssessment(input: AssessmentInput): AssessmentResponse {
  const lowerSymptoms = input.symptoms.toLowerCase();
  const symptomClusters = detectSymptomClusters(input.symptoms);
  const redFlags = detectRedFlags(input);
  const { avoidedProducts, blocked, notes } = determineAvoidances(input);
  const recommendations: RecommendationProduct[] = [];
  const safetyNotes = new Set<string>(notes);
  const currentMedicationFree = noCurrentMedication(input.currentMedications);
  const hasWarfarin = normalizeTerms(input.currentMedications).some((item) => /(warfarin)/.test(item));
  const hasPain = /(pain|ache|cramp|abdominal|abdomen)/.test(lowerSymptoms);
  const hasCough = /(cough)/.test(lowerSymptoms);
  const hasCatarrh = /(catarrh|runny nose|congestion|nasal|cold)/.test(lowerSymptoms);

  if (redFlags.length > 0) {
    safetyNotes.add("The symptom pattern should be escalated rather than self-treated because red flags were detected.");

    return {
      summary: "This symptom profile is higher risk, so the system is withholding OTC recommendations and directing the user to clinical review.",
      symptomClusters,
      avoidedProducts,
      recommendedProducts: [],
      explanation: "The safety filter triggered because the current symptom pattern contains warning signs that should not be managed with OTC self-treatment alone.",
      safetyNotes: [...safetyNotes],
      escalationAdvice:
        "Consult a healthcare professional as soon as possible. Seek urgent medical help immediately if symptoms are severe, rapidly worsening, or involve breathing difficulty, bleeding, or fainting.",
      disclaimer: DISCLAIMER,
      flags: {
        severity: "high",
        needsClinician: true,
        redFlags,
      },
    };
  }

  if (input.ageGroup === "adult" && hasPain && hasWarfarin && !blocked.has("Paracetamol")) {
    const paracetamol = buildProductRecommendation(
      "Paracetamol",
      input,
      "Paracetamol is suggested for pain relief because it has a lower interaction risk with warfarin than NSAIDs such as ibuprofen, aspirin, or diclofenac.",
      "If pain persists after 3 days, worsens, or is associated with bleeding, seek medical review promptly.",
    );

    if (paracetamol) {
      recommendations.push(paracetamol);
    }

    safetyNotes.add("Avoid NSAID pain relievers while warfarin is listed as a current medication.");
    safetyNotes.add("Seek immediate help if abdominal pain becomes severe.");

    return {
      summary: "The engine identified a pain-related symptom pattern and filtered out NSAIDs because warfarin is listed in the current medication profile.",
      symptomClusters: symptomClusters.length > 0 ? symptomClusters : ["Pain / inflammation"],
      avoidedProducts,
      recommendedProducts: recommendations,
      explanation:
        "Paracetamol is the preferred OTC option in this case because it supports short-term pain relief without the same bleeding-risk concern associated with NSAIDs in a warfarin user.",
      safetyNotes: [...safetyNotes],
      escalationAdvice:
        "If pain persists after 3 days, becomes severe, or is associated with bleeding, dizziness, vomiting, or fever, consult a healthcare professional immediately.",
      disclaimer: DISCLAIMER,
      flags: {
        severity: "medium",
        needsClinician: true,
        redFlags: [],
      },
    };
  }

  if (input.ageGroup === "adult" && hasCough && hasCatarrh && currentMedicationFree) {
    const flucorday = !blocked.has("Flucorday Capsules")
      ? buildProductRecommendation(
          "Flucorday Capsules",
          input,
          "This may help relieve cold and flu symptoms and reduce nasal congestion in an uncomplicated adult cough-and-catarrh presentation.",
          "Do not exceed the pack dosage and review the label carefully if using any other cold medicines.",
        )
      : null;
    const coughSyrup = !blocked.has("Dextromethorphan Cough Syrup")
      ? buildProductRecommendation(
          "Dextromethorphan Cough Syrup",
          input,
          "This may help suppress persistent cough and soothe throat irritation during short-term self-care.",
          "Use the label instructions for the exact syrup selected.",
        )
      : null;
    const cetirizine = !blocked.has("Cetirizine 10 mg")
      ? buildProductRecommendation(
          "Cetirizine 10 mg",
          input,
          "This may help reduce catarrh and other allergy-like nasal symptoms that often accompany mild upper respiratory irritation.",
        )
      : null;

    for (const product of [flucorday, coughSyrup, cetirizine]) {
      if (product) {
        recommendations.push(product);
      }
    }

    safetyNotes.add("Do not exceed the recommended dosage for cough, cold, or antihistamine products.");
    safetyNotes.add("If symptoms last more than 5 to 7 days, consult a doctor.");

    return {
      summary: "The symptom interpretation engine grouped the case under upper respiratory irritation with allergy-linked nasal symptoms.",
      symptomClusters: symptomClusters.length > 0 ? symptomClusters : ["Respiratory", "Allergic / respiratory"],
      avoidedProducts,
      recommendedProducts: recommendations,
      explanation:
        "These medications may help relieve cough and nasal symptoms associated with common cold or mild respiratory irritation while keeping the recommendation within routine OTC self-care.",
      safetyNotes: [...safetyNotes],
      escalationAdvice:
        "If symptoms last beyond 5 to 7 days, breathing becomes difficult, or fever develops, consult a doctor.",
      disclaimer: DISCLAIMER,
      flags: {
        severity: "low",
        needsClinician: false,
        redFlags: [],
      },
    };
  }

  if (hasPain && !blocked.has("Paracetamol")) {
    const paracetamol = buildProductRecommendation(
      "Paracetamol",
      input,
      input.ageGroup === "child"
        ? "Paracetamol is the most conservative OTC pain-relief option surfaced for a child case, provided pediatric label dosing is used."
        : "Paracetamol is a conservative first-line OTC option for short-term pain relief in this symptom pattern.",
      input.ageGroup === "child"
        ? "Use a pediatric formulation only and confirm the label dose carefully."
        : "Follow the product label and avoid using multiple paracetamol-containing medicines at the same time.",
    );

    if (paracetamol) {
      recommendations.push(paracetamol);
    }
  }

  if (input.ageGroup === "adult" && hasCough && !blocked.has("Dextromethorphan Cough Syrup")) {
    const coughSyrup = buildProductRecommendation(
      "Dextromethorphan Cough Syrup",
      input,
      "This may help suppress a mild cough during short-term OTC self-care.",
      "Use the label directions for the exact syrup chosen.",
    );

    if (coughSyrup) {
      recommendations.push(coughSyrup);
    }
  }

  if (input.ageGroup === "adult" && hasCatarrh && !blocked.has("Cetirizine 10 mg")) {
    const cetirizine = buildProductRecommendation(
      "Cetirizine 10 mg",
      input,
      "This may help reduce catarrh and related allergy-style nasal symptoms.",
    );

    if (cetirizine) {
      recommendations.push(cetirizine);
    }
  }

  if (input.ageGroup === "adult" && hasCough && hasCatarrh && !blocked.has("Flucorday Capsules")) {
    const flucorday = buildProductRecommendation(
      "Flucorday Capsules",
      input,
      "This adult-labelled product may help relieve combined cough, cold, and congestion symptoms in short-term OTC care.",
      "Avoid combining it with overlapping cold medicines without checking the label first.",
    );

    if (flucorday) {
      recommendations.unshift(flucorday);
    }
  }

  const uniqueRecommendations = [...new Map(recommendations.map((product) => [product.name, product])).values()].slice(0, 3);
  const needsClinician =
    input.ageGroup === "child" && uniqueRecommendations.length === 0
      ? true
      : /5-7 days|more than 7 days|more than a week/.test(input.symptomDuration.toLowerCase());

  if (/5-7 days|more than 7 days|more than a week/.test(input.symptomDuration.toLowerCase())) {
    safetyNotes.add("Longer symptom duration lowers the threshold for clinician review.");
  }

  if (input.ageGroup === "child") {
    safetyNotes.add("Child dosing should be confirmed from the product label or a pharmacist before use.");
  }

  return {
    summary:
      uniqueRecommendations.length > 0
        ? "The system matched the symptom profile to OTC products commonly used for short-term symptom relief."
        : "No sufficiently safe OTC option surfaced automatically for this profile, so pharmacist or clinician guidance is the safer next step.",
    symptomClusters,
    avoidedProducts,
    recommendedProducts: uniqueRecommendations,
    explanation:
      uniqueRecommendations.length > 0
        ? "The recommendation balances symptom matching, age restrictions, and simple medication-safety checks before showing OTC options."
        : "The safety filter stayed conservative because the profile needs age-based dosing confirmation or a closer professional review.",
    safetyNotes: [...safetyNotes],
    escalationAdvice:
      uniqueRecommendations.length > 0
        ? "If symptoms worsen, last longer than expected, or new warning signs appear, consult a healthcare professional."
        : "Consult a pharmacist or clinician before choosing an OTC treatment for this case.",
    disclaimer: DISCLAIMER,
    flags: {
      severity: needsClinician ? "medium" : "low",
      needsClinician,
      redFlags: [],
    },
  };
}

export function buildFallbackAssessment(input: AssessmentInput): AssessmentResponse {
  return buildLocalAssessment(input);
}

export function applySafetyGuardrails(candidate: AssessmentResponse, input: AssessmentInput): AssessmentResponse {
  const baseline = buildLocalAssessment(input);
  const { blocked, avoidedProducts, notes } = determineAvoidances(input);
  const redFlags = detectRedFlags(input);

  if (redFlags.length > 0) {
    return baseline;
  }

  const safeRecommendations = candidate.recommendedProducts
    .map<RecommendationProduct | null>((product) => {
      const catalogProduct = resolveCatalogProduct(product.name);

      if (!catalogProduct || blocked.has(catalogProduct.name)) {
        return null;
      }

      return {
        name: catalogProduct.name,
        dosage: dosageFor(catalogProduct, input.ageGroup),
        function: catalogProduct.function,
        reason: product.reason.trim(),
        caution: [product.caution?.trim(), catalogProduct.avoidWhen].filter(Boolean).join(" "),
      };
    })
    .filter((product): product is RecommendationProduct => product !== null)
    .slice(0, 3);

  if (safeRecommendations.length === 0) {
    return baseline;
  }

  return {
    summary: candidate.summary.trim() || baseline.summary,
    symptomClusters: candidate.symptomClusters.length > 0 ? candidate.symptomClusters : baseline.symptomClusters,
    avoidedProducts: [...new Set([...avoidedProducts, ...candidate.avoidedProducts])],
    recommendedProducts: safeRecommendations,
    explanation: candidate.explanation.trim() || baseline.explanation,
    safetyNotes: [...new Set([...candidate.safetyNotes, ...notes])],
    escalationAdvice: candidate.escalationAdvice.trim() || baseline.escalationAdvice,
    disclaimer: DISCLAIMER,
    flags: {
      severity: candidate.flags.severity,
      needsClinician: candidate.flags.needsClinician || baseline.flags.needsClinician,
      redFlags,
    },
  };
}

export function parseAssessmentPayload(payload: unknown): AssessmentInput {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid request body.");
  }

  const data = payload as Record<string, unknown>;
  const ageGroup = data.ageGroup === "adult" || data.ageGroup === "child" ? data.ageGroup : null;
  const symptoms = typeof data.symptoms === "string" ? data.symptoms.trim() : "";
  const symptomDuration = typeof data.symptomDuration === "string" ? data.symptomDuration.trim() : "";
  const currentMedications = splitList(data.currentMedications);
  const allergies = splitList(data.allergies);

  if (!ageGroup) {
    throw new Error("Please choose whether the patient is an adult or child.");
  }

  if (!symptoms || symptoms.length < 3) {
    throw new Error("Please enter the symptom or symptom combination to assess.");
  }

  if (!symptomDuration) {
    throw new Error("Please specify how long the symptoms have been present.");
  }

  return {
    ageGroup,
    symptoms,
    currentMedications,
    allergies,
    symptomDuration,
  };
}

export function isAssessmentResponse(value: unknown): value is AssessmentResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.summary === "string" &&
    Array.isArray(data.symptomClusters) &&
    Array.isArray(data.avoidedProducts) &&
    Array.isArray(data.recommendedProducts) &&
    typeof data.explanation === "string" &&
    Array.isArray(data.safetyNotes) &&
    typeof data.escalationAdvice === "string" &&
    typeof data.disclaimer === "string" &&
    typeof data.flags === "object" &&
    data.flags !== null
  );
}
