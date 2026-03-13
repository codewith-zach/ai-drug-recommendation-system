import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] pb-12 pt-10">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-white">
                OW
              </div>
              <div className="text-lg font-semibold">OTC Wellness AI</div>
            </div>
            <p className="mt-3 max-w-xl text-sm text-[var(--muted-foreground)]">
              Presentation-ready SaaS demo for safe OTC wellness guidance. Not a diagnosis or emergency service.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-[var(--muted-foreground)]">
            <Link href="/">Home</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/login">Login</Link>
            <Link href="/app">Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
