import { HeroLiveInsight } from "./ui/HeroLiveInsight";
import { IntegrationMark } from "./ui/IntegrationMark";
import { INTEGRATIONS, DEMO_URL } from "@/lib/constants";

// Hero. Center-stage layout used by Mobbin / Reflex / Granola / Intercom:
// the headline + subheadline + CTAs sit centered at the top of the page,
// then the product glimpse (HeroLiveInsight — an animated "signals
// crystallising into an insight" sequence) sits below them, then a
// strip of integrations the visitor will recognise.
export function Hero() {
  const STRIP_BRANDS = [
    "Mixpanel",
    "PostHog",
    "Amplitude",
    "Hotjar",
    "Zendesk",
    "Intercom",
    "Linear",
    "Jira",
    "BigQuery",
    "Slack",
  ];
  const stripItems = STRIP_BRANDS.map(
    (name) => INTEGRATIONS.find((i) => i.name === name)
  ).filter(Boolean) as typeof INTEGRATIONS;

  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 md:pt-28 pb-12 md:pb-16">
        {/* Center-stack: headline · subhead · CTAs · proof */}
        <div className="mx-auto max-w-6xl text-center flex flex-col items-center">
          <h1
            className="fade-up text-[32px] sm:text-[44px] lg:text-[54px] xl:text-[60px] leading-[1.04] tracking-[-0.025em] text-[color:var(--color-foreground)]"
            style={{
              fontFamily: "var(--font-display)",
              animationDelay: "80ms",
            }}
          >
            <span className="lg:whitespace-nowrap">
              The AI teammate that watches your product 24/7,
            </span>
            <br />
            <span className="italic text-[color:var(--color-primary)]">
              so things don&apos;t slip past you.
            </span>
          </h1>

          <p
            className="fade-up mt-7 sm:mt-8 text-[15px] sm:text-[16.5px] lg:text-[17.5px] leading-[1.6] text-[color:var(--color-foreground-secondary)] max-w-[640px] lg:max-w-none"
            style={{ animationDelay: "180ms" }}
          >
            <span className="lg:whitespace-nowrap">
              Always monitoring your analytics, session replays, support tickets, and error logs.
            </span>
            <br />
            <span className="lg:whitespace-nowrap">
              Squash discovers insights on its own, and tells your team what to fix and ship next.
            </span>
          </p>

          <div
            className="fade-up mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-3 rounded-full bg-[color:var(--color-primary)] text-white font-medium text-[14px] sm:text-[15px] hover:bg-[color:var(--color-primary-hover)] transition-colors"
            >
              Book a demo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-1.5 px-5 sm:px-6 py-3 rounded-full bg-white border border-[color:var(--color-border)] text-[color:var(--color-foreground)] font-medium text-[14px] sm:text-[15px] hover:border-[color:var(--color-foreground)] transition-colors"
            >
              See how it works
            </a>
          </div>

        </div>

        {/* Product glimpse — animated: signals stream in from the connected
            tools (Zendesk · Mixpanel · Sentry · PostHog) and crystallise
            into the insight card Squash would push. */}
        <div
          className="fade-up mt-12 md:mt-16 mx-auto"
          style={{ animationDelay: "480ms" }}
        >
          <HeroLiveInsight />
        </div>

        {/* Integration strip */}
        <div
          className="fade-up mt-16 md:mt-20 pt-8 border-t border-[color:var(--color-border)]/60"
          style={{ animationDelay: "600ms" }}
        >
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-foreground-muted)]">
            Plugs into your existing product stack
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-90">
            {stripItems.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 text-[color:var(--color-foreground-secondary)] hover:text-[color:var(--color-foreground)] transition-colors"
              >
                <IntegrationMark
                  name={item.name}
                  color={item.color}
                  slug={item.slug}
                  size={18}
                />
                <span className="text-[13px] font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
