"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import { IntegrationMark } from "./ui/IntegrationMark";
import { INTEGRATIONS } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const NARRATIVE_LINES = [
  "PMs spend 30–40% of their time on manual data work.",
  "Five tools open. Cross-referencing funnels. Watching recordings. Pulling reports.",
  "Conversion dropped on Tuesday. Found on Friday. Fix ships next sprint.",
  "10,000 sessions recorded. 50 reviewed. Your team acts on less than 5% of your data.",
  "The data was always there. Nobody had time to find it.",
];

// Weighted timing: 5 lines share 72% of scroll, punchline gets 28%.
const LINE_WEIGHT = 0.72 / NARRATIVE_LINES.length;
const PUNCHLINE_START = 0.72;

const LINE_RANGES: [number, number][] = NARRATIVE_LINES.map((_, i) => [
  i * LINE_WEIGHT,
  (i + 1) * LINE_WEIGHT,
]);

const FADE_FRACTION = 0.24;
const FADE = LINE_WEIGHT * FADE_FRACTION;

/* ── Background elements ─────────────────────────────────────── */

type BGCard = {
  name: string;
  signal: string;
  detail: string;
  badge?: string;
  time: string;
  severity: "critical" | "warning" | "info";
  top: string;
  left: string;
  mobileTop?: string;
  mobileLeft?: string;
  rotation: number;
  driftDuration: number;
  driftAmount: number;
  activeLines: number[];
};

const BG_CARDS: BGCard[] = [
  {
    name: "Mixpanel",
    signal: "Checkout funnel ↓19%",
    detail: "Drop at promo-apply step",
    badge: "1",
    time: "72h ago",
    severity: "critical",
    top: "6%",
    left: "1%",
    mobileTop: "2%",
    mobileLeft: "-4%",
    rotation: -2.5,
    driftDuration: 7,
    driftAmount: 5,
    activeLines: [0, 1, 2],
  },
  {
    name: "Sentry",
    signal: "TypeError spike — 142",
    detail: "discount.amount undefined",
    badge: "142",
    time: "72h ago",
    severity: "critical",
    top: "5%",
    left: "71%",
    mobileTop: "5%",
    mobileLeft: "62%",
    rotation: 2,
    driftDuration: 8,
    driftAmount: 4,
    activeLines: [1, 2, 3],
  },
  {
    name: "Zendesk",
    signal: "12 tickets — promo issue",
    detail: "Users charged full price",
    badge: "12",
    time: "since Tue",
    severity: "warning",
    top: "44%",
    left: "0%",
    mobileTop: "35%",
    mobileLeft: "-8%",
    rotation: 1.5,
    driftDuration: 9,
    driftAmount: 3,
    activeLines: [0, 1, 3],
  },
  {
    name: "BigQuery",
    signal: "₹3.8L revenue variance",
    detail: "Totals diverging from expected",
    time: "unreviewed",
    severity: "info",
    top: "42%",
    left: "77%",
    mobileTop: "38%",
    mobileLeft: "68%",
    rotation: -1.5,
    driftDuration: 8,
    driftAmount: 4,
    activeLines: [0, 2, 3],
  },
  {
    name: "Granola",
    signal: "3 calls mention checkout",
    detail: "Enterprise flagging billing",
    badge: "3",
    time: "this week",
    severity: "info",
    top: "78%",
    left: "2%",
    mobileTop: "72%",
    mobileLeft: "-4%",
    rotation: 2,
    driftDuration: 10,
    driftAmount: 3,
    activeLines: [0, 2, 4],
  },
  {
    name: "Hotjar",
    signal: "Rage clicks at checkout",
    detail: "47 sessions retrying promo",
    badge: "47",
    time: "3d",
    severity: "warning",
    top: "74%",
    left: "73%",
    mobileTop: "70%",
    mobileLeft: "64%",
    rotation: -2,
    driftDuration: 6,
    driftAmount: 5,
    activeLines: [1, 3, 4],
  },
];

// Customer feedback / quotes scattered in the background
type FeedbackSnippet = {
  type: "quote" | "metric" | "notification";
  content: string;
  subtext?: string;
  icon?: string;
  top: string;
  left: string;
  rotation: number;
  driftDuration: number;
};

const FEEDBACK_SNIPPETS: FeedbackSnippet[] = [
  // Customer quotes
  {
    type: "quote",
    content: "\"Why was I charged full price?\"",
    subtext: "— Sarah M., via Zendesk",
    top: "18%",
    left: "20%",
    rotation: -1.5,
    driftDuration: 8,
  },
  {
    type: "quote",
    content: "\"Checkout is broken again\"",
    subtext: "— #product-bugs, Slack",
    top: "22%",
    left: "56%",
    rotation: 1,
    driftDuration: 9,
  },
  {
    type: "quote",
    content: "\"Can't apply my promo code\"",
    subtext: "— Support ticket #4821",
    top: "58%",
    left: "18%",
    rotation: 2,
    driftDuration: 7,
  },
  {
    type: "quote",
    content: "\"We're losing enterprise deals\"",
    subtext: "— VP Sales, Granola call",
    top: "60%",
    left: "58%",
    rotation: -1,
    driftDuration: 10,
  },
  // Metric drops
  {
    type: "metric",
    content: "Conv. Rate",
    subtext: "↓ 19%",
    icon: "chart-down",
    top: "30%",
    left: "6%",
    rotation: -1,
    driftDuration: 8,
  },
  {
    type: "metric",
    content: "Cart Abandon",
    subtext: "↑ 34%",
    icon: "chart-up-bad",
    top: "34%",
    left: "86%",
    rotation: 1.5,
    driftDuration: 9,
  },
  {
    type: "metric",
    content: "NPS Score",
    subtext: "↓ 12 pts",
    icon: "chart-down",
    top: "84%",
    left: "40%",
    rotation: -2,
    driftDuration: 7,
  },
  {
    type: "metric",
    content: "Avg. Resolution",
    subtext: "↑ 4.2 days",
    icon: "clock",
    top: "88%",
    left: "82%",
    rotation: 1,
    driftDuration: 11,
  },
  // Notifications
  {
    type: "notification",
    content: "@channel funnel anomaly detected",
    top: "14%",
    left: "38%",
    rotation: 0.5,
    driftDuration: 8,
  },
  {
    type: "notification",
    content: "Weekly report: 3 metrics need review",
    top: "90%",
    left: "14%",
    rotation: -1,
    driftDuration: 9,
  },
  {
    type: "notification",
    content: "Session replay: 0 of 47 reviewed",
    top: "50%",
    left: "85%",
    rotation: 1.5,
    driftDuration: 7,
  },
  {
    type: "notification",
    content: "Dashboard stale: last refresh 6d ago",
    top: "68%",
    left: "10%",
    rotation: -0.5,
    driftDuration: 10,
  },
];

const BG_CONNECTORS: [number, number][] = [
  [0, 2], [1, 3], [2, 4], [3, 5],
  [0, 1], [4, 5], [0, 3], [2, 5],
  [1, 4], [0, 5],
];

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════ */

export function Problem() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="problem" aria-labelledby="problem-heading">
      <h2 id="problem-heading" className="sr-only">
        The Problem
      </h2>

      <div
        ref={containerRef}
        className="hidden md:block relative"
        style={reduce ? undefined : { height: "580vh" }}
      >
        {reduce ? (
          <ReducedMotionDesktop />
        ) : (
          <div className="sticky top-0 h-screen overflow-hidden">
            <DesktopBackground scrollYProgress={scrollYProgress} />
            <DesktopForeground scrollYProgress={scrollYProgress} />
          </div>
        )}
      </div>

      <div className="md:hidden">
        <MobileLayout reduce={!!reduce} />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — Background layer
   ═══════════════════════════════════════════════════════════════ */

function DesktopBackground({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const [activeStep, setActiveStep] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p >= PUNCHLINE_START) {
      setActiveStep(5);
    } else {
      setActiveStep(Math.min(4, Math.floor(p / LINE_WEIGHT)));
    }
  });

  // Tool cards crescendo then clear for punchline
  const cardIntensity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.45, PUNCHLINE_START - 0.06, PUNCHLINE_START, 1],
    [0.3, 0.5, 0.7, 0.8, 0.1, 0.06],
  );

  // Feedback snippets build chaos then vanish
  const snippetOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.4, PUNCHLINE_START - 0.06, PUNCHLINE_START],
    [0.15, 0.4, 0.6, 0.65, 0],
  );

  // Connectors intensify
  const connectorOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, PUNCHLINE_START - 0.05, PUNCHLINE_START],
    [0.15, 0.4, 0.7, 0.85, 0.05],
  );

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[color:var(--color-background)]" />

      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(232,100,15,0.04) 0%, transparent 70%)",
            "radial-gradient(ellipse 45% 40% at 12% 20%, rgba(232,100,15,0.025) 0%, transparent 60%)",
            "radial-gradient(ellipse 45% 40% at 88% 80%, rgba(255,160,122,0.03) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      <div className="absolute inset-0 dot-bg opacity-[0.18] pointer-events-none" />

      {/* SVG connectors */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        style={{ opacity: connectorOpacity }}
      >
        <defs>
          <linearGradient
            id="problem-conn-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#e8640f" stopOpacity="0.16" />
            <stop offset="50%" stopColor="#6b6b6b" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#e8640f" stopOpacity="0.16" />
          </linearGradient>
        </defs>
        {BG_CONNECTORS.map(([a, b], i) => {
          const ca = BG_CARDS[a];
          const cb = BG_CARDS[b];
          const x1 = parseFloat(ca.left) + 7;
          const y1 = parseFloat(ca.top) + 4;
          const x2 = parseFloat(cb.left) + 7;
          const y2 = parseFloat(cb.top) + 4;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#problem-conn-grad)"
              strokeWidth="0.14"
              strokeDasharray="0.6 1.5"
              vectorEffect="non-scaling-stroke"
              className="problem-connector-line"
              style={{
                animationDuration: `${9 + i * 1.4}s`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          );
        })}
      </motion.svg>

      {/* Floating tool cards */}
      {BG_CARDS.map((card, i) => (
        <FloatingBGCard
          key={card.name}
          card={card}
          index={i}
          activeStep={activeStep}
          cardIntensity={cardIntensity}
        />
      ))}

      {/* Customer feedback, metric drops, notifications */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: snippetOpacity }}
      >
        {FEEDBACK_SNIPPETS.map((snippet, i) => (
          <FeedbackElement key={i} snippet={snippet} index={i} />
        ))}
      </motion.div>

      {/* Center readability veil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 36% 18% at 50% 50%, rgba(250,249,246,0.78) 0%, rgba(250,249,246,0.35) 50%, transparent 82%)",
        }}
      />

      <style>{`
        @keyframes problem-dash-flow {
          to { stroke-dashoffset: -24; }
        }
        .problem-connector-line {
          animation-name: problem-dash-flow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes problem-card-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(calc(var(--float-amount) * -1)); }
        }
        @keyframes problem-snippet-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

/* ── Feedback background element ──────────────────────────────── */

function FeedbackElement({
  snippet,
  index,
}: {
  snippet: FeedbackSnippet;
  index: number;
}) {
  if (snippet.type === "quote") {
    return (
      <div
        className="absolute max-w-[180px] lg:max-w-[200px] rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2.5 shadow-sm"
        style={{
          top: snippet.top,
          left: snippet.left,
          transform: `rotate(${snippet.rotation}deg)`,
          animation: `problem-snippet-float ${snippet.driftDuration}s ease-in-out ${index * 0.4}s infinite`,
        }}
      >
        <p className="text-[10px] leading-snug text-[color:var(--color-foreground)] italic">
          {snippet.content}
        </p>
        {snippet.subtext && (
          <p className="mt-1 text-[8.5px] text-[color:var(--color-foreground-muted)] opacity-70">
            {snippet.subtext}
          </p>
        )}
      </div>
    );
  }

  if (snippet.type === "metric") {
    const isDown = snippet.subtext?.includes("↓");
    return (
      <div
        className="absolute w-[120px] lg:w-[140px] rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-2.5 shadow-sm"
        style={{
          top: snippet.top,
          left: snippet.left,
          transform: `rotate(${snippet.rotation}deg)`,
          animation: `problem-snippet-float ${snippet.driftDuration}s ease-in-out ${index * 0.3}s infinite`,
        }}
      >
        <p className="text-[9px] text-[color:var(--color-foreground-muted)] uppercase tracking-wider font-medium">
          {snippet.content}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <MiniSparkline down={!!isDown} />
          <span
            className={`text-[12px] font-bold tabular-nums ${
              isDown ? "text-red-500" : "text-amber-600"
            }`}
          >
            {snippet.subtext}
          </span>
        </div>
      </div>
    );
  }

  // notification type
  return (
    <div
      className="absolute max-w-[200px] lg:max-w-[220px] rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2.5 py-1.5 shadow-sm flex items-center gap-2"
      style={{
        top: snippet.top,
        left: snippet.left,
        transform: `rotate(${snippet.rotation}deg)`,
        animation: `problem-snippet-float ${snippet.driftDuration}s ease-in-out ${index * 0.35}s infinite`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
      <p className="text-[9px] leading-snug text-[color:var(--color-foreground-muted)] truncate">
        {snippet.content}
      </p>
    </div>
  );
}

/* ── Mini sparkline SVG for metric cards ──────────────────────── */

function MiniSparkline({ down }: { down: boolean }) {
  const path = down
    ? "M0,2 C4,2 6,3 10,4 C14,5 18,9 24,11"
    : "M0,10 C4,9 8,7 12,8 C16,9 20,3 24,2";
  return (
    <svg
      width="24"
      height="12"
      viewBox="0 0 24 12"
      fill="none"
      className="shrink-0"
    >
      <path
        d={path}
        stroke={down ? "#ef4444" : "#d97706"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Floating tool card ──────────────────────────────────────── */

function FloatingBGCard({
  card,
  index,
  activeStep,
  cardIntensity,
}: {
  card: BGCard;
  index: number;
  activeStep: number;
  cardIntensity: MotionValue<number>;
}) {
  const integ = INTEGRATIONS.find((it) => it.name === card.name);
  const isActive = card.activeLines.includes(activeStep);

  const opacity = useTransform(cardIntensity, (v) =>
    isActive ? Math.min(1, v * 1.35) : v,
  );

  return (
    <motion.div
      className="absolute w-[170px] lg:w-[205px]"
      style={{
        top: card.top,
        left: card.left,
        rotate: card.rotation,
        opacity,
      }}
    >
      <div
        className="transition-transform duration-500 ease-out"
        style={
          {
            "--float-amount": `${card.driftAmount}px`,
            animation: `problem-card-float ${card.driftDuration}s ease-in-out ${
              index * 0.4
            }s infinite`,
            transform: isActive ? "scale(1.04)" : "scale(0.97)",
          } as React.CSSProperties
        }
      >
        <ToolSignalCard
          name={card.name}
          signal={card.signal}
          detail={card.detail}
          badge={card.badge}
          time={card.time}
          severity={card.severity}
          color={integ?.color ?? "#7a7873"}
          slug={integ?.slug}
          highlighted={isActive}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — Foreground layer (narrative text)
   ═══════════════════════════════════════════════════════════════ */

function DesktopForeground({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  // "The problem" label fully gone well before punchline arrives
  const labelOpacity = useTransform(scrollYProgress, (p) => {
    if (p >= PUNCHLINE_START - 0.04) return 0;
    if (p <= 0.02) return smoothstep(0, 0.02, p);
    if (p >= PUNCHLINE_START - 0.12) {
      return 1 - smoothstep(PUNCHLINE_START - 0.12, PUNCHLINE_START - 0.04, p);
    }
    return 1;
  });

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 lg:px-8">
      <motion.p
        className="mb-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]"
        style={{ opacity: labelOpacity }}
      >
        The problem
      </motion.p>

      <div
        className="w-full max-w-4xl"
        style={{ display: "grid", placeItems: "center" }}
      >
        {NARRATIVE_LINES.map((text, i) => (
          <NarrativeLine
            key={i}
            text={text}
            index={i}
            scrollYProgress={scrollYProgress}
          />
        ))}
        <PunchlineLine scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}

function NarrativeLine({
  text,
  index,
  scrollYProgress,
}: {
  text: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const [start, end] = LINE_RANGES[index];

  const opacity = useTransform(scrollYProgress, (p) => {
    if (p < start || p > end) return 0;
    const fadeInEnd = start + FADE;
    const fadeOutStart = end - FADE;
    if (p <= fadeInEnd) return smoothstep(start, fadeInEnd, p);
    if (p >= fadeOutStart) return 1 - smoothstep(fadeOutStart, end, p);
    return 1;
  });

  const y = useTransform(scrollYProgress, (p) => {
    if (p < start || p > end) return 20;
    const fadeInEnd = start + FADE;
    const fadeOutStart = end - FADE;
    if (p <= fadeInEnd) return 20 * (1 - smoothstep(start, fadeInEnd, p));
    if (p >= fadeOutStart) return -14 * smoothstep(fadeOutStart, end, p);
    return 0;
  });

  const scale = useTransform(scrollYProgress, (p) => {
    if (p < start || p > end) return 0.96;
    const fadeInEnd = start + FADE;
    const fadeOutStart = end - FADE;
    if (p <= fadeInEnd) return 0.96 + 0.04 * smoothstep(start, fadeInEnd, p);
    if (p >= fadeOutStart)
      return 1 - 0.02 * smoothstep(fadeOutStart, end, p);
    return 1;
  });

  return (
    <motion.p
      className="text-balance text-center text-[28px] lg:text-[42px] xl:text-[48px] leading-[1.18] tracking-[-0.02em] text-[color:var(--color-foreground)]"
      style={{
        gridRow: 1,
        gridColumn: 1,
        fontFamily: "var(--font-display)",
        opacity,
        y,
        scale,
      }}
    >
      {text}
    </motion.p>
  );
}

function PunchlineLine({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const fadeInEnd = PUNCHLINE_START + 0.08;

  const opacity = useTransform(scrollYProgress, (p) => {
    if (p < PUNCHLINE_START) return 0;
    if (p >= fadeInEnd) return 1;
    return smoothstep(PUNCHLINE_START, fadeInEnd, p);
  });

  const y = useTransform(scrollYProgress, (p) => {
    if (p < PUNCHLINE_START) return 30;
    if (p >= fadeInEnd) return 0;
    return 30 * (1 - smoothstep(PUNCHLINE_START, fadeInEnd, p));
  });

  const scale = useTransform(scrollYProgress, (p) => {
    if (p < PUNCHLINE_START) return 0.94;
    if (p >= fadeInEnd) return 1;
    return 0.94 + 0.06 * smoothstep(PUNCHLINE_START, fadeInEnd, p);
  });

  return (
    <motion.p
      className="whitespace-nowrap text-center text-[26px] lg:text-[42px] xl:text-[48px] leading-[1.14] tracking-[-0.02em] text-[color:var(--color-foreground)]"
      style={{
        gridRow: 1,
        gridColumn: 1,
        fontFamily: "var(--font-display)",
        opacity,
        y,
        scale,
      }}
    >
      Squash solves the{" "}
      <span className="italic text-[color:var(--color-primary)]">
        attention problem,
      </span>{" "}
      not the data problem.
    </motion.p>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REDUCED-MOTION DESKTOP
   ═══════════════════════════════════════════════════════════════ */

function ReducedMotionDesktop() {
  return (
    <div className="py-20 md:py-32 max-w-3xl mx-auto px-6 lg:px-8">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
        The problem
      </p>
      <div className="mt-8 space-y-8">
        {NARRATIVE_LINES.map((text, i) => (
          <p
            key={i}
            className="text-[24px] md:text-[32px] leading-[1.2] tracking-[-0.02em] text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {text}
          </p>
        ))}
      </div>
      <p
        className="mt-14 text-center text-[24px] md:text-[32px] leading-snug text-[color:var(--color-foreground)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Squash solves the{" "}
        <span className="italic text-[color:var(--color-primary)]">
          attention problem,
        </span>{" "}
        not the data problem.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — intersection-observer, stacked lines
   ═══════════════════════════════════════════════════════════════ */

const MOBILE_CARD_INDICES = [0, 1, 4, 5];

function MobileLayout({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative py-16 sm:py-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,100,15,0.03) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 dot-bg opacity-20 pointer-events-none" />

      {!reduce && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {MOBILE_CARD_INDICES.map((ci, i) => {
            const card = BG_CARDS[ci];
            const integ = INTEGRATIONS.find((it) => it.name === card.name);
            return (
              <motion.div
                key={card.name}
                className="absolute w-[130px] sm:w-[150px] opacity-[0.18]"
                style={{
                  top: card.mobileTop ?? card.top,
                  left: card.mobileLeft ?? card.left,
                  rotate: card.rotation,
                }}
                animate={{ y: [0, -card.driftAmount, 0] }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: card.driftDuration,
                    ease: "easeInOut",
                    delay: i * 0.6,
                  },
                }}
              >
                <ToolSignalCard
                  name={card.name}
                  signal={card.signal}
                  detail={card.detail}
                  badge={card.badge}
                  time={card.time}
                  severity={card.severity}
                  color={integ?.color ?? "#7a7873"}
                  slug={integ?.slug}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="relative z-10 max-w-lg mx-auto px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)] text-center"
        >
          The problem
        </motion.p>

        <div className="mt-8 space-y-10">
          {NARRATIVE_LINES.map((text, i) => (
            <motion.p
              key={i}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.7,
                delay: 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="text-[20px] sm:text-[24px] leading-[1.25] tracking-[-0.01em] text-[color:var(--color-foreground)] text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {text}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-14 text-center text-[20px] sm:text-[26px] leading-snug text-[color:var(--color-foreground)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Squash solves the{" "}
          <span className="italic text-[color:var(--color-primary)]">
            attention problem,
          </span>{" "}
          not the data problem.
        </motion.p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED — ToolSignalCard
   ═══════════════════════════════════════════════════════════════ */

function ToolSignalCard({
  name,
  signal,
  detail,
  badge,
  time,
  severity,
  color,
  slug,
  highlighted,
}: {
  name: string;
  signal: string;
  detail: string;
  badge?: string;
  time: string;
  severity: "critical" | "warning" | "info";
  color: string;
  slug?: string | null;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl border bg-[color:var(--color-surface)] p-3 transition-shadow duration-500 ${
        highlighted
          ? "border-[color:var(--color-primary)]/30 shadow-[0_8px_32px_-8px_rgba(232,100,15,0.2)]"
          : "border-[color:var(--color-border)] shadow-[0_8px_30px_-12px_rgba(26,26,26,0.18)]"
      }`}
    >
      {badge && (
        <span
          className={`absolute -top-2 -right-2 z-10 flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-white text-[9px] font-bold tabular-nums shadow-sm ${
            severity === "critical"
              ? "bg-red-500"
              : severity === "warning"
                ? "bg-amber-500"
                : "bg-blue-500"
          }`}
        >
          {badge}
        </span>
      )}

      <div className="flex items-center gap-2">
        <IntegrationMark name={name} color={color} slug={slug} size={22} />
        <span className="text-[11.5px] font-semibold text-[color:var(--color-foreground)] truncate flex-1">
          {name}
        </span>
        <span className="text-[9px] text-[color:var(--color-foreground-muted)] font-mono shrink-0 opacity-60">
          {time}
        </span>
      </div>

      <div className="mt-2">
        <p
          className={`text-[11px] font-semibold leading-snug ${
            severity === "critical"
              ? "text-red-600"
              : severity === "warning"
                ? "text-amber-700"
                : "text-[color:var(--color-foreground-secondary)]"
          }`}
        >
          {signal}
        </p>
        <p className="mt-0.5 text-[10px] text-[color:var(--color-foreground-muted)] leading-snug line-clamp-1">
          {detail}
        </p>
      </div>
    </div>
  );
}
