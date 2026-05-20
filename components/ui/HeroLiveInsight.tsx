"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IntegrationMark } from "./IntegrationMark";
import { ToolTag } from "./ToolTag";
import { INTEGRATIONS, DEMO_URL } from "@/lib/constants";

// Hero visual. Animation arc:
//   1. Four "raw signal" pills materialise in the left column, each branded
//      to its source tool (Zendesk tickets, Mixpanel funnel, Sentry error
//      stack, PostHog session replays) — all four are different facets of
//      the same underlying issue.
//   2. SVG paths draw inward from each pill's right edge to the card's
//      left edge, with a flowing orange dash conveying "data streaming
//      into Squash."
//   3. A radial pulse fires at the convergence point.
//   4. The insight card crystallises out of that pulse, content
//      revealing in stages. Its "Sources" row is the same four brand
//      marks that streamed in — explicitly tying the synthesis to its
//      inputs.
//   5. Pills stay fully intact afterward (no fade). Connection lines
//      remain visible and the dashed particle keeps flowing — the
//      "still watching" beat.

const SIGNAL_ORDER = ["zendesk", "mixpanel", "sentry", "posthog"] as const;
type SignalId = (typeof SIGNAL_ORDER)[number];

const T = {
  pillsStart: 0.15,
  pillsStagger: 0.12,
  pathsStart: 0.95,
  pathsStagger: 0.08,
  pathsDuration: 0.85,
  orbStart: 1.75,
  cardStart: 2.1,
  cardContent: 2.4,
} as const;

// ─────────────────────────────────────────────────────────────
// PILL CONTENT — each tool gets its own native-feeling layout.
// ─────────────────────────────────────────────────────────────

function PillShell({
  tool,
  meta,
  oneLiner,
  children,
}: {
  tool: string;
  meta: string;
  oneLiner: string;
  children: React.ReactNode;
}) {
  const integ = INTEGRATIONS.find((i) => i.name === tool);
  return (
    <div className="rounded-xl bg-white border border-[color:var(--color-border)] shadow-[0_14px_36px_-22px_rgba(26,26,26,0.22)] overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 py-2 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)]">
        <IntegrationMark
          name={tool}
          color={integ?.color ?? "#7a7873"}
          slug={integ?.slug}
          size={16}
        />
        <span className="text-[11px] font-semibold text-[color:var(--color-foreground)]">
          {tool}
        </span>
        <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
          · {meta}
        </span>
      </div>
      <div className="px-3.5 pt-2.5 pb-3">
        <p className="text-[11.5px] font-medium leading-snug text-[color:var(--color-foreground)]">
          {oneLiner}
        </p>
        <div className="mt-2.5">{children}</div>
      </div>
    </div>
  );
}

function ZendeskPill() {
  const tickets = [
    {
      id: "ZD-4827",
      name: "Aarav S.",
      initials: "AS",
      avatar: "#E26D5C",
      ago: "12m",
      quote: "Used SUMMER25 at checkout but still got charged the full price.",
    },
    {
      id: "ZD-4818",
      name: "Priya M.",
      initials: "PM",
      avatar: "#5C7AE2",
      ago: "28m",
      quote: "Promo code says applied but the total didn't change.",
    },
    {
      id: "ZD-4801",
      name: "Rohan K.",
      initials: "RK",
      avatar: "#5CB985",
      ago: "51m",
      quote: "Billed ₹4,899 instead of ₹3,899. Need refund.",
    },
  ];

  return (
    <PillShell
      tool="Zendesk"
      meta="Customer support · last 1h"
      oneLiner="3 customers reporting promo discount didn’t apply at checkout"
    >
      <ul className="space-y-1.5">
        {tickets.map((t) => (
          <li key={t.id} className="flex items-start gap-2">
            <span
              className="shrink-0 w-5 h-5 rounded-full inline-flex items-center justify-center text-white text-[8.5px] font-semibold"
              style={{ backgroundColor: t.avatar }}
              aria-hidden="true"
            >
              {t.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] leading-tight">
                <span className="font-semibold text-[color:var(--color-foreground)]">
                  {t.name}
                </span>
                <span className="font-mono text-[9px] text-[color:var(--color-foreground-muted)]">
                  {t.id}
                </span>
                <span className="ml-auto text-[9.5px] text-[color:var(--color-foreground-muted)] tabular-nums">
                  {t.ago}
                </span>
              </div>
              <p className="mt-0.5 text-[10.5px] leading-snug text-[color:var(--color-foreground-secondary)] line-clamp-1 italic">
                “{t.quote}”
              </p>
            </div>
          </li>
        ))}
      </ul>
    </PillShell>
  );
}

function MixpanelPill() {
  const steps = [
    { label: "View cart", value: "4,820", pct: 100, drop: false },
    { label: "Apply promo", value: "4,193", pct: 87, drop: false },
    { label: "Payment", value: "3,374", pct: 70, drop: false },
    { label: "Complete", value: "2,458", pct: 51, drop: true },
  ];
  return (
    <PillShell
      tool="Mixpanel"
      meta="Funnel · 7d"
      oneLiner="Checkout conversion dropped 19% at the promo apply step"
    >
      <div className="space-y-1">
        {steps.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-[78px] text-[10px] text-[color:var(--color-foreground-secondary)] truncate">
              {s.label}
            </span>
            <div className="flex-1 h-2 rounded-full bg-[color:var(--color-background-secondary)] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${s.pct}%`,
                  backgroundColor: s.drop
                    ? "var(--color-error)"
                    : "var(--color-foreground)",
                  opacity: s.drop ? 0.85 : 0.75,
                }}
              />
            </div>
            <span className="w-[44px] text-right text-[9.5px] font-mono tabular-nums text-[color:var(--color-foreground-secondary)]">
              {s.value}
            </span>
            <span
              className={`w-[34px] text-right text-[9.5px] font-mono tabular-nums ${
                s.drop
                  ? "text-[color:var(--color-error)] font-semibold"
                  : "text-[color:var(--color-foreground-muted)]"
              }`}
            >
              {s.pct}%
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 pt-1 text-[9.5px] text-[color:var(--color-error)] font-semibold">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          ↓19% vs prior 7-day window · started 72h ago
        </div>
      </div>
    </PillShell>
  );
}

function SentryPill() {
  return (
    <PillShell
      tool="Sentry"
      meta="Issue · ↑12× spike"
      oneLiner="TypeError firing on promo apply, 142 events in 72h"
    >
      <div className="rounded-md bg-[#1e1b2e] text-[#e5e3f1] px-2.5 py-2 font-mono text-[9.5px] leading-[1.45]">
        <div>
          <span className="text-[#ff8a8a] font-semibold">TypeError</span>
          <span className="text-[#e5e3f1]">: </span>
          <span className="text-[#ffd58a]">discount.amount</span>
          <span className="text-[#9ea0c4]"> is undefined</span>
        </div>
        <div className="opacity-80">
          <span className="text-[#9ea0c4]">  at </span>
          <span className="text-[#8acbff]">Cart.applyPromo</span>
          <span className="text-[#9ea0c4]"> (</span>
          <span className="text-[#b9f0c2]">Cart.ts:84</span>
          <span className="text-[#9ea0c4]">)</span>
        </div>
        <div className="opacity-80">
          <span className="text-[#9ea0c4]">  at </span>
          <span className="text-[#8acbff]">handleCheckout</span>
          <span className="text-[#9ea0c4]"> (</span>
          <span className="text-[#b9f0c2]">Checkout.tsx:142</span>
          <span className="text-[#9ea0c4]">)</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[10px] text-[color:var(--color-foreground-secondary)]">
        <span className="inline-flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[color:var(--color-error)]" />
          <span className="font-mono tabular-nums">142</span> events
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="font-mono tabular-nums">28</span> users
        </span>
        <span className="text-[color:var(--color-foreground-muted)]">
          first seen 72h ago
        </span>
        <span className="ml-auto text-[9.5px] uppercase tracking-[0.08em] font-semibold text-[color:var(--color-error)]">
          P1
        </span>
      </div>
    </PillShell>
  );
}

function PostHogPill() {
  const replays = [
    { user: "user_4827", duration: "2:14" },
    { user: "user_3819", duration: "1:48" },
    { user: "user_2904", duration: "3:01" },
  ];
  return (
    <PillShell
      tool="PostHog"
      meta="Session replays · 23 sessions"
      oneLiner="Delay observed at the promo step, users seem confused"
    >
      <div className="grid grid-cols-3 gap-1.5">
        {replays.map((r) => (
          <div
            key={r.user}
            className="rounded-md border border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)] overflow-hidden"
          >
            {/* Clean play thumbnail */}
            <div className="relative aspect-[16/10] bg-[color:var(--color-foreground)] flex items-center justify-center">
              <span className="inline-flex w-6 h-6 rounded-full bg-white/95 items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="var(--color-foreground)" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="absolute bottom-1 right-1 text-[8.5px] font-mono tabular-nums text-white/90 px-1 py-[1px] rounded bg-black/35">
                {r.duration}
              </span>
            </div>

            {/* Meta */}
            <div className="px-1.5 py-1.5">
              <span className="block text-[9.5px] font-mono text-[color:var(--color-foreground-secondary)] truncate">
                {r.user}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PillShell>
  );
}

const PILL_BY_ID: Record<SignalId, () => React.JSX.Element> = {
  zendesk: ZendeskPill,
  mixpanel: MixpanelPill,
  sentry: SentryPill,
  posthog: PostHogPill,
};

// Tool name for each signal id, used by the connection-line gradients.
const TOOL_BY_ID: Record<SignalId, string> = {
  zendesk: "Zendesk",
  mixpanel: "Mixpanel",
  sentry: "Sentry",
  posthog: "PostHog",
};

// ─────────────────────────────────────────────────────────────
// CONNECTION LAYER — measures the live layout and draws cubic
// bezier paths from each pill's right edge to the card's left
// edge midpoint (the junction).
// ─────────────────────────────────────────────────────────────

type PathSpec = { id: SignalId; d: string; color: string };
type LayoutState = {
  width: number;
  height: number;
  paths: PathSpec[];
};

function useConnectionPaths(
  containerRef: React.RefObject<HTMLDivElement | null>,
  cardRef: React.RefObject<HTMLDivElement | null>,
  pillRefs: React.RefObject<Record<SignalId, HTMLDivElement | null>>,
) {
  const [layout, setLayout] = useState<LayoutState>({
    width: 0,
    height: 0,
    paths: [],
  });

  useEffect(() => {
    function compute() {
      const c = containerRef.current;
      const card = cardRef.current;
      if (!c || !card) return;
      const cr = c.getBoundingClientRect();
      const cardR = card.getBoundingClientRect();

      const junctionX = cardR.left - cr.left;
      const junctionY = cardR.top + cardR.height / 2 - cr.top;

      const paths: PathSpec[] = SIGNAL_ORDER.map((id) => {
        const pill = pillRefs.current?.[id];
        if (!pill) return { id, d: "", color: "#e8640f" };
        const pr = pill.getBoundingClientRect();
        const ax = pr.right - cr.left;
        const ay = pr.top + pr.height / 2 - cr.top;
        // Cubic Bezier: exits horizontally, approaches horizontally.
        const c1x = ax + 60;
        const c1y = ay;
        const c2x = Math.max(junctionX - 90, ax + 110);
        const c2y = junctionY;
        const integ = INTEGRATIONS.find((i) => i.name === TOOL_BY_ID[id]);
        return {
          id,
          d: `M ${ax} ${ay} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${junctionX} ${junctionY}`,
          color: integ?.color ?? "#e8640f",
        };
      });

      setLayout({ width: cr.width, height: cr.height, paths });
    }

    compute();
    if (typeof window === "undefined") return;
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    if (cardRef.current) ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [containerRef, cardRef, pillRefs]);

  return layout;
}

function ConnectionLayer({
  layout,
  reduce,
}: {
  layout: LayoutState;
  reduce: boolean | null;
}) {
  const { width, height, paths } = layout;
  if (!width || !height) return null;
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <defs>
        {paths.map((p) => (
          <linearGradient
            key={`g-${p.id}`}
            id={`g-${p.id}`}
            gradientUnits="userSpaceOnUse"
            x1={p.d.split(" ")[1]}
            y1={p.d.split(" ")[2]}
            x2={p.d.split(" ").slice(-2)[0]}
            y2={p.d.split(" ").slice(-1)[0]}
          >
            <stop offset="0%" stopColor={p.color} stopOpacity="0.55" />
            <stop offset="55%" stopColor="#e8640f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e8640f" stopOpacity="1" />
          </linearGradient>
        ))}
      </defs>

      {paths.map((p, i) => {
        const delay = T.pathsStart + i * T.pathsStagger;
        return (
          <g key={p.id}>
            {/* Base path — draws in, settles to a moderate-opacity thread */}
            <motion.path
              d={p.d}
              fill="none"
              stroke={`url(#g-${p.id})`}
              strokeWidth={1.6}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0, 1, 1, 0.55],
              }}
              transition={{
                pathLength: {
                  duration: T.pathsDuration,
                  delay,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: {
                  duration: 3.0,
                  delay,
                  times: [0, 0.25, 0.7, 1],
                  ease: "easeOut",
                },
              }}
            />
            {/* Flowing dash — the "data packet" travelling inward, kept alive */}
            <motion.path
              d={p.d}
              fill="none"
              stroke="#e8640f"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="3 80"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: [0, 0.95, 0.95, 0.7] }}
              transition={{
                duration: 3.0,
                delay: delay + 0.35,
                times: [0, 0.3, 0.75, 1],
                ease: "easeOut",
              }}
              style={{
                animation: reduce ? undefined : `signal-flow 2.2s linear infinite`,
                animationDelay: reduce ? undefined : `${delay + 0.35}s`,
              }}
            />
          </g>
        );
      })}

      <style>{`
        @keyframes signal-flow {
          from { stroke-dashoffset: 83; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// CENTRE ORB — fires a soft pulse where the paths converge, just
// before the card crystallises.
// ─────────────────────────────────────────────────────────────

function CenterPulse({
  layout,
  reduce,
}: {
  layout: LayoutState;
  reduce: boolean | null;
}) {
  if (!layout.paths.length) return null;
  // Junction = endpoint of every path.
  const end = layout.paths[0].d.split(" ").slice(-2);
  const x = Number(end[0]);
  const y = Number(end[1]);
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 0.85, 0], scale: [0.4, 1.4, 2.4] }}
        transition={{
          duration: 1.4,
          delay: T.orbStart,
          times: [0, 0.5, 1],
          ease: "easeOut",
        }}
        className="w-24 h-24 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,100,15,0.55), rgba(232,100,15,0) 70%)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// INSIGHT CARD — same content as before; crystallises out of the
// orb at T.cardStart, with staged content reveal.
// ─────────────────────────────────────────────────────────────

const STEP_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  scan: {
    color: "#6B7280",
    bg: "#F9FAFB",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  data: {
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  check: {
    color: "#16A34A",
    bg: "#F0FDF4",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  replay: {
    color: "#0284C7",
    bg: "#F0F9FF",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
};

const INVESTIGATION_STEPS = [
  {
    title: "Ticket clustering",
    time: "08:12 IST",
    type: "scan",
    tools: ["Zendesk"],
    body: "Scanned 142 new tickets from the last 72h. Identified 34 mentioning promo/coupon failures at checkout. All describe the same pattern.",
  },
  {
    title: "Verified discount not reaching payment",
    time: "08:18 IST",
    type: "data",
    tools: ["Mixpanel", "BigQuery"],
    body: "Cross-referenced 12 user IDs with Mixpanel events. All fired checkout.promo.applied but BigQuery order totals match pre-discount price.",
  },
  {
    title: "Promo codes themselves are valid",
    time: "08:22 IST",
    type: "check",
    tools: ["BigQuery"],
    body: "Queried the promotions table. SUMMER25, FLAT15, WELCOME10 are all active, within validity dates. Codes aren't the problem.",
  },
  {
    title: "Reviewed 6 session replays",
    time: "08:28 IST",
    type: "replay",
    tools: ["PostHog"],
    body: "In all 6 sessions, cart summary updates with discount but final confirmation reverts to original total.",
  },
];

const InsightCard = function InsightCard(
  {
    reduce,
    innerRef,
    defaultLogOpen = false,
    mobile = false,
  }: {
    reduce: boolean | null;
    innerRef: React.Ref<HTMLDivElement>;
    defaultLogOpen?: boolean;
    mobile?: boolean;
  },
) {
  const [logOpen, setLogOpen] = useState(defaultLogOpen);

  // On mobile the card is shown on its own (the signal pills no longer
  // stream in first), so it shouldn't sit invisible waiting on the
  // constellation timeline — bring it and its content in right away.
  const cardStart = mobile ? 0.1 : T.cardStart;
  const cardContent = mobile ? 0.3 : T.cardContent;

  const trans = (delay = 0) =>
    reduce
      ? { duration: 0 }
      : {
          duration: 0.55,
          delay: cardContent + delay,
          ease: [0.16, 1, 0.3, 1] as const,
        };

  const tools = ["Zendesk", "Mixpanel", "Sentry", "PostHog"];

  return (
    <motion.div
      ref={innerRef}
      initial={reduce ? false : { opacity: 0, scale: 0.78, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              duration: 0.8,
              delay: cardStart,
              ease: [0.16, 1, 0.3, 1],
            }
      }
      style={{ transformOrigin: "center center" }}
      className="relative rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_30px_80px_-30px_rgba(26,26,26,0.28)] overflow-hidden"
    >
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={trans(0)}
        className="flex items-center px-4 sm:px-5 py-3 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)]"
      >
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
      </motion.div>

      <div className="p-4 sm:p-5">
        <motion.h3
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={trans(0.1)}
          className="text-[15px] sm:text-[16px] font-semibold leading-snug text-[color:var(--color-foreground)]"
        >
          Promo discounts applied client-side but never persisted to payment gateway
        </motion.h3>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={trans(0.18)}
          className="mt-2 text-[12.5px] leading-relaxed text-[color:var(--color-foreground-secondary)]"
        >
          34 customers charged full price despite promo codes showing as applied in the UI.
          The discount is registered client-side but the order payload sent to the payment
          service omits the discount object, resulting in ₹3.8L in overcharges across 4
          enterprise accounts over 72 hours.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={trans(0.28)}
          className="mt-3 flex items-center gap-3 text-[11px]"
        >
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[color:var(--color-primary-subtle)] border border-[color:var(--color-primary-subtle-border)] text-[color:var(--color-primary)] font-semibold">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
              <polyline points="16 17 22 17 22 11" />
            </svg>
            ₹3.8L overcharged
          </span>
          <span className="text-[color:var(--color-foreground-muted)]">
            34 tickets · 28 users · 72h
          </span>
        </motion.div>

        {/* Investigation log — collapsible */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={trans(0.38)}
          className="mt-3"
        >
          <button
            type="button"
            onClick={() => setLogOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)] hover:bg-[color:var(--color-background-secondary)] transition-colors"
          >
            <span
              className={`flex text-left ${
                mobile
                  ? "flex-col items-start gap-0.5"
                  : "items-center gap-2"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-foreground-muted)]">
                Investigation log
              </span>
              <span className="text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
                4 checks · 4 tools · 16 min
              </span>
            </span>
            <motion.svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: logOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 text-[color:var(--color-foreground-muted)]"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </button>

          <AnimatePresence initial={false}>
            {logOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <ol className="relative pl-3 pt-3 pb-1">
                  <div
                    className="absolute left-[17px] top-4 bottom-3 w-px bg-[color:var(--color-border)]"
                    aria-hidden="true"
                  />
                  {INVESTIGATION_STEPS.map((step) => (
                    <li
                      key={step.title}
                      className="relative flex gap-2.5 pb-3.5 last:pb-0"
                    >
                      <div
                        className="relative z-10 flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 border-white"
                        style={{ backgroundColor: STEP_ICONS[step.type].bg, color: STEP_ICONS[step.type].color }}
                      >
                        {STEP_ICONS[step.type].icon}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[11.5px] font-semibold text-[color:var(--color-foreground)]">
                            {step.title}
                          </span>
                          <span className="text-[9px] font-mono text-[color:var(--color-foreground-muted)]">
                            {step.time}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10.5px] leading-snug text-[color:var(--color-foreground-secondary)]">
                          {step.body}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          {step.tools.map((t) => (
                            <ToolTag key={t} name={t} size="xs" />
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={trans(0.48)}
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

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={trans(0.58)}
          className={`mt-3 flex gap-2 p-2.5 rounded-lg border border-dashed border-[color:var(--color-primary-subtle-border)] bg-white ${
            mobile ? "flex-col items-stretch" : "items-center justify-between"
          }`}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-foreground-muted)]">
              Suggested action
            </p>
            <p
              className={`text-[12px] font-medium text-[color:var(--color-foreground)] ${
                mobile ? "" : "truncate"
              }`}
            >
              Create Linear issue · escalate to Payments
            </p>
          </div>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Book a demo"
            className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full bg-[color:var(--color-foreground)] text-white text-[11px] font-medium transition-opacity hover:opacity-90 ${
              mobile ? "w-full" : "shrink-0"
            }`}
          >
            Create
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────
// PILL WRAPPER — entry animation; no exit fade per requirement.
// ─────────────────────────────────────────────────────────────

function AnimatedPill({
  id,
  index,
  reduce,
  pillRef,
}: {
  id: SignalId;
  index: number;
  reduce: boolean | null;
  pillRef: (el: HTMLDivElement | null) => void;
}) {
  const Pill = PILL_BY_ID[id];
  return (
    <motion.div
      ref={pillRef}
      initial={reduce ? false : { opacity: 0, x: -12, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              duration: 0.55,
              delay: T.pillsStart + index * T.pillsStagger,
              ease: [0.16, 1, 0.3, 1],
            }
      }
    >
      <Pill />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// DESKTOP LAYOUT
// ─────────────────────────────────────────────────────────────

function DesktopLayout({ reduce }: { reduce: boolean | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<SignalId, HTMLDivElement | null>>({
    zendesk: null,
    mixpanel: null,
    sentry: null,
    posthog: null,
  });

  const layout = useConnectionPaths(containerRef, cardRef, pillRefs);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[1180px] mx-auto px-2"
    >
      <ConnectionLayer layout={layout} reduce={reduce} />
      <CenterPulse layout={layout} reduce={reduce} />

      <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] gap-12 xl:gap-16 items-center">
        <div className="flex flex-col gap-3">
          {SIGNAL_ORDER.map((id, i) => (
            <AnimatedPill
              key={id}
              id={id}
              index={i}
              reduce={reduce}
              pillRef={(el) => {
                pillRefs.current[id] = el;
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-[520px] w-full justify-self-start">
          <InsightCard reduce={reduce} innerRef={cardRef} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MOBILE LAYOUT — just the Squash insight card (log pre-opened);
// the source signal pills and constellation are desktop-only.
// ─────────────────────────────────────────────────────────────

function MobileLayout({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="w-full max-w-[480px] mx-auto">
      <InsightCard
        reduce={reduce}
        innerRef={() => {}}
        defaultLogOpen
        mobile
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────

export function HeroLiveInsight() {
  const reduce = useReducedMotion();
  return (
    <>
      <div className="hidden lg:block">
        <DesktopLayout reduce={reduce} />
      </div>
      <div className="lg:hidden">
        <MobileLayout reduce={reduce} />
      </div>
    </>
  );
}
