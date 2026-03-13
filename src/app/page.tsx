import Link from "next/link";
import { PricingSection } from "@/components/pricing-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const featureCards = [
  {
    title: "Focused OTC intake",
    text: "Capture age group, symptoms, current medications, allergies, and symptom duration in the exact flow described by the requirements document.",
  },
  {
    title: "Safety-first filtering",
    text: "The engine maps symptom clusters, checks medication interaction risks like warfarin plus NSAIDs, and suppresses unsafe OTC choices before display.",
  },
  {
    title: "Explainable suggestions",
    text: "Every result includes dosage guidance, avoided products, plain-language reasoning, and escalation advice so the recommendation is auditable.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen pb-8">
      <SiteHeader />

      <section className="theme-section relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="shell">
          <div className="theme-card theme-spotlight rounded-[2rem] px-6 py-12 md:px-10 md:py-16">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <span className="eyebrow">AI OTC Suggestion Engine</span>
              <h1 className="section-title mt-6 text-4xl font-bold tracking-tight md:text-6xl">
                AI OTC recommendations shaped around symptoms, medication safety, and explainable guidance.
              </h1>
              <p className="theme-muted mx-auto mt-6 max-w-3xl text-lg leading-8">
                The system is built around the requirements doc: users enter age group, symptoms, medication history, allergies, and duration, then receive safe OTC suggestions with explicit interaction filtering and escalation advice.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/app" className="btn-solid rounded-full px-6 py-3 text-center text-sm font-semibold transition">
                  Launch demo dashboard
                </Link>
                <Link href="/pricing" className="btn-outline rounded-full px-6 py-3 text-center text-sm font-semibold transition">
                  View pricing
                </Link>
              </div>
              <div className="mt-10 flex flex-col items-center justify-center gap-6 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted-foreground)] sm:flex-row">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  Symptom clustering and OTC matching
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  Drug interaction safety filter
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  Explainable recommendation layer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="theme-section pb-16">
        <div className="shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="theme-card rounded-[1.75rem] p-6 md:p-8">
            <div className="theme-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              System Inputs
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Input</div>
                <div className="mt-3 text-sm leading-6">Age group, symptoms, current medications, allergies, and duration of symptoms</div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Logic</div>
                <div className="mt-3 text-sm leading-6">Symptom interpretation, medication interaction screening, age restrictions, and guideline-based OTC product selection.</div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Output</div>
                <div className="mt-3 text-sm leading-6">Recommended products, avoided drugs, dosage suggestions, explanation, and advice on when to seek care.</div>
              </div>
            </div>
          </div>

          <div className="theme-card theme-spotlight rounded-[1.75rem] p-6 md:p-8">
            <div className="relative z-10">
              <div className="theme-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                Five-layer engine
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
                One flow from symptom entry to safe OTC suggestion.
              </h2>
              <p className="theme-muted mt-4 text-base leading-7">
                The product follows the document’s architecture: user input, symptom interpretation, interaction filtering, OTC recommendation, and explainable output.
              </p>
              <div className="mt-6 grid gap-3 text-sm">
                <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-4">
                  Lower abdominal pain with warfarin routes to paracetamol and explicitly blocks NSAIDs because of bleeding-risk concerns.
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-4">
                  Cough and catarrh with no current medication routes to Flucorday, cough syrup, and cetirizine with dosage guidance and safety notes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="theme-section py-16">
        <div className="shell">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why this demo feels like a real product</h2>
            <p className="theme-muted mx-auto mt-4 max-w-2xl text-lg">
              It now behaves like the requirements document, not a generic health-tech mockup.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="theme-card rounded-[1.5rem] p-6 transition hover:border-[color:color-mix(in_srgb,var(--primary)_25%,transparent)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[color:color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                  {card.title.slice(0, 1)}
                </div>
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="theme-muted mt-3 text-sm leading-7">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="theme-section py-16">
        <div className="shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="theme-card rounded-[1.75rem] p-6 md:p-8">
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              A short symptom interview becomes a safety-screened OTC decision.
            </h2>
            <p className="theme-muted mt-5 text-base leading-7">
              The dashboard now walks through the same sequence described in the document, from symptom clustering to recommendation and explanation.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-6">
              <h3 className="text-xl font-semibold">What the audience will understand immediately</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  "Personalized OTC matches within seconds",
                  "Warfarin and NSAID interaction checks",
                  "Clear dosage and explanation for each suggestion",
                  "Escalation when symptoms are too risky or persistent",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <span className="mt-1 h-5 w-5 rounded-full bg-[color:color-mix(in_srgb,var(--primary)_12%,transparent)] text-center text-xs font-bold leading-5 text-[var(--primary)]">
                      +
                    </span>
                    <span className="text-sm text-[var(--foreground)]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              "Collect age group, symptoms, medications, allergies, and symptom duration",
              "Interpret the symptom cluster and classify likely OTC support needs",
              "Filter products against medication interactions and age restrictions",
              "Return recommendations, avoided drugs, explanation, and escalation advice",
            ].map((step, index) => (
              <div key={step} className="theme-card rounded-[1.5rem] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-white">
                    0{index + 1}
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{step}</div>
                    <p className="theme-muted mt-2 text-sm leading-6">
                      {index === 0
                        ? "The intake is now intentionally narrow so it matches the actual system overview in the document."
                        : index === 1
                          ? "Symptom interpretation groups free text into pain, respiratory, and allergy-linked pathways."
                          : index === 2
                            ? "Unsafe options are suppressed before display, including NSAIDs when warfarin is present."
                            : "The final screen shows not only what to use, but also what was deliberately avoided and when to escalate."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="theme-section pb-8 pt-8">
        <div className="shell">
          <div className="theme-card rounded-[1.75rem] p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="eyebrow">Safety Notice</span>
                <p className="theme-muted mt-4 max-w-3xl text-base leading-7">
                  This OTC suggestion system is for informational guidance only. It does not diagnose illness, replace clinical judgment, or handle emergencies. Red-flag symptoms should trigger immediate escalation.
                </p>
              </div>
              <Link href="/app" className="btn-solid rounded-full px-6 py-3 text-center text-sm font-semibold transition">
                Try the assessment
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />
      <SiteFooter />
    </main>
  );
}
