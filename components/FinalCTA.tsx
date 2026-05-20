import { DEMO_URL, FOUNDER_EMAIL } from "@/lib/constants";

// Final CTA — one promise, one primary button. The demo is intentionally
// concrete ("we'll plug into one of your tools live") so it doesn't read
// like a generic SaaS sales pitch.
export function FinalCTA() {
  return (
    <section id="get-started" className="relative overflow-hidden py-16 sm:py-20 md:py-32 bg-[color:var(--color-background)]">
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="absolute inset-0 dot-bg opacity-30" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2
          className="text-[32px] sm:text-[40px] md:text-[56px] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-foreground)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Want to see Squash investigate
          <br />
          <span className="italic text-[color:var(--color-primary)]">
            one of your real issues?
          </span>
        </h2>
        <p className="mt-5 sm:mt-6 text-[15px] sm:text-[17px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl mx-auto">
          A 30-minute demo. We&apos;ll plug into one of your tools live and run
          an investigation on your actual data. You leave with a working
          insight, not a sales pitch.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-[color:var(--color-primary)] text-white font-medium text-sm hover:bg-[color:var(--color-primary-hover)] transition-colors"
          >
            Book a demo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href={`mailto:${FOUNDER_EMAIL}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border border-[color:var(--color-border)] text-[color:var(--color-foreground)] font-medium text-sm hover:border-[color:var(--color-foreground)] transition-colors"
          >
            Email the founders
          </a>
        </div>
      </div>
    </section>
  );
}
