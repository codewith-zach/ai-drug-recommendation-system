"use client";

import { useState } from "react";
import { PricingCard, type Plan } from "@/components/pricing-card";

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: "$9",
    yearly: "$84",
    description: "For individuals who want guided OTC check-ins and quick symptom support.",
    features: ["Unlimited AI assessments", "Daily symptom check-ins", "Safety-first OTC guidance"],
  },
  {
    name: "Care Plus",
    monthly: "$19",
    yearly: "$180",
    description: "Best for households that want profile switching and faster triage guidance.",
    badge: "Most Popular",
    features: ["Everything in Starter", "Up to 4 family profiles", "Priority pharmacist escalation prompts"],
  },
  {
    name: "Clinic Demo",
    monthly: "$49",
    yearly: "$468",
    description: "For wellness programs and pitch demos that need branded experiences.",
    features: ["Everything in Care Plus", "Custom branding", "Demo analytics and investor-ready reporting"],
  },
];

export function PricingSection({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className={compact ? "" : "py-24"}>
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Pricing</span>
            <h2 className="section-title mt-5 font-bold">Subscription plans that look investor-ready.</h2>
            <p className="theme-muted mt-4 text-base leading-7 md:text-lg">
              Use monthly for the live demo, or flip to annual to show SaaS-style lifetime value instantly.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white/75 p-2">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                annual ? "text-[var(--muted-foreground)]" : "bg-[var(--primary)] text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                annual ? "bg-[var(--primary)] text-white" : "text-[var(--muted-foreground)]"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} annual={annual} />
          ))}
        </div>
      </div>
    </section>
  );
}
