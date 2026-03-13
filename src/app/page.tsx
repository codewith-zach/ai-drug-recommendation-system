import Link from "next/link";
import { PricingSection } from "@/components/pricing-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const featureCards = [
  {
    title: "Structured health intake",
    text: "Collect age, sex, body weight, allergies, conditions, current medications, pregnancy status, severity, duration, and symptom narrative in one branded flow.",
  },
  {
    title: "OpenAI-powered decision engine",
    text: "OpenAI analyzes the full health profile and generates the recommendation, while local guardrails filter unsafe outputs before display.",
  },
  {
    title: "SaaS-ready presentation",
    text: "Landing page, pricing, login, dashboard, and mock upgrade journey are all included for tomorrow’s pitch.",
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
              <span className="eyebrow">OTC Wellness SaaS Demo</span>
              <h1 className="section-title mt-6 text-4xl font-bold tracking-tight md:text-6xl">
                OpenAI-powered OTC recommendations tailored to the full patient profile.
              </h1>
              <p className="theme-muted mx-auto mt-6 max-w-3xl text-lg leading-8">
                Show a believable health-tech product by tomorrow: users sign up, describe symptoms, medications, health history, and urgency, then receive AI-generated OTC guidance with a clean SaaS conversion flow.
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
                  OpenAI-driven recommendation engine
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  Safety-filtered OTC catalog
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  Session-only intake for the demo
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
              What the engine uses
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Input</div>
                <div className="mt-3 text-sm leading-6">Age, sex, weight, allergies, conditions, medications, severity, duration, symptoms</div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Engine</div>
                <div className="mt-3 text-sm leading-6">OpenAI reasons over the full profile, then local safety rules validate the output.</div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Business</div>
                <div className="mt-3 text-sm leading-6">Pricing, auth UI, and mock subscription conversion are already wired for the pitch.</div>
              </div>
            </div>
          </div>

          <div className="theme-card theme-spotlight rounded-[1.75rem] p-6 md:p-8">
            <div className="relative z-10">
              <div className="theme-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
                AI profile engine
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
                One intake flow, multiple OTC use cases.
              </h2>
              <p className="theme-muted mt-4 text-base leading-7">
                The engine evaluates pain, fever, allergy, reflux, dehydration, cough, sore throat, and congestion patterns using the entire health profile instead of a single narrow scenario.
              </p>
              <div className="mt-6 grid gap-3 text-sm">
                <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-4">
                  OpenAI reasons over age, medications, pregnancy status, allergies, conditions, severity, and duration before suggesting any OTC option.
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white/80 p-4">
                  Local guardrails remove unsafe options and switch to escalation advice whenever the profile looks risky.
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
              The visual system, AI flow, and monetization story now match a polished wellness SaaS instead of a one-off prototype.
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
              A short symptom interview becomes an AI-assisted OTC decision.
            </h2>
            <p className="theme-muted mt-5 text-base leading-7">
              The dashboard collects a richer health profile, lets OpenAI choose from the approved OTC catalog, and then applies final safety filters before showing the result.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-6">
              <h3 className="text-xl font-semibold">What the audience will understand immediately</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  "Personalized product matches within seconds",
                  "Medication and condition-aware reasoning",
                  "Clear escalation when self-treatment is risky",
                  "Investor-friendly SaaS pricing story",
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
              "Collect symptom context, medical history, and current medication use",
              "Send the full profile to the OpenAI recommendation engine",
              "Filter the result against local safety and catalog rules",
              "Return recommendation, self-care, and escalation advice",
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
                        ? "The flow captures the exact context needed for OTC reasoning without forcing a long onboarding."
                        : index === 1
                          ? "OpenAI does the heavy lifting and is no longer limited to a single ulcer-oriented rule path."
                          : index === 2
                            ? "Unsafe or off-catalog outputs are stripped before they ever reach the UI."
                            : "The result stays concise enough for a live demo while still feeling medically cautious."}
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
                  OTC Wellness AI is for informational guidance only. It is not a substitute for diagnosis, prescription, emergency support, or clinician judgment. Red-flag symptoms should trigger immediate escalation.
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
