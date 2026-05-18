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
import { INTEGRATIONS } from "@/lib/constants";

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */
type Severity = "critical" | "high" | "medium";
type IssueType = "anomaly" | "recurring_tickets" | "ui_ux";
type StepType = "scan" | "data" | "check" | "replay";

interface InvestigationStep {
  title: string;
  tools: string[];
  time: string;
  body: string;
  stepType: StepType;
}

interface Issue {
  id: string;
  title: string;
  severity: Severity;
  type: IssueType;
  typeLabel: string;
  metric: string;
  metricLabel: string;
  usersAffected: string;
  timeAgo: string;
  description: string;
  investigation: {
    steps: InvestigationStep[];
    durationLabel: string;
    rootCause: string;
    rootCauseDetail: string;
  };
  ticket: {
    id: string;
    title: string;
    priority: string;
    points: string;
    assignee: string;
    acceptance: string[];
  };
  slackSummary: string;
}

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
   ══════════════════════════════════════════════════════════════ */
const SEV: Record<Severity, { color: string; bg: string; label: string }> = {
  critical: { color: "#DC2626", bg: "#FEF2F2", label: "Critical" },
  high: { color: "#EA580C", bg: "#FFF7ED", label: "High" },
  medium: { color: "#CA8A04", bg: "#FEFCE8", label: "Medium" },
};

const TYPE_COLORS: Record<IssueType, { color: string; bg: string }> = {
  anomaly: { color: "#7C3AED", bg: "#F5F3FF" },
  recurring_tickets: { color: "#EA580C", bg: "#FFF7ED" },
  ui_ux: { color: "#0284C7", bg: "#F0F9FF" },
};

const STEP_ICONS: Record<
  StepType,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  scan: {
    color: "#6B7280",
    bg: "#F9FAFB",
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  data: {
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  check: {
    color: "#16A34A",
    bg: "#F0FDF4",
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  replay: {
    color: "#0284C7",
    bg: "#F0F9FF",
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
};

/* ══════════════════════════════════════════════════════════════
   ISSUE DATA
   ══════════════════════════════════════════════════════════════ */
const ISSUES: Issue[] = [
  {
    id: "sq-001",
    title: "Conversion drop masked by traffic surge after deploy",
    severity: "critical",
    type: "anomaly",
    typeLabel: "Analytics Anomaly",
    metric: "−18%",
    metricLabel: "conversion rate",
    usersAffected: "14,820",
    timeAgo: "2h ago",
    description:
      "Quote-to-application conversion silently dropped 18% after a front-end deploy. A simultaneous brand campaign masked the decline by driving 30% more top-of-funnel traffic.",
    investigation: {
      steps: [
        {
          title: "Funnel divergence: conversion rate decoupled from traffic volume",
          tools: ["Mixpanel"],
          time: "08:12",
          stepType: "data",
          body: "Quote-to-application rate dropped 18% while absolute numbers stayed flat — volume increase from campaign masked the decline.",
        },
        {
          title: "Deploy fe-v2.14.3 moved CTA below fold on mobile",
          tools: ["GitHub"],
          time: "08:18",
          stepType: "scan",
          body: "Front-end deploy on April 14 changed CTA from a sticky bottom bar to an inline button below the comparison table.",
        },
        {
          title: "34% mobile scroll depth to new CTA position",
          tools: ["PostHog"],
          time: "08:24",
          stepType: "replay",
          body: "Only 34% of mobile users scroll past the plan comparison table to reach the new inline CTA position.",
        },
        {
          title: "Brand campaign inflated absolute numbers, masking the drop",
          tools: ["BigQuery"],
          time: "08:30",
          stepType: "check",
          body: "Campaign drove 30% more traffic, keeping absolute application numbers flat and hiding the rate decline.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 18 min",
      rootCause: "CTA moved below fold on mobile",
      rootCauseDetail:
        "Deploy fe-v2.14.3 moved the CTA from a sticky bottom bar to inline below the comparison table. Only 34% of mobile users scroll far enough.",
    },
    ticket: {
      id: "SQ-501",
      title: "Revert CTA to sticky bottom bar on mobile viewports",
      priority: "P0",
      points: "3",
      assignee: "@akhil",
      acceptance: [
        "Sticky CTA restored on mobile viewports < 768px",
        "A/B test inline placement for desktop separately",
        "Add conversion-rate alert normalised for traffic volume",
      ],
    },
    slackSummary:
      "Quote-to-application conversion dropped 18% after fe-v2.14.3 moved CTA below fold on mobile. Brand campaign masked it.",
  },
  {
    id: "sq-002",
    title: "487 OTP failure tickets from Jio users in UP-East",
    severity: "high",
    type: "recurring_tickets",
    typeLabel: "Recurring Tickets",
    metric: "3.2×",
    metricLabel: "ticket spike",
    usersAffected: "3,840",
    timeAgo: "4h ago",
    description:
      '"OTP not received" tickets jumped 3.2× over 5 days. 87% trace to Jio users in UP-East — a UIDAI gateway routing issue, not an internal bug.',
    investigation: {
      steps: [
        {
          title: 'Clustered 487 "OTP not received" tickets from 5 days',
          tools: ["Zendesk"],
          time: "09:05",
          stepType: "scan",
          body: "Scanned 5 days of support tickets. 487 OTP failure mentions clustered around the same geographic and carrier pattern.",
        },
        {
          title: "87% of failures isolated to Jio UP-East carrier",
          tools: ["Mixpanel", "BigQuery"],
          time: "09:14",
          stepType: "data",
          body: "Cross-referenced device and carrier metadata. 87% of OTP failures trace to Jio users in the UP-East circle.",
        },
        {
          title: "Airtel/Vi/BSNL failure rates normal at 2.9%",
          tools: ["BigQuery"],
          time: "09:20",
          stepType: "check",
          body: "Baseline check: all other carriers across all circles show a normal 2.9% OTP failure rate.",
        },
        {
          title: "UIDAI gateway routing issue confirmed, not internal",
          tools: ["Sentry"],
          time: "09:28",
          stepType: "check",
          body: "Root cause is UIDAI SMS gateway routing through Jio UP-East, not an internal service failure.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 23 min",
      rootCause: "UIDAI SMS gateway routing failure",
      rootCauseDetail:
        "Jio's UP-East circle SMS gateway has intermittent UIDAI routing failures. Not an internal bug — but CS lacks this context.",
    },
    ticket: {
      id: "SQ-502",
      title: "Add DigiLocker fallback for OTP failures on Jio UP-East",
      priority: "P1",
      points: "5",
      assignee: "@priya",
      acceptance: [
        'Fallback "Verify via DigiLocker" after 2 failed OTP attempts',
        "Carrier detection on OTP page for proactive alternate options",
        "CS scripts updated with carrier-specific context",
      ],
    },
    slackSummary:
      "487 OTP failure tickets in 5 days. 87% from Jio UP-East — UIDAI gateway issue, not internal. KYC drop-off at 31%.",
  },
  {
    id: "sq-003",
    title: "Premium calculator price mismatch eroding trust",
    severity: "high",
    type: "ui_ux",
    typeLabel: "UX Issue",
    metric: "+26pts",
    metricLabel: "bounce rate gap",
    usersAffected: "22,450",
    timeAgo: "6h ago",
    description:
      "Calculator shows ₹812/mo but quote page shows ₹943/mo. 328 trust complaints in 2 weeks and a 26pt bounce-rate gap from calculator traffic.",
    investigation: {
      steps: [
        {
          title: "26pt bounce spike on quote page from calculator traffic",
          tools: ["Mixpanel"],
          time: "10:02",
          stepType: "data",
          body: "Quote page bounce rate for calculator referral traffic is 41% vs 15% for direct — a 26-point gap.",
        },
        {
          title: "Calculator shows ₹812/mo, quote page shows ₹943/mo",
          tools: ["PostHog"],
          time: "10:10",
          stepType: "replay",
          body: "Compared calculator output to actual quote pricing. ₹131/month difference traced to excluded GST and default rider.",
        },
        {
          title: "Calculator excludes GST (18%) and pre-selected rider",
          tools: ["BigQuery"],
          time: "10:18",
          stepType: "check",
          body: "Calculator formula last updated Jan 2026. Excludes 18% GST and the pre-selected Accidental Death rider.",
        },
        {
          title: '328 "price mismatch" tickets clustered from 2 weeks',
          tools: ["Zendesk"],
          time: "10:26",
          stepType: "scan",
          body: "328 Zendesk tickets in 14 days specifically mentioning pricing discrepancy between calculator and quote.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 24 min",
      rootCause: "Calculator excludes GST + default rider",
      rootCauseDetail:
        "Landing page calculator hasn't been synced with the quote engine since Jan 2026. It excludes 18% GST and the pre-selected Accidental Death rider.",
    },
    ticket: {
      id: "SQ-503",
      title: "Sync premium calculator with quote engine defaults",
      priority: "P1",
      points: "3",
      assignee: "@ritu",
      acceptance: [
        'Calculator displays "₹943/mo incl. GST" matching quote page',
        "Tooltip on quote page explains price breakdown for calc traffic",
        "Pre-selected rider removed from defaults, or included in calc",
      ],
    },
    slackSummary:
      "Calculator shows ₹812/mo but quote page shows ₹943/mo. 328 trust complaints in 2 weeks. 41% bounce from calculator traffic.",
  },
  {
    id: "sq-004",
    title: "Cart abandonment spike after payment timeout increase",
    severity: "critical",
    type: "anomaly",
    typeLabel: "Analytics Anomaly",
    metric: "−12%",
    metricLabel: "cart-to-order",
    usersAffected: "45,200",
    timeAgo: "8h ago",
    description:
      "Cart-to-order conversion dropped 12% after Razorpay doubled timeout to 30s. Retry rate fell from 52% to 28% — users think the app is frozen.",
    investigation: {
      steps: [
        {
          title: "Cart-to-order conversion dropped 12% week-over-week",
          tools: ["Mixpanel"],
          time: "11:00",
          stepType: "data",
          body: "Week-over-week conversion dropped 12%. Dinner-time orders (7–10 PM) disproportionately affected.",
        },
        {
          title: "Payment timeout changed from 15s to 30s by Razorpay",
          tools: ["Sentry", "BigQuery"],
          time: "11:08",
          stepType: "scan",
          body: "Razorpay increased server-side timeout from 15s to 30s on April 22. Frontend matches this timeout with no progress indicator.",
        },
        {
          title: "Retry rate after timeout dropped from 52% to 28%",
          tools: ["PostHog"],
          time: "11:16",
          stepType: "data",
          body: "Users wait 2× longer on failed payments. Retry rate fell from 52% to 28% — most assume the app is frozen.",
        },
        {
          title: '892 "payment stuck" tickets in 1 week',
          tools: ["Zendesk"],
          time: "11:22",
          stepType: "scan",
          body: "892 support tickets describing a spinning loader with no progress indication or retry option.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 22 min",
      rootCause: "Payment gateway timeout doubled",
      rootCauseDetail:
        "Razorpay increased server-side timeout from 15s to 30s. Users now wait 2x longer on failures with no progress indicator.",
    },
    ticket: {
      id: "SQ-504",
      title: "Add client-side UX timeout at 15s with progress indicator",
      priority: "P0",
      points: "3",
      assignee: "@dev",
      acceptance: [
        'Show "Taking longer than usual" message at 15s',
        "Visual progress polling for payment status",
        "Optimistic confirmation for repeat customers with good history",
      ],
    },
    slackSummary:
      "Cart-to-order dropped 12% after Razorpay doubled timeout to 30s. Retry rate fell from 52% to 28%. ₹3.8Cr/week GMV at risk.",
  },
  {
    id: "sq-005",
    title: "Coupon auto-apply replacing better manual promo codes",
    severity: "medium",
    type: "recurring_tickets",
    typeLabel: "Recurring Tickets",
    metric: "2,340",
    metricLabel: "complaints",
    usersAffected: "8,900",
    timeAgo: "12h ago",
    description:
      "Auto-apply fires on checkout and replaces ₹150 manual codes with ₹50 auto codes. 31% of affected users stopped using coupons entirely.",
    investigation: {
      steps: [
        {
          title: '2,340 "coupon removed" tickets clustered from 2 weeks',
          tools: ["Zendesk"],
          time: "12:05",
          stepType: "scan",
          body: "Clustered 2,340 support tickets. Common theme: manually entered promo codes being overridden at checkout.",
        },
        {
          title: "Auto-apply replaces ₹150 manual code with ₹50 auto code",
          tools: ["Mixpanel"],
          time: "12:14",
          stepType: "data",
          body: "Auto-apply fires on checkout navigation and replaces existing ₹150 referral codes with a ₹50 SAVE50 auto-coupon.",
        },
        {
          title: "31% of affected users stopped using coupons entirely",
          tools: ["BigQuery"],
          time: "12:22",
          stepType: "check",
          body: "31% of affected users stopped entering coupon codes. Trust in the coupon system has measurably eroded.",
        },
        {
          title: "Auto-apply runs after checkout nav, no comparison logic",
          tools: ["PostHog"],
          time: "12:28",
          stepType: "replay",
          body: "Code path confirms: auto-apply hook runs after navigation with no discount-value comparison logic.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 23 min",
      rootCause: "Auto-apply overwrites better manual coupons",
      rootCauseDetail:
        "Auto-apply fires on checkout navigation and replaces any existing coupon without comparing discount values.",
    },
    ticket: {
      id: "SQ-505",
      title: "Never replace manual coupon with lower-value auto coupon",
      priority: "P1",
      points: "2",
      assignee: "@sanya",
      acceptance: [
        "Auto-apply skipped when manual coupon offers better discount",
        "Show comparison UI when auto coupon is better than manual",
        "Add user toggle to disable auto-apply in settings",
      ],
    },
    slackSummary:
      "Auto-apply replacing ₹150 manual codes with ₹50 auto codes. 2,340 complaints, 31% stopped using coupons entirely.",
  },
];

/* ══════════════════════════════════════════════════════════════
   TABS & CONFIG
   ══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: "detect", label: "Detects what matters" },
  { id: "investigate", label: "Investigates across tools" },
  { id: "act", label: "Closes the loop" },
] as const;

const AUTO_PLAY_MS = 7000;

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export function HowItWorks() {
  const reduce = useReducedMotion();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const advance = useCallback(() => {
    setActiveTab((prev) => {
      const next = (prev + 1) % TABS.length;
      if (next === 0) setSelectedIssue((si) => (si + 1) % ISSUES.length);
      return next;
    });
    setProgress(0);
    startRef.current = 0;
  }, []);

  useEffect(() => {
    if (paused || !isInView || reduce) return;
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const pct = Math.min((ts - startRef.current) / AUTO_PLAY_MS, 1);
      setProgress(pct);
      if (pct >= 1) advance();
      else rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeTab, paused, isInView, reduce, advance]);

  const resetTimer = () => {
    setProgress(0);
    startRef.current = 0;
  };

  const selectTab = (i: number) => {
    setActiveTab(i);
    resetTimer();
    setPaused(true);
  };

  const goToInvestigate = (issueIdx: number) => {
    setSelectedIssue(issueIdx);
    setActiveTab(1);
    resetTimer();
    setPaused(true);
  };

  const goToAct = () => {
    setActiveTab(2);
    resetTimer();
    setPaused(true);
  };

  const transition = reduce
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

  const issue = ISSUES[selectedIssue];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="hiw-heading"
      className="pt-16 sm:pt-20 md:pt-32 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        resetTimer();
      }}
    >
      {/* Heading */}
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
            Your product stack, monitored.{" "}
            <span className="italic text-[color:var(--color-primary)]">
              Issues resolved before they escalate.
            </span>
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl">
            Squash continuously watches your analytics, session replays, support
            tickets and error logs. When it spots something, it investigates
            across every tool and hands your team a fix — not just an alert.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-10 md:mt-14">
        <div
          className="grid border-b border-[color:var(--color-border)]"
          style={{ gridTemplateColumns: `repeat(${TABS.length}, 1fr)` }}
          role="tablist"
        >
          {TABS.map((tab, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => selectTab(i)}
                className={`relative py-3.5 sm:py-4 text-[13px] sm:text-[14.5px] font-medium transition-colors text-center cursor-pointer ${
                  isActive
                    ? "text-[color:var(--color-foreground)]"
                    : "text-[color:var(--color-foreground-muted)] hover:text-[color:var(--color-foreground-secondary)]"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.span
                    layoutId="hiw-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[color:var(--color-foreground)]"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                    }
                  />
                )}
                {isActive && !reduce && (
                  <span
                    className="absolute bottom-0 left-0 h-[2px] bg-[color:var(--color-primary)] z-10"
                    style={{ width: `${progress * 100}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Showcase area */}
      <div className="relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 80% at 50% 20%, rgba(232,100,15,0.05) 0%, transparent 70%), linear-gradient(180deg, var(--color-background) 0%, var(--color-surface) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${selectedIssue}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={transition}
            >
              {activeTab === 0 && (
                <DetectPanel
                  issues={ISSUES}
                  selectedIssue={selectedIssue}
                  onSelectIssue={setSelectedIssue}
                  onInvestigate={goToInvestigate}
                />
              )}
              {activeTab === 1 && (
                <InvestigatePanel issue={issue} onCreateTicket={goToAct} />
              )}
              {activeTab === 2 && <ActPanel issue={issue} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   DETECT PANEL — split view: issue list + detail preview
   ══════════════════════════════════════════════════════════════ */
function DetectPanel({
  issues,
  selectedIssue,
  onSelectIssue,
  onInvestigate,
}: {
  issues: Issue[];
  selectedIssue: number;
  onSelectIssue: (i: number) => void;
  onInvestigate: (i: number) => void;
}) {
  const issue = issues[selectedIssue];
  const sev = SEV[issue.severity];
  const typeColor = TYPE_COLORS[issue.type];
  const allTools = [
    ...new Set(issue.investigation.steps.flatMap((s) => s.tools)),
  ];

  return (
    <div className="rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_40px_80px_-30px_rgba(26,26,26,0.14)] overflow-hidden">
      {/* Chrome */}
      <div className="px-5 sm:px-7 py-3.5 border-b border-[color:var(--color-border-light)] bg-[color:var(--color-background-tertiary)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <span className="text-[11px] font-medium text-[color:var(--color-foreground-muted)]">
            Squash · Findings
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-foreground-muted)]">
            Needs Review · {issues.length}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-primary)] animate-pulse" />
        </div>
      </div>

      {/* Desktop: split view */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Left — issue list */}
        <div className="border-r border-[color:var(--color-border-light)]">
          {issues.map((iss, i) => {
            const s = SEV[iss.severity];
            const tc = TYPE_COLORS[iss.type];
            const isSelected = selectedIssue === i;
            return (
              <button
                key={iss.id}
                type="button"
                onClick={() => onSelectIssue(i)}
                className={`w-full text-left px-5 py-4 flex items-start gap-3 transition-colors cursor-pointer border-b border-[color:var(--color-border-light)] last:border-b-0 ${
                  isSelected
                    ? "bg-[color:var(--color-primary-subtle)]"
                    : "hover:bg-[color:var(--color-background-tertiary)]"
                }`}
                style={{
                  borderLeft: isSelected
                    ? `3px solid ${s.color}`
                    : "3px solid transparent",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                  style={{ backgroundColor: s.bg }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold leading-snug text-[color:var(--color-foreground)] line-clamp-2">
                    {iss.title}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.label}
                    </span>
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ color: tc.color, backgroundColor: tc.bg }}
                    >
                      {iss.typeLabel}
                    </span>
                    <span className="text-[9px] text-[color:var(--color-foreground-muted)] ml-auto">
                      {iss.timeAgo}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right — detail preview */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: sev.color }}
            >
              {sev.label}
            </span>
            <span
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ color: typeColor.color, backgroundColor: typeColor.bg }}
            >
              {issue.typeLabel}
            </span>
            <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
              · {issue.timeAgo}
            </span>
          </div>

          <h3 className="text-[18px] font-semibold leading-snug text-[color:var(--color-foreground)] tracking-[-0.3px]">
            {issue.title}
          </h3>
          <p className="mt-2.5 text-[13px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
            {issue.description}
          </p>

          {/* Key metrics */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-[color:var(--color-background-secondary)] border border-[color:var(--color-border-light)] p-3.5">
              <p className="text-[9px] font-semibold text-[color:var(--color-foreground-muted)] uppercase tracking-wider mb-1.5">
                Impact
              </p>
              <p
                className="text-[22px] font-bold text-[color:var(--color-foreground)] tracking-tight leading-none"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {issue.metric}
              </p>
              <p className="text-[10px] text-[color:var(--color-foreground-muted)] mt-1">
                {issue.metricLabel}
              </p>
            </div>
            <div className="rounded-xl bg-[color:var(--color-background-secondary)] border border-[color:var(--color-border-light)] p-3.5">
              <p className="text-[9px] font-semibold text-[color:var(--color-foreground-muted)] uppercase tracking-wider mb-1.5">
                Users affected
              </p>
              <p
                className="text-[22px] font-bold text-[color:var(--color-foreground)] tracking-tight leading-none"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {issue.usersAffected}
              </p>
              <p className="text-[10px] text-[color:var(--color-foreground-muted)] mt-1">
                in affected cohort
              </p>
            </div>
            <div className="rounded-xl bg-[color:var(--color-background-secondary)] border border-[color:var(--color-border-light)] p-3.5">
              <p className="text-[9px] font-semibold text-[color:var(--color-foreground-muted)] uppercase tracking-wider mb-1.5">
                Tools spanned
              </p>
              <div className="flex -space-x-1.5 mt-1">
                {allTools.map((name) => {
                  const integ = INTEGRATIONS.find((ig) => ig.name === name);
                  return (
                    <span
                      key={name}
                      className="ring-2 ring-[color:var(--color-background-secondary)] rounded-md"
                      title={name}
                    >
                      <IntegrationMark
                        name={name}
                        color={integ?.color ?? "#7a7873"}
                        slug={integ?.slug}
                        size={22}
                      />
                    </span>
                  );
                })}
              </div>
              <p className="text-[10px] text-[color:var(--color-foreground-muted)] mt-2">
                {allTools.length} tools queried
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onInvestigate(selectedIssue)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[color:var(--color-foreground)] text-white text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity"
          >
            View investigation
            <svg
              width="14"
              height="14"
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
          </button>
        </div>
      </div>

      {/* Mobile: compact list */}
      <div className="lg:hidden divide-y divide-[color:var(--color-border-light)]">
        {issues.map((iss, i) => {
          const s = SEV[iss.severity];
          const tc = TYPE_COLORS[iss.type];
          const isSelected = selectedIssue === i;
          return (
            <button
              key={iss.id}
              type="button"
              onClick={() => onInvestigate(i)}
              className={`w-full text-left px-5 py-4 sm:py-5 flex items-start gap-3 sm:gap-4 transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[color:var(--color-primary-subtle)]"
                  : "hover:bg-[color:var(--color-background-tertiary)]"
              }`}
              style={{
                borderLeft: isSelected
                  ? `3px solid ${s.color}`
                  : "3px solid transparent",
              }}
            >
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center mt-0.5"
                style={{ backgroundColor: s.bg }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13px] sm:text-[14px] font-semibold leading-snug text-[color:var(--color-foreground)] line-clamp-2">
                    {iss.title}
                  </p>
                  <span className="text-[10px] text-[color:var(--color-foreground-muted)] shrink-0 mt-0.5 whitespace-nowrap">
                    {iss.timeAgo}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{ color: tc.color, backgroundColor: tc.bg }}
                  >
                    {iss.typeLabel}
                  </span>
                  <span className="text-[10px] font-medium text-[color:var(--color-foreground-secondary)] bg-[color:var(--color-background-secondary)] border border-[color:var(--color-border-light)] px-1.5 py-0.5 rounded-full">
                    {iss.usersAffected} users
                  </span>
                </div>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-[color:var(--color-foreground-muted)] mt-1 hidden sm:block"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   INVESTIGATE PANEL — typed timeline with rich step details
   ══════════════════════════════════════════════════════════════ */
function InvestigatePanel({
  issue,
  onCreateTicket,
}: {
  issue: Issue;
  onCreateTicket: () => void;
}) {
  const inv = issue.investigation;
  const allTools = [...new Set(inv.steps.flatMap((s) => s.tools))];

  return (
    <div className="rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_40px_80px_-30px_rgba(26,26,26,0.14)] overflow-hidden">
      {/* Chrome */}
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
        <span className="text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
          {inv.durationLabel}
        </span>
      </div>

      {/* Issue title bar */}
      <div className="px-5 sm:px-7 py-4 bg-[color:var(--color-background)] border-b border-[color:var(--color-border-light)]">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: SEV[issue.severity].color }}
          >
            {SEV[issue.severity].label}
          </span>
          <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
            · {issue.usersAffected} users affected
          </span>
        </div>
        <h3 className="text-[15px] sm:text-[17px] font-semibold text-[color:var(--color-foreground)] leading-snug tracking-[-0.2px]">
          {issue.title}
        </h3>
      </div>

      {/* Investigation timeline */}
      <div className="px-5 sm:px-7 py-6">
        <ol className="relative pl-1">
          <div
            className="absolute left-[11px] sm:left-[12px] top-4 bottom-4 w-px bg-[color:var(--color-border)]"
            aria-hidden="true"
          />
          {inv.steps.map((step) => {
            const si = STEP_ICONS[step.stepType];
            return (
              <li
                key={step.title}
                className="relative flex gap-3 sm:gap-4 pb-5 last:pb-0"
              >
                <div
                  className="relative z-10 flex-shrink-0 w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] rounded-full flex items-center justify-center border-2 border-white"
                  style={{ backgroundColor: si.bg, color: si.color }}
                >
                  {si.icon}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h4 className="text-[12.5px] sm:text-[13.5px] font-semibold text-[color:var(--color-foreground)]">
                      {step.title}
                    </h4>
                    <span className="text-[9px] font-mono text-[color:var(--color-foreground-muted)]">
                      {step.time} IST
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] sm:text-[11.5px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
                    {step.body}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {step.tools.map((t) => (
                      <ToolTag key={t} name={t} size="xs" />
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Root cause + tools summary + CTA */}
      <div className="px-5 sm:px-7 pb-6 space-y-4">
        {/* Root cause card */}
        <div className="rounded-xl bg-[color:var(--color-primary-subtle)] border border-[color:var(--color-primary-subtle-border)] p-4 sm:p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
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
            <span className="text-[10px] font-mono text-[color:var(--color-foreground-muted)]">
              {inv.steps[inv.steps.length - 1]?.time} IST
            </span>
          </div>
          <h4 className="mt-2 text-[16px] sm:text-[18px] font-semibold leading-snug text-[color:var(--color-foreground)]">
            {inv.rootCause}
          </h4>
          <p className="mt-1.5 text-[12px] sm:text-[12.5px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
            {inv.rootCauseDetail}
          </p>
        </div>

        {/* Tools summary strip */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-foreground-muted)] font-semibold">
            Sources
          </span>
          <div className="flex -space-x-1.5">
            {allTools.map((name) => {
              const integ = INTEGRATIONS.find((ig) => ig.name === name);
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
                    size={20}
                  />
                </span>
              );
            })}
          </div>
          <span className="text-[10px] font-mono text-[color:var(--color-foreground-muted)] ml-auto">
            {inv.durationLabel}
          </span>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={onCreateTicket}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[color:var(--color-foreground)] text-white text-[13px] font-medium cursor-pointer hover:opacity-90 transition-opacity"
        >
          Create ticket in Linear
          <svg
            width="14"
            height="14"
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
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ACT PANEL — Linear ticket + Slack message
   ══════════════════════════════════════════════════════════════ */
function ActPanel({ issue }: { issue: Issue }) {
  const linear = INTEGRATIONS.find((i) => i.name === "Linear");
  const slack = INTEGRATIONS.find((i) => i.name === "Slack");
  const t = issue.ticket;

  return (
    <div className="rounded-2xl bg-white border border-[color:var(--color-border)] shadow-[0_40px_80px_-30px_rgba(26,26,26,0.14)] overflow-hidden">
      {/* Chrome */}
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

      <div className="p-5 sm:p-7 md:p-8 grid lg:grid-cols-2 gap-5 sm:gap-6">
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
          <div className="p-4 sm:p-5">
            {/* Ticket metadata row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-mono font-semibold text-[color:var(--color-primary)] bg-[color:var(--color-primary-subtle)] px-2 py-0.5 rounded-md border border-[color:var(--color-primary-subtle-border)]">
                {t.id}
              </span>
              <span
                className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full text-white"
                style={{
                  backgroundColor:
                    t.priority === "P0" ? "#DC2626" : "#EA580C",
                }}
              >
                {t.priority}
              </span>
              <span className="text-[10px] font-medium text-[color:var(--color-foreground-secondary)] bg-[color:var(--color-background-secondary)] border border-[color:var(--color-border-light)] px-1.5 py-0.5 rounded-full">
                {t.points} pts
              </span>
              <span className="text-[10px] font-medium text-[color:var(--color-foreground-secondary)] bg-[color:var(--color-background-secondary)] border border-[color:var(--color-border-light)] px-1.5 py-0.5 rounded-full">
                {t.assignee}
              </span>
            </div>

            <h4 className="mt-3 text-[14px] sm:text-[15px] font-semibold leading-snug text-[color:var(--color-foreground)]">
              {t.title}
            </h4>

            {/* Acceptance criteria */}
            <div className="mt-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-foreground-muted)] mb-2">
                Acceptance criteria
              </p>
              <ul className="space-y-1.5">
                {t.acceptance.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2 text-[11.5px] text-[color:var(--color-foreground-secondary)] leading-relaxed"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 mt-0.5 text-[color:var(--color-border)]"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      />
                    </svg>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-[color:var(--color-border-light)] text-[10px] text-[color:var(--color-foreground-muted)]">
              Linked to finding #{issue.id} · Investigation attached
            </div>
          </div>
        </div>

        {/* Slack alert */}
        <div className="rounded-xl border border-[color:var(--color-border)] overflow-hidden flex flex-col">
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
              just now
            </span>
          </div>
          <div className="p-4 sm:p-5 flex-1">
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
                  <span className="text-[12px] font-bold text-[color:var(--color-foreground)]">
                    Squash
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.08em] px-1 py-0.5 rounded bg-[color:var(--color-primary-subtle)] text-[color:var(--color-primary)] border border-[color:var(--color-primary-subtle-border)]">
                    APP
                  </span>
                  <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
                    10:32 AM
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-[color:var(--color-foreground)] leading-relaxed">
                  New finding detected — ticket created and assigned.
                </p>

                {/* Rich attachment block */}
                <div
                  className="mt-2.5 border-l-[3px] pl-3.5 py-0.5"
                  style={{
                    borderColor: SEV[issue.severity].color,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded text-white"
                      style={{
                        backgroundColor: SEV[issue.severity].color,
                      }}
                    >
                      {t.priority} · {SEV[issue.severity].label}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-[color:var(--color-foreground)] leading-snug">
                    {issue.slackSummary}
                  </p>

                  {/* Structured fields */}
                  <div className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-[9px] font-semibold text-[color:var(--color-foreground-muted)] uppercase tracking-wider">
                        Root cause
                      </p>
                      <p className="text-[11px] font-medium text-[color:var(--color-foreground)] mt-0.5 leading-snug">
                        {issue.investigation.rootCause}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-[color:var(--color-foreground-muted)] uppercase tracking-wider">
                        Impact
                      </p>
                      <p className="text-[11px] font-medium text-[color:var(--color-foreground)] mt-0.5">
                        {issue.metric}{" "}
                        <span className="text-[color:var(--color-foreground-muted)] font-normal">
                          {issue.metricLabel}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-[color:var(--color-foreground-muted)] uppercase tracking-wider">
                        Ticket
                      </p>
                      <p className="text-[11px] font-medium text-[color:var(--color-foreground)] mt-0.5">
                        {t.id}{" "}
                        <span className="text-[color:var(--color-foreground-muted)] font-normal">
                          → {t.assignee}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-[10.5px] font-medium border border-[color:var(--color-border)] bg-white text-[color:var(--color-foreground-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                      View investigation
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-[10.5px] font-medium border border-[color:var(--color-border)] bg-white text-[color:var(--color-foreground-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                      Open {t.id}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded text-[10.5px] font-medium border border-[color:var(--color-border)] bg-white text-[color:var(--color-foreground-secondary)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                      Dismiss
                    </span>
                  </div>
                </div>

                {/* Reactions */}
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-background-secondary)] text-[10px] text-[color:var(--color-foreground-secondary)]">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    3
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-[color:var(--color-success-subtle-border,var(--color-border))] bg-[color:var(--color-success-subtle)] text-[10px] text-[color:var(--color-success)]">
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
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    1
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-background-secondary)] text-[10px] text-[color:var(--color-foreground-secondary)]">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    1
                  </span>
                </div>

                {/* Thread indicator */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#5C7AE2] ring-2 ring-white flex items-center justify-center text-[7px] font-semibold text-white">
                      AK
                    </span>
                    <span className="w-5 h-5 rounded-full bg-[#E26D5C] ring-2 ring-white flex items-center justify-center text-[7px] font-semibold text-white">
                      PM
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#1264A3]">
                    2 replies
                  </span>
                  <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
                    Last reply 5 min ago
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coding agent callout */}
          <div className="mx-4 sm:mx-5 mb-4 sm:mb-5 p-3 rounded-lg bg-[color:var(--color-background-tertiary)] border border-dashed border-[color:var(--color-border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[color:var(--color-foreground)] flex items-center justify-center flex-shrink-0">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <p className="text-[11.5px] text-[color:var(--color-foreground-secondary)]">
                Or hand the fix straight to{" "}
                <span
                  className="italic text-[color:var(--color-foreground)] font-medium"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  your coding agent.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
