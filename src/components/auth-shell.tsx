import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  mode,
}: {
  title: string;
  subtitle: string;
  mode: "login" | "signup";
}) {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass flex min-h-[560px] flex-col justify-between rounded-[2rem] p-8">
          <div>
            <span className="eyebrow">Demo Auth</span>
            <h1 className="mt-6 max-w-xl font-[var(--font-display)] text-5xl leading-none md:text-7xl">
              Personalized OTC guidance that feels like a real health SaaS.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--ink-soft)]">
              This authentication flow is intentionally lightweight for presentation use. It creates a convincing product experience without storing health data.
            </p>
          </div>
          <div className="grid gap-4 rounded-[1.5rem] border border-[var(--border)] bg-[rgba(15,118,110,0.08)] p-5 text-sm text-[var(--foreground)]">
            <div className="font-semibold">What the live demo includes</div>
            <div>Structured symptom intake</div>
            <div>AI-polished OTC recommendations</div>
            <div>Pricing, upgrade, and mock checkout flows</div>
          </div>
        </section>

        <section className="glass rounded-[2rem] p-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm font-medium text-[var(--ink-soft)]">
              Back to home
            </Link>
            <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-dark)]">
              No real auth backend
            </span>
          </div>

          <h2 className="mt-8 text-3xl font-semibold">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{subtitle}</p>

          <form action="/app" className="mt-8 space-y-4">
            {mode === "signup" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  First name
                  <input
                    name="firstName"
                    placeholder="Ada"
                    className="w-full rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--brand)]"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Last name
                  <input
                    name="lastName"
                    placeholder="Okafor"
                    className="w-full rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--brand)]"
                  />
                </label>
              </div>
            ) : null}

            <label className="block space-y-2 text-sm font-medium">
              Email
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--brand)]"
              />
            </label>

            <label className="block space-y-2 text-sm font-medium">
              Password
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--brand)]"
              />
            </label>

            {mode === "signup" ? (
              <label className="block space-y-2 text-sm font-medium">
                Intended use
                <select className="w-full rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--brand)]">
                  <option>Personal wellness</option>
                  <option>Family care</option>
                  <option>Clinic demo</option>
                </select>
              </label>
            ) : null}

            <button
              type="submit"
              className="btn-solid w-full rounded-full px-4 py-3 text-sm font-semibold transition"
            >
              {mode === "signup" ? "Create demo account" : "Enter dashboard"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--ink-soft)]">
            {mode === "signup" ? "Already have a demo account?" : "Need a demo account?"}{" "}
            <Link href={mode === "signup" ? "/login" : "/signup"} className="font-semibold text-[var(--foreground)] underline decoration-[var(--brand)] underline-offset-4">
              {mode === "signup" ? "Login" : "Create one"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
