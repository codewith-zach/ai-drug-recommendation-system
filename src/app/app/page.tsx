import Link from "next/link";
import { AssessmentForm } from "@/components/assessment-form";
import { SiteFooter } from "@/components/site-footer";

const dashboardStats = [
  { label: "Core layers", value: "5" },
  { label: "Sample cases", value: "2" },
  { label: "Safety filter", value: "Active" },
];

export default function AppDashboardPage() {
  return (
    <main className="min-h-screen pb-10 pt-6">
      <section className="theme-section">
        <div className="shell">
          <div className="theme-card theme-spotlight rounded-[1.75rem] p-6 md:p-8">
            <div className="relative z-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <span className="eyebrow">Dashboard</span>
                  <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
                    Personalized OTC suggestions in one safety-screened workflow.
                  </h1>
                  <p className="theme-muted mt-5 max-w-3xl text-base leading-7">
                    This screen now demonstrates the exact engine described in the requirements document: symptom interpretation, drug-interaction filtering, explainable recommendations, and escalation guidance.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/pricing" className="btn-outline rounded-full px-5 py-3 text-sm font-semibold">
                    View plans
                  </Link>
                  <Link href="/checkout?plan=care%20plus&billing=yearly" className="btn-solid rounded-full px-5 py-3 text-sm font-semibold">
                    Mock upgrade
                  </Link>
                </div>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {dashboardStats.map((item) => (
                  <article key={item.label} className="rounded-[1.25rem] border border-[var(--border)] bg-white/80 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{item.label}</div>
                    <div className="mt-3 text-3xl font-semibold">{item.value}</div>
                  </article>
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Assessment mode</div>
                  <p className="mt-2 text-sm leading-6">The assessment is narrowed to age group, symptoms, medications, allergies, and symptom duration.</p>
                </div>
                <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Safety filter</div>
                  <p className="mt-2 text-sm leading-6">Medication interactions, adult-only products, and symptom persistence all affect what can be recommended.</p>
                </div>
                <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--background)] p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Explainability</div>
                  <p className="mt-2 text-sm leading-6">Each result now shows symptom clusters, avoided products, dosage, reasoning, and escalation advice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="theme-section py-8">
        <div className="shell">
          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            <div className="theme-card rounded-[1.5rem] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Recommended demo path</div>
              <p className="mt-3 text-sm leading-6">
                Start with the warfarin abdominal-pain case to show NSAID avoidance, then switch to cough and catarrh to show multi-product OTC recommendations.
              </p>
            </div>
            <div className="theme-card rounded-[1.5rem] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Key message</div>
              <p className="mt-3 text-sm leading-6">
                The product recommends only low-risk OTC support and stays disciplined enough to withhold treatment when symptoms look risky or the age profile is uncertain.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="theme-section pb-8">
        <div className="shell">
          <AssessmentForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
