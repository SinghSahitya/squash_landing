"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
} from "framer-motion";
import { ToolTag } from "./ui/ToolTag";
import { IntegrationMark } from "./ui/IntegrationMark";
import { SessionReplayCard } from "./ui/SessionReplayCard";
import { INTEGRATIONS } from "@/lib/constants";

const TABS = [
  { id: "detect", label: "Detects what matters" },
  { id: "investigate", label: "Investigates across tools" },
  { id: "act", label: "Closes the loop" },
] as const;

const AUTO_PLAY_MS = 6000;

export function HowItWorks() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % TABS.length);
    setProgress(0);
    startRef.current = 0;
  }, []);

  useEffect(() => {
    if (paused || !isInView || reduce) return;

    const tick = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const pct = Math.min(elapsed / AUTO_PLAY_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        advance();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, paused, isInView, reduce, advance]);

  const selectTab = (i: number) => {
    setActive(i);
    setProgress(0);
    startRef.current = 0;
    setPaused(true);
  };

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="hiw-heading"
      className="pt-16 sm:pt-20 md:pt-32 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        startRef.current = 0;
        setProgress(0);
      }}
    >
      {/* Section heading */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            How it works
          </p>
          <h2
            id="hiw-heading"
            className="mt-3 text-[30px] sm:text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From noise to shipped fix,{" "}
            <span className="italic text-[color:var(--color-primary)]">
              autonomously.
            </span>
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl">
            Squash watches your product stack 24/7, investigates across every
            tool, and hands your team the fix — not just the alert.
          </p>
        </div>
      </div>

      {/* Tab bar — full width, evenly spaced */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-10 md:mt-14">
        <div
          className="grid border-b border-[color:var(--color-border)]"
          style={{ gridTemplateColumns: `repeat(${TABS.length}, 1fr)` }}
          role="tablist"
        >
          {TABS.map((tab, i) => {
            const isActive = active === i;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                type="button"
                onClick={() => selectTab(i)}
                className={`relative py-3.5 sm:py-4 text-[13px] sm:text-[14.5px] font-medium transition-colors text-center ${
                  isActive
                    ? "text-[color:var(--color-foreground)]"
                    : "text-[color:var(--color-foreground-muted)] hover:text-[color:var(--color-foreground-secondary)]"
                }`}
              >
                {tab.label}
                {/* Active indicator line */}
                {isActive && (
                  <motion.span
                    layoutId="hiw-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[color:var(--color-foreground)]"
                    transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                {/* Progress bar under active tab */}
                {isActive && !reduce && (
                  <span
                    className="absolute bottom-0 left-0 h-[2px] bg-[color:var(--color-primary)]"
                    style={{ width: `${progress * 100}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Showcase area — warm background with large mockup */}
      <div className="relative mt-0">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 80% at 50% 20%, rgba(232,100,15,0.06) 0%, transparent 70%), linear-gradient(180deg, var(--color-background) 0%, var(--color-surface) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              id={`panel-${TABS[active].id}`}
              role="tabpanel"
              aria-labelledby={TABS[active].id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -16 }}
              transition={transition}
            >
              {active === 0 && <DetectPanel />}
              {active === 1 && <InvestigatePanel />}
              {active === 2 && <ActPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   DETECT PANEL — single large app mockup with floating callout
   ────────────────────────────────────────────────────────────── */
function DetectPanel() {
  return (
    <div className="relative">
      {/* Main mockup card */}
      <div className="rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_40px_80px_-30px_rgba(26,26,26,0.14)] overflow-hidden">
        {/* App chrome header */}
        <div className="px-5 sm:px-7 py-3.5 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="text-[11px] font-medium text-[color:var(--color-foreground-muted)]">
              Squash · Insights
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[color:var(--color-foreground-muted)]">
            <span className="hidden sm:inline">Last checked 2 min ago</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-success)]" />
          </div>
        </div>

        {/* Inner content — insight card layout */}
        <div className="p-5 sm:p-8 md:p-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
              Insight
            </span>
            <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
              · 08:14 IST · 4 sources
            </span>
          </div>

          <h3 className="text-[18px] sm:text-[22px] md:text-[24px] font-semibold leading-snug text-[color:var(--color-foreground)]">
            34 tickets in 72h: Promo code applied but not reflected in final
            charge
          </h3>
          <p className="mt-1.5 text-[12.5px] text-[color:var(--color-foreground-muted)]">
            Recurring theme · 28 unique users · 4 high-value accounts affected
          </p>

          {/* Stat row */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              { label: "Tickets (72h)", value: "34", emphasis: true },
              { label: "Unique users", value: "28" },
              { label: "Enterprise accts", value: "4" },
              { label: "Since first report", value: "72h" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)] p-3 sm:p-3.5"
              >
                <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-foreground-muted)]">
                  {s.label}
                </p>
                <p
                  className={`mt-1 text-[24px] sm:text-[28px] font-semibold tabular-nums leading-none ${
                    s.emphasis
                      ? "text-[color:var(--color-primary)]"
                      : "text-[color:var(--color-foreground)]"
                  }`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Customer quote */}
          <div className="mt-5 p-3.5 rounded-lg bg-[color:var(--color-background-tertiary)] border-l-2 border-[color:var(--color-primary)]">
            <p className="text-[13px] italic text-[color:var(--color-foreground)] leading-relaxed">
              &ldquo;The promo code works in the cart but the receipt shows full
              price. Feels broken.&rdquo;
            </p>
            <p className="mt-1 text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
              #ZD-8851
            </p>
          </div>

          {/* Session replays row */}
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-foreground-muted)] mb-2.5">
              Reference sessions
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { idx: 1, duration: "0:22", note: "Tapped checkout 4x" },
                { idx: 2, duration: "0:34", note: "Waited 8s, retried" },
                { idx: 3, duration: "0:18", note: "Total was wrong" },
              ].map((s) => (
                <SessionReplayCard
                  key={s.idx}
                  index={s.idx}
                  duration={s.duration}
                  note={s.note}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating callout — overlaps the mockup edge (Intercom-style) */}
      <div className="absolute -right-2 sm:right-6 md:right-10 top-16 sm:top-20 md:top-24 z-10 max-w-[240px] sm:max-w-[260px]">
        <div className="rounded-xl p-4 sm:p-5 bg-[color:var(--color-primary)] text-white shadow-[0_20px_50px_-15px_rgba(232,100,15,0.5)] border-2 border-white/20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80 flex items-center gap-1.5">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
              <polyline points="16 17 22 17 22 11" />
            </svg>
            Impact
          </p>
          <p className="mt-1.5 text-[20px] sm:text-[22px] font-semibold leading-tight">
            ₹3.8L overcharges
          </p>
          <p className="text-[12px] text-white/80 mt-1">
            4 enterprise accounts at churn risk
          </p>
          <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-2">
            {[
              { label: "Confidence", value: "94%" },
              { label: "Severity", value: "P1" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[9px] uppercase tracking-[0.1em] text-white/70 font-semibold">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[14px] font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   INVESTIGATE PANEL — app mockup with floating root-cause callout
   ────────────────────────────────────────────────────────────── */
const STEPS = [
  { title: "Clustered 34 tickets by issue similarity", tools: ["Zendesk"], time: "08:12" },
  { title: "Verified discount not reaching payment", tools: ["Mixpanel", "BigQuery"], time: "08:18" },
  { title: "Confirmed promo codes are valid", tools: ["BigQuery"], time: "08:22" },
  { title: "Reviewed 6 session replays", tools: ["PostHog"], time: "08:28" },
];

function InvestigatePanel() {
  return (
    <div className="relative">
      {/* Main mockup card */}
      <div className="rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_40px_80px_-30px_rgba(26,26,26,0.14)] overflow-hidden">
        {/* App chrome */}
        <div className="px-5 sm:px-7 py-3.5 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="text-[11px] font-medium text-[color:var(--color-foreground-muted)]">
              Squash · Investigation
            </span>
          </div>
          <div className="text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
            4 checks · 4 tools · 16 min
          </div>
        </div>

        {/* Investigation timeline */}
        <div className="p-5 sm:p-8 md:p-10">
          <ol className="relative">
            <div
              className="absolute left-[14px] sm:left-[16px] top-4 bottom-4 w-px bg-[color:var(--color-border)]"
              aria-hidden="true"
            />
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="relative flex gap-3 sm:gap-4 pb-6 last:pb-0"
              >
                <div className="relative z-10 flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center text-[12px] font-semibold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-[14px] sm:text-[15px] font-semibold text-[color:var(--color-foreground)]">
                      {step.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
                      {step.time} IST
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {step.tools.map((t) => (
                      <ToolTag key={t} name={t} size="xs" />
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Suggested actions row */}
          <div className="mt-6 pt-6 border-t border-[color:var(--color-border-light)] grid sm:grid-cols-2 gap-3">
            <ActionCard
              tool="Linear"
              label="Escalate: promo discount not persisting"
              cta="Create issue"
            />
            <ActionCard
              tool="GitHub"
              label="Forward discount payload to gateway"
              cta="Create hotfix"
            />
          </div>
        </div>
      </div>

      {/* Floating root-cause callout */}
      <div className="absolute -right-2 sm:right-6 md:right-10 top-14 sm:top-16 md:top-20 z-10 max-w-[280px] sm:max-w-[300px]">
        <div className="rounded-xl p-4 sm:p-5 bg-[color:var(--color-primary-subtle)] border-2 border-[color:var(--color-primary-subtle-border)] shadow-[0_20px_50px_-15px_rgba(232,100,15,0.25)]">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2 14 9 21 11 14 13 12 20 10 13 3 11 10 9 Z" />
            </svg>
            Root cause
          </span>
          <h3 className="mt-2 text-[16px] sm:text-[17px] font-semibold leading-snug text-[color:var(--color-foreground)]">
            Discount not persisted to order object
          </h3>
          <p className="mt-1.5 text-[12px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
            Cart service applies discount client-side but doesn&apos;t pass it
            to the payment gateway.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Zendesk", "Mixpanel", "BigQuery", "PostHog"].map((t) => (
              <ToolTag key={t} name={t} size="xs" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   ACT PANEL — app mockup showing outputs, floating agent callout
   ────────────────────────────────────────────────────────────── */
function ActPanel() {
  const linear = INTEGRATIONS.find((i) => i.name === "Linear");
  const slack = INTEGRATIONS.find((i) => i.name === "Slack");

  return (
    <div className="relative">
      {/* Main mockup card */}
      <div className="rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_40px_80px_-30px_rgba(26,26,26,0.14)] overflow-hidden">
        {/* App chrome */}
        <div className="px-5 sm:px-7 py-3.5 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="text-[11px] font-medium text-[color:var(--color-foreground-muted)]">
              Squash · Actions
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-1 rounded-md bg-[color:var(--color-success-subtle)] text-[color:var(--color-success)]">
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            2 actions taken
          </span>
        </div>

        {/* Two output cards inside one shell */}
        <div className="p-5 sm:p-8 md:p-10 grid lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Linear ticket */}
          <div className="rounded-xl border border-[color:var(--color-border)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)]">
              <div className="flex items-center gap-2">
                <IntegrationMark
                  name="Linear"
                  color={linear?.color ?? "#5E6AD2"}
                  slug={linear?.slug}
                  size={16}
                />
                <span className="text-[11px] font-semibold text-[color:var(--color-foreground)]">
                  Linear
                </span>
                <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
                  · auto-drafted
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded bg-[color:var(--color-success-subtle)] text-[color:var(--color-success)]">
                Created
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
                <span>SQ-503</span>
                <span>·</span>
                <span className="text-[color:var(--color-primary)] font-semibold">
                  P1
                </span>
                <span>·</span>
                <span>5 pts</span>
                <span>·</span>
                <span>@priya</span>
              </div>
              <h3 className="mt-1.5 text-[14px] sm:text-[15px] font-semibold leading-snug text-[color:var(--color-foreground)]">
                Promo code dropped on payment retry (Android)
              </h3>
              <div className="mt-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-foreground-muted)]">
                  Acceptance
                </p>
                <ul className="mt-1.5 space-y-1">
                  {[
                    "Promo persists on retry within session",
                    "Cart total reflects discount on retry",
                    "Event checkout.promo.reapplied fires once",
                  ].map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-1.5 text-[11.5px] text-[color:var(--color-foreground-secondary)] leading-relaxed"
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
              <div className="mt-3 pt-2.5 border-t border-[color:var(--color-border-light)] text-[10px] text-[color:var(--color-foreground-muted)]">
                Linked to insight #SQ-INS-218
              </div>
            </div>
          </div>

          {/* Slack alert */}
          <div className="rounded-xl border border-[color:var(--color-border)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)]">
              <div className="flex items-center gap-2">
                <IntegrationMark
                  name="Slack"
                  color={slack?.color ?? "#4A154B"}
                  slug={slack?.slug}
                  size={16}
                />
                <span className="text-[11px] font-semibold text-[color:var(--color-foreground)]">
                  #product-alerts
                </span>
              </div>
              <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
                08:38 IST
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[color:var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                    aria-hidden="true"
                  >
                    <path d="M12 2 14 9 21 11 14 13 12 20 10 13 3 11 10 9 Z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[12px] font-semibold text-[color:var(--color-foreground)]">
                      Squash
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.08em] px-1 py-0.5 rounded bg-[color:var(--color-primary-subtle)] text-[color:var(--color-primary)] border border-[color:var(--color-primary-subtle-border)]">
                      APP
                    </span>
                    <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
                      08:38
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-[color:var(--color-foreground)] leading-relaxed">
                    <strong>P1 · </strong>Promo code not reflected in final
                    charge.{" "}
                    <span className="text-[color:var(--color-foreground-muted)]">
                      34 tickets · ₹3.8L overcharges · 4 enterprise accounts.
                    </span>
                  </p>

                  <div className="mt-2.5 p-2.5 rounded-lg border-l-2 border-[color:var(--color-primary)] bg-[color:var(--color-background-tertiary)]">
                    <p className="text-[10.5px] font-semibold text-[color:var(--color-foreground)]">
                      Root cause: discount not persisted to order object
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-[color:var(--color-foreground-muted)] leading-relaxed">
                      Backend cart-payment integration. Tied to deploy 72h ago.
                    </p>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <PillButton primary label="View investigation" />
                    <PillButton label="Open Linear · SQ-503" />
                    <PillButton label="Snooze" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating callout — coding agent */}
      <div className="absolute -right-2 sm:right-6 md:right-10 top-14 sm:top-16 md:top-20 z-10 max-w-[240px] sm:max-w-[260px]">
        <div className="rounded-xl p-4 sm:p-5 bg-[color:var(--color-foreground)] text-white shadow-[0_20px_50px_-15px_rgba(26,26,26,0.5)] border-2 border-white/10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
            One more thing
          </p>
          <p className="mt-2 text-[15px] sm:text-[16px] leading-snug font-medium">
            Or hand the fix straight to{" "}
            <span
              className="italic text-[color:var(--color-accent-warm)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              your coding agent.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   SHARED SUB-COMPONENTS
   ────────────────────────────────────────────────────────────── */
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
    <div className="rounded-xl bg-[color:var(--color-background-tertiary)] border border-[color:var(--color-border-light)] p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <ToolTag name={tool} size="xs" />
        <p className="text-[12.5px] font-semibold text-[color:var(--color-foreground)] leading-snug truncate">
          {label}
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[color:var(--color-foreground)] text-white text-[11px] font-medium whitespace-nowrap flex-shrink-0">
        {cta}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </div>
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
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10.5px] font-medium border ${
        primary
          ? "bg-[color:var(--color-foreground)] text-white border-[color:var(--color-foreground)]"
          : "bg-white text-[color:var(--color-foreground-secondary)] border-[color:var(--color-border)]"
      }`}
    >
      {label}
    </span>
  );
}
