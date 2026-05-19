"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SCENARIOS } from "@/lib/constants";
import { ToolTag } from "./ui/ToolTag";

// Scenarios — three concrete things Squash catches that humans miss.
// Replaces the old persona-based use cases section. Each card combines a
// short narrative with a mini insight-thumbnail that mirrors the visual
// idiom from the Detect showcase.
export function Scenarios() {
  const reduce = useReducedMotion();

  return (
    <section
      id="scenarios"
      aria-labelledby="scenarios-heading"
      className="py-16 sm:py-20 md:py-32 bg-[color:var(--color-background)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            What Squash catches
          </p>
          <h2
            id="scenarios-heading"
            className="mt-3 text-[30px] sm:text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The things that{" "}
            <span className="italic text-[color:var(--color-primary)]">
              used to slip past you.
            </span>
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl">
            A handful of real patterns Squash investigates and surfaces every
            week. The kind a human PM would only catch on a slow Tuesday with
            five tabs open.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-4 sm:gap-5">
          {SCENARIOS.map((s, i) => (
            <motion.article
              key={s.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card-hover rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-background-tertiary)] p-6 flex flex-col"
            >
              <span className="self-start inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-[color:var(--color-border)] text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-primary)]">
                {s.tag}
              </span>

              <h3
                className="mt-5 text-[22px] sm:text-[24px] leading-[1.15] tracking-[-0.01em] text-[color:var(--color-foreground)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
                {s.body}
              </p>

              {/* Mini insight thumbnail */}
              <div className="mt-5 rounded-lg border border-[color:var(--color-border-light)] bg-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-foreground-muted)]">
                  {s.metricLabel}
                </p>
                <p
                  className="mt-1 text-[28px] sm:text-[32px] leading-none tracking-tight text-[color:var(--color-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.metric}
                </p>

                {/* Sparkline */}
                <svg
                  viewBox="0 0 140 30"
                  className="mt-3 w-full h-7"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id={`scenario-${i}-grad`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8640F" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#E8640F" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,18 L20,17 L40,16 L60,18 L80,14 L95,10 L110,6 L125,4 L140,3 L140,30 L0,30 Z"
                    fill={`url(#scenario-${i}-grad)`}
                  />
                  <path
                    d="M0,18 L20,17 L40,16 L60,18 L80,14 L95,10 L110,6 L125,4 L140,3"
                    fill="none"
                    stroke="#E8640F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="140" cy="3" r="2" fill="#E8640F" />
                </svg>

                <div className="mt-3 pt-3 border-t border-[color:var(--color-border-light)] flex flex-wrap gap-1">
                  {s.tools.map((t) => (
                    <ToolTag key={t} name={t} size="xs" />
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
