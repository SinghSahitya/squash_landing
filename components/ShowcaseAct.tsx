"use client";

import { motion, useReducedMotion } from "framer-motion";
import { IntegrationMark } from "./ui/IntegrationMark";
import { INTEGRATIONS } from "@/lib/constants";

// Showcase 03 · Action. Two mockups side by side: a pre-filled Linear
// ticket Squash auto-drafted, and the Slack alert that went to the
// product channel the same moment. Closes the narrative: from insight
// to a shipped fix, without a status meeting.
export function ShowcaseAct() {
  const reduce = useReducedMotion();

  const transition = (delay: number) =>
    reduce
      ? { duration: 0 }
      : { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section
      aria-labelledby="act-heading"
      className="py-16 sm:py-20 md:py-32 bg-[color:var(--color-surface)] border-y border-[color:var(--color-border)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            03 · Closes the loop
          </p>
          <h2
            id="act-heading"
            className="mt-3 text-[30px] sm:text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From insight to shipped fix.{" "}
            <span className="italic text-[color:var(--color-primary)]">
              Without a status meeting.
            </span>
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl">
            Squash drafts the engineering ticket with full context, pings the
            right team in Slack, and can hand the fix straight to your coding
            agent. You stay in the loop. You don't have to be the loop.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid lg:grid-cols-2 gap-5 sm:gap-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={transition(0)}
          >
            <LinearTicketMock />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={transition(0.15)}
          >
            <SlackAlertMock />
          </motion.div>
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={transition(0.35)}
          className="mt-10 md:mt-12 text-center text-[16px] sm:text-[18px] text-[color:var(--color-foreground-secondary)]"
        >
          Or hand the fix straight to{" "}
          <span
            className="italic text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            your coding agent.
          </span>
        </motion.p>
      </div>
    </section>
  );
}

function LinearTicketMock() {
  const linear = INTEGRATIONS.find((i) => i.name === "Linear");
  return (
    <article className="rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_30px_80px_-40px_rgba(26,26,26,0.18)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)]">
        <div className="flex items-center gap-2">
          <IntegrationMark
            name="Linear"
            color={linear?.color ?? "#5E6AD2"}
            slug={linear?.slug}
            size={18}
          />
          <span className="text-[12px] font-semibold text-[color:var(--color-foreground)]">
            Linear
          </span>
          <span className="text-[11px] text-[color:var(--color-foreground-muted)]">
            · auto-drafted by Squash
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-1 rounded-md bg-[color:var(--color-success-subtle)] text-[color:var(--color-success)]">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Created
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[11px] font-mono text-[color:var(--color-foreground-muted)]">
          <span>SQ-503</span>
          <span>·</span>
          <span className="text-[color:var(--color-primary)] font-semibold">P1</span>
          <span>·</span>
          <span>5 pts</span>
          <span>·</span>
          <span>@priya</span>
        </div>
        <h3 className="mt-2 text-[16px] sm:text-[17px] font-semibold leading-snug text-[color:var(--color-foreground)]">
          Promo code dropped on payment retry (Android)
        </h3>

        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-foreground-muted)]">
            Story
          </p>
          <p className="mt-1.5 text-[13px] text-[color:var(--color-foreground-secondary)] leading-relaxed">
            As an Android shopper, my promo code should persist across payment
            retries.
          </p>
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-foreground-muted)]">
            Acceptance
          </p>
          <ul className="mt-2 space-y-1.5">
            {[
              "Promo persists on retry within session",
              "Cart total reflects discount on retry",
              <>
                Event{" "}
                <code className="font-mono text-[11.5px] px-1.5 py-0.5 rounded bg-[color:var(--color-background-tertiary)] border border-[color:var(--color-border-light)]">
                  checkout.promo.reapplied
                </code>{" "}
                fires once
              </>,
            ].map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[12.5px] text-[color:var(--color-foreground-secondary)] leading-relaxed"
              >
                <span
                  className="mt-1.5 inline-block w-1 h-1 rounded-full bg-[color:var(--color-primary)] flex-shrink-0"
                  aria-hidden="true"
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 pt-4 border-t border-[color:var(--color-border-light)] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[color:var(--color-foreground-muted)]">
            Linked to insight #SQ-INS-218
          </span>
          <span className="text-[11px] text-[color:var(--color-foreground-muted)]">
            Investigation log attached
          </span>
        </div>
      </div>
    </article>
  );
}

function SlackAlertMock() {
  const slack = INTEGRATIONS.find((i) => i.name === "Slack");
  return (
    <article className="rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_30px_80px_-40px_rgba(26,26,26,0.18)] overflow-hidden h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)]">
        <div className="flex items-center gap-2">
          <IntegrationMark
            name="Slack"
            color={slack?.color ?? "#4A154B"}
            slug={slack?.slug}
            size={18}
          />
          <span className="text-[12px] font-semibold text-[color:var(--color-foreground)]">
            #product-alerts
          </span>
        </div>
        <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
          08:38 IST
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[color:var(--color-primary)] flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M12 2 14 9 21 11 14 13 12 20 10 13 3 11 10 9 Z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] font-semibold text-[color:var(--color-foreground)]">
                Squash
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded bg-[color:var(--color-primary-subtle)] text-[color:var(--color-primary)] border border-[color:var(--color-primary-subtle-border)]">
                APP
              </span>
              <span className="text-[11px] text-[color:var(--color-foreground-muted)]">
                08:38
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[color:var(--color-foreground)] leading-relaxed">
              <strong>P1 · </strong>Promo code applied but not reflected in final
              charge. <span className="text-[color:var(--color-foreground-muted)]">34 tickets in 72h · ₹3.8L overcharges · 4 enterprise accounts at risk.</span>
            </p>

            <div className="mt-3 p-3 rounded-lg border-l-2 border-[color:var(--color-primary)] bg-[color:var(--color-background-tertiary)]">
              <p className="text-[11px] font-semibold text-[color:var(--color-foreground)]">
                Root cause: discount not persisted to order object
              </p>
              <p className="mt-1 text-[11.5px] text-[color:var(--color-foreground-muted)] leading-relaxed">
                Backend integration between cart and payment services. Tied to
                deploy window 72h ago.
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <PillButton primary label="View investigation" />
              <PillButton label="Open Linear · SQ-503" />
              <PillButton label="Snooze" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function PillButton({
  label,
  primary = false,
}: {
  label: string;
  primary?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-[11.5px] font-medium border ${
        primary
          ? "bg-[color:var(--color-foreground)] text-white border-[color:var(--color-foreground)]"
          : "bg-white text-[color:var(--color-foreground-secondary)] border-[color:var(--color-border)]"
      }`}
    >
      {label}
    </span>
  );
}
