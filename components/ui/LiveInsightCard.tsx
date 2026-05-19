"use client";

import { motion, useReducedMotion } from "framer-motion";
import { IntegrationMark } from "./IntegrationMark";
import { INTEGRATIONS } from "@/lib/constants";

// Hero visual. A live-looking "insight card" that animates in like a push
// notification — what Squash actually delivers into a team's Slack. The
// card behind hints at the next insight queued up, reinforcing that
// Squash runs continuously, not on demand.
//
// Two layers: a back card (slightly offset, faded) for depth + the
// foreground card with staged content reveal. Respects reduced-motion.
export function LiveInsightCard() {
  const reduce = useReducedMotion();

  const transition = (delay = 0) =>
    reduce
      ? { duration: 0 }
      : { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const };

  const tools = ["Zendesk", "Mixpanel", "BigQuery", "PostHog"];

  return (
    <div className="relative w-full max-w-[560px] mx-auto lg:mx-0">
      {/* Back / queued card — hints at the next insight on its way */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 0.45, y: 0 }}
        transition={transition(0.9)}
        className="absolute inset-x-3 -bottom-4 h-24 rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_20px_60px_-30px_rgba(26,26,26,0.18)]"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2 px-4 pt-3">
          <span className="relative inline-flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-[color:var(--color-primary)] opacity-50 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[color:var(--color-primary)]" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-foreground-muted)]">
            Investigating: checkout retry pattern
          </span>
        </div>
        <div className="px-4 mt-2 space-y-1.5">
          <div className="h-2 w-3/4 rounded-full bg-[color:var(--color-background-secondary)]" />
          <div className="h-2 w-1/2 rounded-full bg-[color:var(--color-background-secondary)]" />
        </div>
      </motion.div>

      {/* Foreground card — the insight Squash pushes */}
      <motion.article
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={transition(0)}
        className="relative rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_30px_80px_-30px_rgba(26,26,26,0.22)] overflow-hidden"
      >
        {/* Header strip: Squash signature + freshness */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)]">
          <div className="flex items-center gap-2">
            <span className="inline-flex w-5 h-5 rounded-md bg-[color:var(--color-primary)] items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 2 14 9 21 11 14 13 12 20 10 13 3 11 10 9 Z" />
              </svg>
            </span>
            <span className="text-[11px] font-semibold text-[color:var(--color-foreground)]">
              Squash
            </span>
            <span className="text-[11px] text-[color:var(--color-foreground-muted)]">
              · just now
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-primary)]">
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[color:var(--color-primary)] opacity-60 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[color:var(--color-primary)]" />
            </span>
            P1 · live
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {/* Title */}
          <motion.h3
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.25)}
            className="text-[15px] sm:text-[16px] font-semibold leading-snug text-[color:var(--color-foreground)]"
          >
            34 tickets in 72h: promo code applied but not reflected in final charge
          </motion.h3>

          {/* Impact callout */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.4)}
            className="mt-3 p-3 rounded-lg bg-[color:var(--color-primary-subtle)] border border-[color:var(--color-primary-subtle-border)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-primary)] flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
              Impact
            </p>
            <p className="mt-1 text-[14px] font-semibold text-[color:var(--color-foreground)]">
              ₹3.8L in overcharges issued
            </p>
            <p className="text-[11.5px] text-[color:var(--color-foreground-secondary)]">
              4 enterprise accounts at churn risk
            </p>
          </motion.div>

          {/* Stat grid */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transition(0.55)}
            className="mt-3 grid grid-cols-4 gap-1.5"
          >
            {[
              { label: "Tickets", value: "34" },
              { label: "Users", value: "28" },
              { label: "Enterprise", value: "4" },
              { label: "Since", value: "72h" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-md border border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)] px-2 py-1.5"
              >
                <p className="text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-foreground-muted)]">
                  {s.label}
                </p>
                <p className="text-[13px] font-semibold tabular-nums text-[color:var(--color-foreground)]">
                  {s.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Sources */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.7)}
            className="mt-3 flex items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-foreground-muted)] font-semibold">
              Sources
            </span>
            <div className="flex -space-x-1.5">
              {tools.map((name) => {
                const integ = INTEGRATIONS.find((i) => i.name === name);
                return (
                  <span
                    key={name}
                    className="ring-2 ring-white rounded-md"
                    title={name}
                  >
                    <IntegrationMark
                      name={name}
                      color={integ?.color ?? "#7a7873"}
                      slug={integ?.slug}
                      size={18}
                    />
                  </span>
                );
              })}
            </div>
            <span className="text-[10px] font-mono text-[color:var(--color-foreground-muted)] ml-auto">
              94% confidence
            </span>
          </motion.div>

          {/* Suggested action */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.85)}
            className="mt-3 flex items-center justify-between gap-2 p-2.5 rounded-lg border border-dashed border-[color:var(--color-primary-subtle-border)] bg-white"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-foreground-muted)]">
                Suggested action
              </p>
              <p className="text-[12px] font-medium text-[color:var(--color-foreground)] truncate">
                Create Linear issue · escalate to Payments
              </p>
            </div>
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[color:var(--color-foreground)] text-white text-[11px] font-medium"
            >
              Create
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </motion.div>
        </div>
      </motion.article>
    </div>
  );
}
