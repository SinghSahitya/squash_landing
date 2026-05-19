"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SOLUTION_STEPS, INTEGRATIONS } from "@/lib/constants";
import { IntegrationMark } from "./ui/IntegrationMark";

// Solution flywheel. Three steps from the deck: Monitor → Investigate →
// Suggest. The hero visual is a hub-and-spoke that draws signals IN from
// the customer's existing tools and pushes actions OUT to the systems
// teams work in (Linear, Slack, GitHub). Below it, three numbered cards
// expand on each step with the concrete bullets a buyer wants.
export function Solution() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="solution-heading"
      className="py-16 sm:py-20 md:py-32 bg-[color:var(--color-surface)] border-y border-[color:var(--color-border)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            How Squash works
          </p>
          <h2
            id="solution-heading"
            className="mt-3 text-[30px] sm:text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI that <span className="italic text-[color:var(--color-primary)]">monitors everything</span>,
            investigates across tools,{" "}
            <span className="italic text-[color:var(--color-primary)]">and tells you what to do next.</span>
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl">
            Squash plugs into the tools your team already uses. It runs in the
            background, investigates anomalies the moment they surface, and
            pushes you the answer, already drafted and already cited, into the
            place your team works.
          </p>
        </div>

        {/* Flywheel hub */}
        <FlywheelVisual />

        {/* Three step cards */}
        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-4 sm:gap-5">
          {SOLUTION_STEPS.map((step, i) => (
            <StepCard key={step.step} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Flywheel — sources flow IN to Squash, actions flow OUT
// ─────────────────────────────────────────────────────────────
const SOURCES = ["Mixpanel", "Hotjar", "Zendesk", "Sentry"];
const ACTIONS = ["Linear", "Slack", "GitHub"];

function FlywheelVisual() {
  const reduce = useReducedMotion();

  // Hub at (500, 200) on a 1000x400 canvas.
  // Sources on the left, actions on the right.
  const hub = { x: 500, y: 200 };
  const sourcePoints = SOURCES.map((_, i) => ({
    x: 120,
    y: 80 + i * 80,
  }));
  const actionPoints = ACTIONS.map((_, i) => ({
    x: 880,
    y: 110 + i * 90,
  }));

  return (
    <div className="mt-12 md:mt-16">
      <div className="relative rounded-2xl border border-[color:var(--color-border)] bg-gradient-to-b from-[color:var(--color-background-tertiary)] to-white overflow-hidden">
        <div className="relative" style={{ paddingBottom: "40%", minHeight: 320 }}>
          {/* SVG lines + curves */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 400"
            fill="none"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="line-in" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#E8640F" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#E8640F" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="line-out" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#E8640F" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#E8640F" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Inflow curves */}
            {sourcePoints.map((p, i) => {
              const d = `M ${p.x + 40} ${p.y} C ${p.x + 220} ${p.y}, ${hub.x - 220} ${hub.y}, ${hub.x - 60} ${hub.y}`;
              return (
                <motion.path
                  key={`in-${i}`}
                  d={d}
                  stroke="url(#line-in)"
                  strokeWidth="1.6"
                  fill="none"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                />
              );
            })}

            {/* Outflow curves */}
            {actionPoints.map((p, i) => {
              const d = `M ${hub.x + 60} ${hub.y} C ${hub.x + 220} ${hub.y}, ${p.x - 220} ${p.y}, ${p.x - 40} ${p.y}`;
              return (
                <motion.path
                  key={`out-${i}`}
                  d={d}
                  stroke="url(#line-out)"
                  strokeWidth="1.6"
                  fill="none"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 1.0, delay: 1.0 + i * 0.12, ease: "easeOut" }}
                />
              );
            })}
          </svg>

          {/* Source tiles (left) */}
          {SOURCES.map((name, i) => {
            const integ = INTEGRATIONS.find((it) => it.name === name);
            const p = sourcePoints[i];
            return (
              <motion.div
                key={name}
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }}
                className="absolute -translate-y-1/2"
                style={{
                  left: `${(p.x / 1000) * 100}%`,
                  top: `${(p.y / 400) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[color:var(--color-border)] shadow-sm">
                  <IntegrationMark
                    name={name}
                    color={integ?.color ?? "#7a7873"}
                    slug={integ?.slug}
                    size={20}
                  />
                  <span className="text-[12px] font-medium text-[color:var(--color-foreground)] whitespace-nowrap hidden sm:inline">
                    {name}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Action tiles (right) */}
          {ACTIONS.map((name, i) => {
            const integ = INTEGRATIONS.find((it) => it.name === name);
            const p = actionPoints[i];
            return (
              <motion.div
                key={name}
                initial={reduce ? false : { opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
                className="absolute"
                style={{
                  left: `${(p.x / 1000) * 100}%`,
                  top: `${(p.y / 400) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[color:var(--color-border)] shadow-sm">
                  <IntegrationMark
                    name={name}
                    color={integ?.color ?? "#7a7873"}
                    slug={integ?.slug}
                    size={20}
                  />
                  <span className="text-[12px] font-medium text-[color:var(--color-foreground)] whitespace-nowrap hidden sm:inline">
                    {name}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Central Squash hub */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute"
            style={{
              left: `${(hub.x / 1000) * 100}%`,
              top: `${(hub.y / 400) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <span
                className="absolute -inset-2 rounded-2xl bg-[color:var(--color-primary)]/15 blur-md animate-pulse"
                aria-hidden="true"
              />
              <div className="relative flex items-center gap-2 px-4 py-3 rounded-xl bg-[color:var(--color-primary)] text-white shadow-[0_20px_50px_-20px_rgba(232,100,15,0.6)]">
                <span className="inline-flex w-6 h-6 rounded-md bg-white/20 items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M12 2 14 9 21 11 14 13 12 20 10 13 3 11 10 9 Z" />
                  </svg>
                </span>
                <div>
                  <p className="text-[13px] font-semibold leading-tight">Squash</p>
                  <p className="text-[10px] text-white/80 leading-tight">monitoring · 24/7</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Caption strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4 sm:px-6 py-4 border-t border-[color:var(--color-border)] bg-white/60 text-center">
          {[
            ["Monitors", "24/7"],
            ["Investigates", "across tools"],
            ["Finds", "root cause"],
            ["Helps you fix", "in minutes"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] uppercase tracking-[0.1em] font-semibold text-[color:var(--color-foreground-muted)]">
                {label}
              </p>
              <p className="text-[13px] font-semibold text-[color:var(--color-foreground)] mt-0.5">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Numbered step card
// ─────────────────────────────────────────────────────────────
function StepCard({
  step,
  index,
}: {
  step: (typeof SOLUTION_STEPS)[number];
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-hover p-6 sm:p-7 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-background-tertiary)] flex flex-col"
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[color:var(--color-primary)] text-white text-[14px] font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {index + 1}
        </span>
        <StepIcon kind={step.icon} />
      </div>
      <h3
        className="mt-5 text-[22px] sm:text-[24px] leading-[1.15] tracking-[-0.01em] text-[color:var(--color-foreground)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {step.title}
      </h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
        {step.body}
      </p>
      <ul className="mt-4 space-y-2 flex-1">
        {step.bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2 text-[13px] text-[color:var(--color-foreground-secondary)] leading-relaxed"
          >
            <span
              className="mt-1.5 inline-block w-1 h-1 rounded-full bg-[color:var(--color-primary)] flex-shrink-0"
              aria-hidden="true"
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function StepIcon({ kind }: { kind: string }) {
  if (kind === "monitor") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[color:var(--color-primary)]" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  if (kind === "investigate") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[color:var(--color-primary)]" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[color:var(--color-primary)]" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
