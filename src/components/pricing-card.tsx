import Link from "next/link";

export type Plan = {
  name: string;
  monthly: string;
  yearly: string;
  description: string;
  badge?: string;
  features: string[];
};

export function PricingCard({
  plan,
  annual,
}: {
  plan: Plan;
  annual: boolean;
}) {
  return (
    <article className="theme-card flex h-full flex-col rounded-[1.75rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold">{plan.name}</h3>
          <p className="theme-muted mt-2 text-sm">{plan.description}</p>
        </div>
        {plan.badge ? (
          <span className="theme-chip rounded-full px-3 py-1 text-xs font-semibold">
            {plan.badge}
          </span>
        ) : null}
      </div>
      <div className="mt-8 flex items-end gap-2">
        <span className="text-5xl font-bold leading-none">
          {annual ? plan.yearly : plan.monthly}
        </span>
        <span className="theme-muted pb-1 text-sm">/{annual ? "year" : "month"}</span>
      </div>
      <ul className="theme-muted mt-8 space-y-3 text-sm">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/checkout?plan=${encodeURIComponent(plan.name.toLowerCase())}&billing=${annual ? "yearly" : "monthly"}`}
        className="btn-solid mt-8 rounded-full px-4 py-3 text-center text-sm font-semibold transition"
      >
        Select {plan.name}
      </Link>
    </article>
  );
}
