"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SessionReplayCard } from "./ui/SessionReplayCard";

// Showcase 01 · Detection. Recreates the deck's "tells you what
// happened" view: an insight card with impact, stats, customer quote,
// and the session replays that back it up. Establishes proof that
// Squash doesn't just alert — it brings the receipts.
export function ShowcaseDetect() {
  const reduce = useReducedMotion();

  const stagger = (delay: number) =>
    reduce
      ? { duration: 0 }
      : { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section
      id="product"
      aria-labelledby="detect-heading"
      className="py-16 sm:py-20 md:py-32 bg-[color:var(--color-surface)] border-y border-[color:var(--color-border)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            01 · Detects what matters
          </p>
          <h2
            id="detect-heading"
            className="mt-3 text-[30px] sm:text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Spots drop-offs, anomalies and pain points{" "}
            <span className="italic text-[color:var(--color-primary)]">before you do.</span>
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl">
            Every insight measures impact, names what happened, and shows you
            the user sessions and customer quotes that back it up. No more
            chasing a metric to figure out why.
          </p>
        </div>

        {/* Main mockup */}
        <div className="relative mt-12 md:mt-16 grid lg:grid-cols-12 gap-6">
          {/* Insight card (8 cols) */}
          <motion.article
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={stagger(0)}
            className="lg:col-span-8 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_30px_80px_-40px_rgba(26,26,26,0.18)] overflow-hidden"
          >
            <div className="px-5 sm:px-7 py-5 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
                  Insight
                </span>
                <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
                  · 08:14 IST · 4 sources
                </span>
              </div>
              <h3 className="mt-2 text-[18px] sm:text-[20px] font-semibold leading-snug text-[color:var(--color-foreground)]">
                34 tickets in 72h: Promo code applied but not reflected in final charge
              </h3>
              <p className="mt-1 text-[12.5px] text-[color:var(--color-foreground-muted)]">
                Recurring theme · 28 unique users · 4 high-value accounts affected
              </p>
            </div>

            <div className="p-5 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-foreground-muted)]">
                What happened
              </p>
              <p className="mt-2 text-[13.5px] sm:text-[14px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
                A cluster of 34 support tickets in the last 72 hours all describe the
                same issue: users apply a valid promo code at checkout, see a
                &ldquo;Discount applied&rdquo; confirmation, but the final order total
                reflects the original price. The issue spans mobile and web. 4 tickets
                are from Enterprise plan users with ARR above ₹5L each.
              </p>

              {/* Stat grid */}
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={stagger(0.2)}
                className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
              >
                {[
                  { label: "Tickets (72h)", value: "34", emphasis: true },
                  { label: "Unique users", value: "28" },
                  { label: "Enterprise accounts", value: "4" },
                  { label: "Since first report", value: "72h" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ ...stagger(0.25 + i * 0.06) }}
                    className="rounded-lg border border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)] p-3"
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-foreground-muted)]">
                      {s.label}
                    </p>
                    <p
                      className={`mt-1 text-[22px] sm:text-[26px] font-semibold tabular-nums leading-none ${
                        s.emphasis
                          ? "text-[color:var(--color-primary)]"
                          : "text-[color:var(--color-foreground)]"
                      }`}
                    >
                      {s.value}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Customer quote */}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={stagger(0.55)}
                className="mt-6 p-4 rounded-lg bg-[color:var(--color-background-tertiary)] border-l-2 border-[color:var(--color-primary)]"
              >
                <p className="text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
                  #ZD-8851
                </p>
                <p className="mt-1.5 text-[13.5px] italic text-[color:var(--color-foreground)] leading-relaxed">
                  &ldquo;The promo code works. I can see the discount in the cart summary.
                  But when I complete payment the receipt shows full price. Feels
                  broken.&rdquo;
                </p>
              </motion.div>
            </div>
          </motion.article>

          {/* Right rail (4 cols) — impact badge + sessions */}
          <div className="lg:col-span-4 space-y-4">
            {/* Impact callout */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={stagger(0.1)}
              className="rounded-xl p-5 bg-[color:var(--color-primary)] text-white shadow-[0_20px_50px_-20px_rgba(232,100,15,0.4)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80 flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                  <polyline points="16 17 22 17 22 11" />
                </svg>
                Impact
              </p>
              <p className="mt-2 text-[22px] sm:text-[24px] font-semibold leading-tight">
                ₹3.8L in overcharges issued
              </p>
              <p className="text-[12.5px] text-white/80 mt-1">
                4 enterprise accounts at churn risk
              </p>
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3">
                {[
                  { label: "Confidence", value: "94%" },
                  { label: "Severity", value: "P1" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-white/70 font-semibold">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-[15px] font-semibold">{s.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reference sessions */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={stagger(0.3)}
              className="rounded-xl p-4 bg-white border border-[color:var(--color-border)]"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-foreground-muted)]">
                Reference user sessions
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { idx: 1, duration: "0:22", note: "Tapped checkout 4×. No nav." },
                  { idx: 2, duration: "0:34", note: "Tapped checkout, waited 8s." },
                  { idx: 3, duration: "0:18", note: "Cart loaded. Total wrong." },
                ].map((s, i) => (
                  <motion.div
                    key={s.idx}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={stagger(0.4 + i * 0.08)}
                  >
                    <SessionReplayCard
                      index={s.idx}
                      duration={s.duration}
                      note={s.note}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
