import { PricingSection } from "@/components/pricing-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PricingPage() {
  return (
    <main className="pb-8">
      <SiteHeader />
      <section className="px-4 py-16">
        <div className="shell glass rounded-[2rem] p-8 md:p-10">
          <span className="eyebrow">Monetization</span>
          <h1 className="section-title mt-5 font-[var(--font-display)]">Monthly and yearly plans built for the pitch.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--ink-soft)] md:text-lg">
            These plans are intentionally demo-friendly: enough SaaS structure to feel real, without payment processor complexity slowing the presentation.
          </p>
        </div>
      </section>
      <PricingSection compact />
      <SiteFooter />
    </main>
  );
}
