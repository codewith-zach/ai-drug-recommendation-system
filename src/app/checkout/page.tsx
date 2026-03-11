import Link from "next/link";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const plan = typeof params.plan === "string" ? params.plan : "care plus";
  const billing = typeof params.billing === "string" ? params.billing : "monthly";

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass rounded-[2rem] p-8">
          <span className="eyebrow">Mock Checkout</span>
          <h1 className="mt-6 font-[var(--font-display)] text-5xl leading-none md:text-7xl">
            Upgrade to the {plan} plan.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--ink-soft)]">
            This is a presentation-safe checkout screen. It demonstrates conversion flow without requiring Stripe or handling real payment data before tomorrow’s presentation.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">Selected plan</div>
              <div className="mt-2 text-2xl font-semibold capitalize">{plan}</div>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/80 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">Billing cycle</div>
              <div className="mt-2 text-2xl font-semibold capitalize">{billing}</div>
            </div>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-8">
          <h2 className="text-2xl font-semibold">What to say in the demo</h2>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-[var(--ink-soft)]">
            <li>The product supports both monthly and annual subscriptions.</li>
            <li>Billing is mocked here to keep the MVP focused on the recommendation engine.</li>
            <li>The next production step would be Stripe checkout and account entitlements.</li>
          </ul>
          <div className="mt-8 grid gap-3">
            <Link
              href="/app"
              className="btn-solid rounded-full px-4 py-3 text-center text-sm font-semibold transition"
            >
              Return to dashboard
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-[var(--border)] px-4 py-3 text-center text-sm font-semibold"
            >
              Back to pricing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
