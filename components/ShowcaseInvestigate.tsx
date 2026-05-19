"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ToolTag } from "./ui/ToolTag";

// Showcase 02 · Investigation. The investigation log (left) and the
// root-cause panel + action buttons (right). This is the section that
// proves Squash isn't just an alert tool — it does the cross-tool
// reasoning a human PM doesn't have time for.

const INVESTIGATION_STEPS = [
  {
    title: "Ticket clustering",
    time: "08:12 IST",
    tools: ["Zendesk"],
    body: "Scanned 142 new tickets from the last 72h. Identified 34 mentioning promo / coupon failures at checkout. Clustered by issue similarity. All 34 describe the same pattern: discount appears applied in the UI but the charged amount reflects the original price. No similar cluster in the prior 30 days.",
  },
  {
    title: "Verified discount not reaching payment",
    time: "08:18 IST",
    tools: ["Mixpanel", "BigQuery"],
    body: "Cross-referenced 12 user IDs from the ticket sample with Mixpanel events. All 12 fired checkout.promo.applied followed by order.completed, but BigQuery order totals match the pre-discount price for every transaction. Discount registered client-side, never passed to payment.",
  },
  {
    title: "Promo codes themselves are valid",
    time: "08:22 IST",
    tools: ["BigQuery"],
    body: "Queried the promotions table. SUMMER25, FLAT15, WELCOME10 are all active, within validity dates, under usage limits. Codes aren't the problem. The failure is in how the discount is applied at the transaction level.",
  },
  {
    title: "Reviewed 6 session replays",
    time: "08:28 IST",
    tools: ["PostHog"],
    body: "In all 6 sessions, the promo input accepts the code and shows a green “Discount applied” badge. Cart summary updates to reflect the discounted total. But on the final order confirmation, the total reverts to the original. Most users didn't notice until the receipt arrived.",
  },
];

export function ShowcaseInvestigate() {
  const reduce = useReducedMotion();

  const transition = (delay: number) =>
    reduce
      ? { duration: 0 }
      : { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section
      aria-labelledby="investigate-heading"
      className="py-16 sm:py-20 md:py-32 bg-[color:var(--color-background)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            02 · Investigates across tools
          </p>
          <h2
            id="investigate-heading"
            className="mt-3 text-[30px] sm:text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Investigates across{" "}
            <span className="italic text-[color:var(--color-primary)]">
              analytics, session replays, and error logs
            </span>{" "}
            to land on the root cause.
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl">
            Squash doesn't stop at the alert. It autonomously queries every
            connected tool, cross-references signals, and shows you the full
            reasoning trail behind every conclusion.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid lg:grid-cols-12 gap-6">
          {/* Investigation log */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={transition(0)}
            className="lg:col-span-7 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_30px_80px_-40px_rgba(26,26,26,0.18)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-foreground-muted)]">
                Investigation log
              </p>
              <p className="text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
                5 checks · 4 tools · 26 min
              </p>
            </div>

            <ol className="relative px-5 sm:px-7 py-6">
              {/* Vertical timeline rail */}
              <div
                className="absolute left-[34px] sm:left-[44px] top-7 bottom-7 w-px bg-[color:var(--color-border)]"
                aria-hidden="true"
              />
              {INVESTIGATION_STEPS.map((step, i) => (
                <motion.li
                  key={step.title}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + i * 0.18,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex gap-3 sm:gap-4 pb-6 last:pb-0"
                >
                  <div className="relative z-10 flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center text-[12px] font-semibold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="text-[14px] sm:text-[15px] font-semibold text-[color:var(--color-foreground)]">
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
                        {step.time}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12.5px] sm:text-[13px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
                      {step.body}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {step.tools.map((t) => (
                        <ToolTag key={t} name={t} size="xs" />
                      ))}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Root cause + actions */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={transition(0.9)}
              className="rounded-2xl bg-[color:var(--color-primary-subtle)] border border-[color:var(--color-primary-subtle-border)] p-5 sm:p-6 shadow-[0_30px_80px_-40px_rgba(232,100,15,0.4)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2 14 9 21 11 14 13 12 20 10 13 3 11 10 9 Z" />
                  </svg>
                  Root cause
                </span>
                <span className="text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
                  08:38 IST
                </span>
              </div>
              <h3 className="mt-3 text-[18px] sm:text-[20px] font-semibold leading-snug text-[color:var(--color-foreground)]">
                Discount not persisted to order object
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
                Backend integration issue between cart and payment services. Discount
                applied client-side but not passed through to the gateway. First ticket
                filed 72h ago, likely tied to that deployment window.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Zendesk", "Mixpanel", "BigQuery", "PostHog"].map((t) => (
                  <ToolTag key={t} name={t} size="xs" />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={transition(1.1)}
              className="grid sm:grid-cols-2 gap-3"
            >
              <ActionCard
                tool="Linear"
                label="Escalate: promo discount not persisting"
                cta="Create issue in Linear"
              />
              <ActionCard
                tool="GitHub"
                label="Update order-service to forward discount payload"
                cta="Create hotfix in GitHub"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActionCard({
  tool,
  label,
  cta,
}: {
  tool: string;
  label: string;
  cta: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-[color:var(--color-border)] p-4 flex flex-col gap-3">
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-foreground-muted)]">
          Suggested action
        </p>
        <p className="mt-1.5 text-[13px] font-semibold text-[color:var(--color-foreground)] leading-snug">
          {label}
        </p>
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[color:var(--color-foreground)] text-white text-[12px] font-medium mt-auto"
      >
        {cta}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
      <div className="flex items-center gap-1">
        <ToolTag name={tool} size="xs" />
      </div>
    </div>
  );
}
