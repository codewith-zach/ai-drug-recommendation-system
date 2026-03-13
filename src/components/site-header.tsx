import Link from "next/link";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20">
      <div className="shell pt-4">
        <div className="glass flex items-center justify-between rounded-full bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-white">
              AI
            </div>
            <div>
              <div className="text-lg font-semibold leading-none">OTC Suggestion System</div>
              <div className="text-xs text-[var(--muted-foreground)]">Medication-aware personalized guidance</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-outline rounded-full px-4 py-2 text-sm font-medium transition">
              Login
            </Link>
            <Link href="/signup" className="btn-solid rounded-full px-4 py-2 text-sm font-semibold transition">
              Start free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
