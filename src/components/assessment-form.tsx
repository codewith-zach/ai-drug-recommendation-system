"use client";

import { useState, useTransition } from "react";
import { isAssessmentResponse, type AssessmentResponse } from "@/lib/assessment";

const abdominalPainCase = {
  ageGroup: "adult",
  symptoms: "Lower abdominal pain",
  currentMedications: "Warfarin",
  allergies: "",
  symptomDuration: "1-2 days",
};

const coughAndCatarrhCase = {
  ageGroup: "adult",
  symptoms: "Cough and catarrh",
  currentMedications: "None",
  allergies: "",
  symptomDuration: "3-5 days",
};

const fieldClass =
  "w-full rounded-2xl border border-[var(--border)] bg-[var(--input)] px-4 py-3 outline-none transition focus:border-[var(--ring)]";

export function AssessmentForm() {
  const [result, setResult] = useState<AssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState(abdominalPainCase);

  function updateField(name: keyof typeof formData, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(formDataObject: FormData) {
    setError(null);
    setResult(null);

    const payload = {
      ageGroup: formDataObject.get("ageGroup"),
      symptoms: formDataObject.get("symptoms"),
      currentMedications: String(formDataObject.get("currentMedications") ?? ""),
      allergies: String(formDataObject.get("allergies") ?? ""),
      symptomDuration: formDataObject.get("symptomDuration"),
    };

    const response = await fetch("/api/assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as AssessmentResponse | { error?: string };

    if (!response.ok || "error" in data) {
      setError("error" in data ? data.error ?? "Unable to generate recommendation right now." : "Unable to generate recommendation right now.");
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
            <span className="eyebrow">Assessment Input</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Collect the exact OTC decision inputs from the requirements doc.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setFormData(abdominalPainCase)} className="btn-outline rounded-full px-4 py-2 text-sm font-semibold transition">
              Load warfarin pain case
            </button>
            <button type="button" onClick={() => setFormData(coughAndCatarrhCase)} className="btn-outline rounded-full px-4 py-2 text-sm font-semibold transition">
              Load cough case
            </button>
          </div>
        </div>

        <form
          className="mt-8 space-y-4"
          action={(currentFormData) =>
            startTransition(async () => {
              await handleSubmit(currentFormData);
            })
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Age group
              <select name="ageGroup" value={formData.ageGroup} onChange={(event) => updateField("ageGroup", event.target.value)} className={fieldClass}>
                <option value="adult">Adult</option>
                <option value="child">Child</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              Duration of symptoms
              <select
                name="symptomDuration"
                value={formData.symptomDuration}
                onChange={(event) => updateField("symptomDuration", event.target.value)}
                className={fieldClass}
              >
                <option>Today</option>
                <option>1-2 days</option>
                <option>3-5 days</option>
                <option>5-7 days</option>
                <option>More than 7 days</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium">
            Symptoms
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={(event) => updateField("symptoms", event.target.value)}
              rows={4}
              placeholder="Examples: Lower abdominal pain, Cough and catarrh"
              className={`${fieldClass} rounded-[1.5rem]`}
            />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            Current medications
            <input
              name="currentMedications"
              value={formData.currentMedications}
              onChange={(event) => updateField("currentMedications", event.target.value)}
              placeholder="Examples: Warfarin, None"
              className={fieldClass}
            />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            Allergies (optional)
            <input
              name="allergies"
              value={formData.allergies}
              onChange={(event) => updateField("allergies", event.target.value)}
              placeholder="Examples: Paracetamol, Cetirizine"
              className={fieldClass}
            />
          </label>

          <button type="submit" disabled={isPending} className="btn-solid w-full rounded-full px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? "Generating OTC suggestion..." : "Generate OTC suggestion"}
          </button>
        </form>

        <p className="theme-muted mt-4 text-xs leading-5">
          The engine interprets symptoms, checks medication safety, applies age restrictions, and explains why each OTC option is recommended or withheld.
        </p>
      </div>

      <div className="space-y-6">
        <div className="theme-card rounded-[1.75rem] p-6 md:p-8">
          <span className="eyebrow">Recommendation Output</span>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Symptom clusters</div>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    {result.symptomClusters.length > 0 ? (
                      result.symptomClusters.map((cluster) => <li key={cluster}>{cluster}</li>)
                    ) : (
                      <li className="theme-muted">No cluster was confidently assigned.</li>
                    )}
                  </ul>
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Avoided products</div>
                  <ul className="mt-3 space-y-2 text-sm leading-6">
                    {result.avoidedProducts.length > 0 ? (
                      result.avoidedProducts.map((product) => <li key={product}>{product}</li>)
                    ) : (
                      <li className="theme-muted">No specific OTC exclusions were triggered.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Recommended products</div>
                <div className="mt-3 space-y-3">
                  {result.recommendedProducts.length > 0 ? (
                    result.recommendedProducts.map((product) => (
                      <article key={product.name} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                          <div className="text-lg font-semibold">{product.name}</div>
                          <div className="text-sm font-medium text-[var(--secondary-foreground)]">{product.dosage}</div>
                        </div>
                        <div className="mt-3 text-sm font-medium">{product.function}</div>
                        <p className="theme-muted mt-2 text-sm leading-6">{product.reason}</p>
                        {product.caution ? <p className="mt-2 text-xs leading-5 text-[var(--danger)]">{product.caution}</p> : null}
                      </article>
                    ))
                  ) : (
                    <div className="theme-muted rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4 text-sm leading-6">
                      No OTC product was surfaced after safety checks. Use the escalation guidance below as the recommended next step.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Explanation</div>
                <p className="theme-muted mt-3 text-sm leading-6">{result.explanation}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Safety notes</div>
                  <ul className="theme-muted mt-3 space-y-2 text-sm leading-6">
                    {result.safetyNotes.map((note) => (
                      <li key={note}>{note}</li>
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
                Load either example from the requirements document to demo the core safety logic: paracetamol for lower abdominal pain with warfarin, or the adult cough-and-catarrh combination of Flucorday, cough syrup, and cetirizine.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
