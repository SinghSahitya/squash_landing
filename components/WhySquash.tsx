"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WHY_SQUASH } from "@/lib/constants";

// Why Squash works — the structural moat in three cards.
// Sets up the "How is this different from Amplitude / Mixpanel /
// Lucent?" FAQ subtly, without naming competitors directly.
export function WhySquash() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="why-heading"
      className="py-16 sm:py-20 md:py-32 bg-[color:var(--color-surface)] border-y border-[color:var(--color-border)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            Why Squash works
          </p>
          <h2
            id="why-heading"
            className="mt-3 text-[30px] sm:text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The only place this layer can sit is{" "}
            <span className="italic text-[color:var(--color-primary)]">
              above the tools.
            </span>
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl">
            Every existing tool reads its own data well and stops at the edge.
            Squash is built to read across the edges, and that&apos;s exactly why
            no incumbent will ever build it.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-4 sm:gap-5">
          {WHY_SQUASH.map((why, i) => (
            <motion.article
              key={why.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card-hover p-6 sm:p-7 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-background-tertiary)]"
            >
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[color:var(--color-primary-subtle)] border border-[color:var(--color-primary-subtle-border)] text-[12px] font-semibold text-[color:var(--color-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="mt-4 text-[20px] sm:text-[22px] leading-[1.2] tracking-[-0.01em] text-[color:var(--color-foreground)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {why.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
                {why.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
