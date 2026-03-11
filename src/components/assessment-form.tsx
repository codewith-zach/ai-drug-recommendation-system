"use client";

import { useState, useTransition } from "react";
import { isAssessmentResponse, type AssessmentResponse } from "@/lib/assessment";

const sampleData = {
  age: "18",
  sex: "Female",
  weightKg: "60",
  allergies: "",
  existingConditions: "Ulcer",
  currentMedications: "",
  isPregnantOrBreastfeeding: false,
  symptomDuration: "1 day",
  symptomSeverity: "moderate",
  symptoms: "I am feeling pains in my lower abdomen.",
};

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--input)] px-4 py-3 outline-none transition focus:border-[var(--ring)]";

export function AssessmentForm() {
  const [result, setResult] = useState<AssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState(sampleData);

  function updateField(name: keyof typeof formData, value: string | boolean) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(formDataObject: FormData) {
    setError(null);
    setResult(null);

    const payload = {
      age: formDataObject.get("age"),
      sex: formDataObject.get("sex"),
      weightKg: formDataObject.get("weightKg"),
      allergies: String(formDataObject.get("allergies") ?? ""),
      existingConditions: String(formDataObject.get("existingConditions") ?? ""),
      currentMedications: String(formDataObject.get("currentMedications") ?? ""),
      isPregnantOrBreastfeeding: formDataObject.get("isPregnantOrBreastfeeding") === "on",
      symptomDuration: formDataObject.get("symptomDuration"),
      symptomSeverity: formDataObject.get("symptomSeverity"),
      symptoms: formDataObject.get("symptoms"),
    };

    const response = await fetch("/api/assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as
      | AssessmentResponse
      | {
          error?: string;
        };

    if (!response.ok || "error" in data) {
      const message =
        "error" in data ? data.error ?? "Unable to generate recommendation right now." : "Unable to generate recommendation right now.";
      setError(message);
      return;
    }

    if (!isAssessmentResponse(data)) {
      setError("The recommendation engine returned an unexpected response.");
      return;
    }

    setResult(data);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="theme-card rounded-[1.75rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="eyebrow">AI Assessment</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Collect key health context in a single flow.</h2>
          </div>
          <button type="button" onClick={() => setFormData(sampleData)} className="btn-outline rounded-full px-4 py-2 text-sm font-semibold transition">
            Load demo example
          </button>
        </div>

        <form
          className="mt-8 space-y-4"
          action={(currentFormData) =>
            startTransition(async () => {
              await handleSubmit(currentFormData);
            })
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm font-medium">
              Age
              <input name="age" value={formData.age} onChange={(event) => updateField("age", event.target.value)} className={fieldClass} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Sex
              <select name="sex" value={formData.sex} onChange={(event) => updateField("sex", event.target.value)} className={fieldClass}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              Weight (kg)
              <input name="weightKg" value={formData.weightKg} onChange={(event) => updateField("weightKg", event.target.value)} className={fieldClass} />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium">
            Allergies
            <input
              name="allergies"
              value={formData.allergies}
              onChange={(event) => updateField("allergies", event.target.value)}
              placeholder="e.g. ibuprofen, acetaminophen"
              className={fieldClass}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 text-sm font-medium">
              Existing conditions / history
              <input
                name="existingConditions"
                value={formData.existingConditions}
                onChange={(event) => updateField("existingConditions", event.target.value)}
                placeholder="e.g. ulcer, asthma, kidney disease"
                className={fieldClass}
              />
            </label>
            <label className="block space-y-2 text-sm font-medium">
              Current medications
              <input
                name="currentMedications"
                value={formData.currentMedications}
                onChange={(event) => updateField("currentMedications", event.target.value)}
                placeholder="e.g. warfarin, omeprazole"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm font-medium">
              Symptom duration
              <select name="symptomDuration" value={formData.symptomDuration} onChange={(event) => updateField("symptomDuration", event.target.value)} className={fieldClass}>
                <option>Today</option>
                <option>1 day</option>
                <option>2-3 days</option>
                <option>4-7 days</option>
                <option>More than a week</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              Symptom severity
              <select name="symptomSeverity" value={formData.symptomSeverity} onChange={(event) => updateField("symptomSeverity", event.target.value)} className={fieldClass}>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--input)] px-4 py-4 text-sm font-medium">
              <input
                type="checkbox"
                name="isPregnantOrBreastfeeding"
                checked={formData.isPregnantOrBreastfeeding}
                onChange={(event) => updateField("isPregnantOrBreastfeeding", event.target.checked)}
                className="h-5 w-5 rounded border-[var(--border)] accent-[var(--primary)]"
              />
              Pregnant or breastfeeding?
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium">
            How do you feel?
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={(event) => updateField("symptoms", event.target.value)}
              rows={5}
              className={`${fieldClass} rounded-[1.5rem]`}
            />
          </label>

          <button type="submit" disabled={isPending} className="btn-solid w-full rounded-full px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? "Generating recommendation..." : "Generate wellness recommendation"}
          </button>
        </form>

        <p className="theme-muted mt-4 text-xs leading-5">
          OpenAI evaluates the full symptom profile, while local safety checks filter unsafe OTC outputs before anything is shown.
        </p>
      </div>

      <div className="space-y-6">
        <div className="theme-card rounded-[1.75rem] p-6 md:p-8">
          <span className="eyebrow">Live Output</span>
          {error ? (
            <div className="mt-5 rounded-[1.5rem] border border-[rgba(185,28,28,0.2)] bg-[rgba(185,28,28,0.08)] p-5 text-sm text-[var(--danger)]">
              {error}
            </div>
          ) : null}
          {result ? (
            <div className="mt-5 space-y-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Summary</div>
                <p className="mt-2 text-lg leading-7">{result.summary}</p>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Recommended products</div>
                <div className="mt-3 space-y-3">
                  {result.recommendedProducts.length > 0 ? (
                    result.recommendedProducts.map((product) => (
                      <article key={product.name} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                        <div className="text-lg font-semibold">{product.name}</div>
                        <p className="theme-muted mt-2 text-sm leading-6">{product.reason}</p>
                        {product.caution ? <p className="mt-2 text-xs leading-5 text-[var(--danger)]">{product.caution}</p> : null}
                      </article>
                    ))
                  ) : (
                    <div className="theme-muted rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4 text-sm leading-6">
                      No OTC product was surfaced after safety checks. Use the escalation advice below as the recommended next step.
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Self-care</div>
                  <ul className="theme-muted mt-3 space-y-2 text-sm leading-6">
                    {result.selfCareSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Escalation advice</div>
                  <p className="theme-muted mt-3 text-sm leading-6">{result.escalationAdvice}</p>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--primary)_18%,transparent)] bg-[color:color-mix(in_srgb,var(--secondary)_40%,white)] p-4 text-xs leading-5 text-[var(--secondary-foreground)]">
                {result.disclaimer}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.75rem] border border-dashed border-[var(--border)] bg-[var(--background)] p-6">
              <p className="theme-muted text-sm leading-6">
                Run the assessment to generate a live recommendation card. The sample demo case returns Paracetamol for lower abdominal pain with ulcer history, but the engine now also considers allergies, medications, pregnancy status, severity, and duration.
              </p>
            </div>
          )}
        </div>

        <div className="theme-card rounded-[1.75rem] p-6 md:p-8">
          <span className="eyebrow">Safety Positioning</span>
          <ul className="theme-muted mt-5 space-y-3 text-sm leading-6">
            <li>OpenAI is the primary recommendation engine and works from the full intake profile.</li>
            <li>Recommendations are filtered back to an approved OTC catalog before display.</li>
            <li>Red-flag symptoms, risky conditions, or medication conflicts can suppress OTC recommendations entirely.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
