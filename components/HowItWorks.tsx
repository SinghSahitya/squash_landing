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
    description: string;
    labels: string[];
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
    id: "sq-003",
    title: "Size chart mismatch driving 3.4× return rate on apparel",
    severity: "critical",
    type: "recurring_tickets",
    typeLabel: "Recurring Tickets",
    metric: "3.4×",
    metricLabel: "return spike",
    usersAffected: "45,200",
    timeAgo: "2h ago",
    description:
      "\"Wrong size\" return requests jumped 3.4× in 10 days across the apparel category. Sentinel clusters 1,840 return tickets and cross-references with product catalog data, revealing the issue is isolated to 3 new vendors onboarded in April whose size charts use EU sizing but are displayed with IN/US labels. Customers ordering \"M\" receive what is effectively an \"XS\" in Indian sizing. The catalog ingestion pipeline auto-mapped EU sizes to IN labels without conversion, and the QC team didn't catch it because the vendor spreadsheet headers said \"Size\" without specifying the standard.",
    investigation: {
      steps: [
        {
          title: 'Clustered 1,840 "wrong size" return tickets from 10 days',
          tools: ["Zendesk"],
          time: "10:05",
          stepType: "scan",
          body: "Scanned 10 days of return requests. 1,840 \"wrong size\" mentions clustered around 3 specific vendor SKUs onboarded in April.",
        },
        {
          title: "Return rate 3.4× higher on 3 new vendor SKUs vs baseline",
          tools: ["Mixpanel", "BigQuery"],
          time: "10:14",
          stepType: "data",
          body: "Cross-referenced return data with vendor catalog. 92% of size-related returns trace to vendors using EU sizing mapped incorrectly to IN labels.",
        },
        {
          title: "EU sizes auto-mapped to IN labels without conversion",
          tools: ["BigQuery"],
          time: "10:22",
          stepType: "check",
          body: "Catalog ingestion pipeline auto-assigned size labels from vendor spreadsheet. EU 38/40/42 mapped directly to S/M/L without conversion factor.",
        },
        {
          title: "Session replays show users selecting expected sizes confidently",
          tools: ["PostHog"],
          time: "10:30",
          stepType: "replay",
          body: "Users select sizes based on displayed IN chart, add to cart without hesitation. They trust the size guide. Issue only surfaces post-delivery.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 25 min",
      rootCause: "EU vendor sizes auto-mapped to IN labels without conversion",
      rootCauseDetail:
        "Catalog ingestion pipeline mapped EU 38/40/42 directly to S/M/L Indian sizes. 3 vendors affected, ₹18L in reverse logistics costs in 10 days.",
    },
    ticket: {
      id: "SQ-503",
      title: "Fix size mapping for EU vendors and add conversion validation",
      priority: "P1",
      points: "5",
      assignee: "@priya",
      description:
        "Catalog ingestion auto-mapped EU 38/40/42 directly to S/M/L without conversion. 3 vendors affected, 1,840 returns in 10 days at ₹18L reverse logistics cost. Fix existing mappings and add validation to prevent recurrence on future vendor onboarding.",
      labels: ["catalog", "vendor-onboarding", "returns"],
      acceptance: [
        "Correct size labels for all affected vendor SKUs (EU → IN conversion)",
        "Add size-standard field to vendor onboarding form (mandatory)",
        "Catalog ingestion validates size standard before label mapping",
        "Proactive email to 12,600 affected customers with exchange offer",
      ],
    },
    slackSummary:
      "Size-related returns jumped 3.4× in 10 days. EU vendor sizes auto-mapped to IN labels. 1,840 returns, ₹18L reverse logistics cost.",
  },
  {
    id: "sq-004",
    title: "Search ranking showing out-of-stock products above available ones",
    severity: "critical",
    type: "ui_ux",
    typeLabel: "UX Issue",
    metric: "+38%",
    metricLabel: "search bounce",
    usersAffected: "34,500",
    timeAgo: "3h ago",
    description:
      "Product search results are displaying out-of-stock and discontinued items in the top 5 positions, especially during off-peak inventory hours. Users click through to product pages only to see \"Out of Stock\", creating a 38% bounce-back rate from PDPs accessed via search. The search ranking algorithm uses historical purchase velocity and relevance scoring but doesn't incorporate real-time inventory status. High-selling products retain their top-rank from peak availability periods even after selling out, and the \"Out of Stock\" state only appears on the PDP, not in search result cards.",
    investigation: {
      steps: [
        {
          title: "38% bounce-back rate from PDPs accessed via search",
          tools: ["Mixpanel"],
          time: "14:02",
          stepType: "data",
          body: "PDP bounce rate for search-referred traffic is 38% vs 12% for category-browsed traffic. A 26-point gap driven by stock unavailability.",
        },
        {
          title: "Out-of-stock products occupying top 5 search positions",
          tools: ["PostHog"],
          time: "14:10",
          stepType: "replay",
          body: "Session replays show users clicking top results, seeing \"Out of Stock\", returning to search, and repeating 2-3 times before finding available products.",
        },
        {
          title: "Search index doesn't factor real-time inventory status",
          tools: ["BigQuery"],
          time: "14:18",
          stepType: "check",
          body: "Search ranking uses purchase velocity (30-day) and text relevance. Inventory status weight: 0%. Index refreshes every 6 hours, not on stock changes.",
        },
        {
          title: "Users perform 2.3 extra searches per session on average",
          tools: ["Mixpanel"],
          time: "14:24",
          stepType: "scan",
          body: "Affected sessions show 2.3 extra searches before order placement. Time-to-order increases by 45 seconds, reducing conversion by 8%.",
        },
      ],
      durationLabel: "4 checks · 3 tools · 22 min",
      rootCause: "Search ranking ignores real-time inventory availability",
      rootCauseDetail:
        "Search index uses 30-day purchase velocity without factoring live stock status. Out-of-stock items retain high rank for up to 6 hours after selling out.",
    },
    ticket: {
      id: "SQ-504",
      title: "Add real-time inventory signal to search ranking algorithm",
      priority: "P1",
      points: "5",
      assignee: "@ritu",
      description:
        "Search ranking uses 30-day purchase velocity but ignores live inventory status. Out-of-stock products retain top positions for up to 6 hours after selling out, causing 38% bounce-back and 2.3 extra searches per affected session. Add inventory as a ranking signal with near-real-time refresh.",
      labels: ["search", "inventory", "discovery"],
      acceptance: [
        "Out-of-stock products deprioritized below all in-stock results",
        "Search index refreshes inventory status within 60 seconds of stock change",
        'Show "Out of Stock" badge directly in search result cards',
        'Add "Show only in-stock" filter toggle (default: on)',
      ],
    },
    slackSummary:
      "Search showing out-of-stock products in top results. 38% bounce-back rate, 2.3 extra searches per session. 34,500 users affected weekly.",
  },
  {
    id: "sq-005",
    title: "Coupon auto-apply overwriting higher-value manual promo codes",
    severity: "high",
    type: "recurring_tickets",
    typeLabel: "Recurring Tickets",
    metric: "2,340",
    metricLabel: "complaints",
    usersAffected: "28,400",
    timeAgo: "5h ago",
    description:
      "The auto-apply coupon feature (launched 2 weeks ago) is silently replacing manually-entered promo codes with lower-value auto coupons at checkout. Users enter a ₹150-off referral code from an influencer campaign, but when they navigate to the payment page, the system replaces it with a ₹50-off \"SAVE50\" auto-applied coupon. The auto-apply hook fires on checkout navigation and overwrites any existing coupon without comparing discount values. 2,340 support tickets in 2 weeks, and 31% of affected users have stopped entering coupon codes entirely.",
    investigation: {
      steps: [
        {
          title: '2,340 "coupon removed" tickets clustered from 2 weeks',
          tools: ["Zendesk"],
          time: "12:05",
          stepType: "scan",
          body: "Clustered 2,340 support tickets. Common pattern: manually entered promo codes being silently overridden at checkout without user consent.",
        },
        {
          title: "Auto-apply replaces ₹150 manual code with ₹50 auto code",
          tools: ["Mixpanel"],
          time: "12:14",
          stepType: "data",
          body: "Tracked coupon application events: auto-apply fires on checkout navigation and replaces existing ₹150 referral codes with a ₹50 SAVE50 auto-coupon.",
        },
        {
          title: "31% of affected users stopped using coupons entirely",
          tools: ["BigQuery"],
          time: "12:22",
          stepType: "check",
          body: "Cohort analysis: 31% of affected users stopped entering coupon codes in subsequent sessions. Total coupon value lost by users: ₹7.5L.",
        },
        {
          title: "Auto-apply hook runs without discount-value comparison",
          tools: ["PostHog"],
          time: "12:28",
          stepType: "replay",
          body: "Code path confirms: auto-apply fires after page navigation with no discount-value comparison logic. It blindly applies the first eligible auto-coupon.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 23 min",
      rootCause: "Auto-apply overwrites coupons without value comparison",
      rootCauseDetail:
        "Auto-apply fires on checkout navigation and replaces any existing coupon without comparing discount values. No safeguard against downgrading user discounts.",
    },
    ticket: {
      id: "SQ-505",
      title: "Never replace manual coupon with lower-value auto coupon",
      priority: "P1",
      points: "2",
      assignee: "@sanya",
      description:
        "Auto-apply coupon hook fires on checkout navigation and blindly replaces any existing coupon without value comparison. Users' ₹150 referral codes are being overwritten by ₹50 auto-coupons. 31% of affected users stopped using coupons entirely. Fix the logic and restore user trust.",
      labels: ["checkout", "coupons", "trust"],
      acceptance: [
        "Auto-apply skipped when existing manual coupon offers equal or better discount",
        "Show comparison UI when auto coupon is better: \"We found a better deal!\"",
        "Add user toggle to disable auto-apply in account settings",
        "Audit and refund ₹7.5L in lost discount value to affected users",
      ],
    },
    slackSummary:
      "Auto-apply replacing ₹150 manual codes with ₹50 auto codes. 2,340 complaints, 31% stopped using coupons. ₹7.5L in lost user discounts.",
  },
  {
    id: "sq-006",
    title: "Delivery ETA overestimation driving order cancellations in metros",
    severity: "high",
    type: "ui_ux",
    typeLabel: "UX Issue",
    metric: "+34%",
    metricLabel: "cancellation rate",
    usersAffected: "18,600",
    timeAgo: "6h ago",
    description:
      "Post-order cancellation rate increased 34% in Mumbai and Delhi after an ETA model update added a 12-minute buffer for \"traffic uncertainty.\" The actual delivery times improved by 3 minutes on average, but the displayed ETAs increased by 12 minutes, making users cancel orders and switch to competitors showing lower ETAs. 68% of cancellation reasons cite \"delivery time too long.\" The model optimized for reducing \"late delivery\" complaints but created a worse problem: users who would have happily waited 25 minutes are now cancelling because they're told it will take 40 minutes.",
    investigation: {
      steps: [
        {
          title: "Order cancellation rate up 34% in Mumbai and Delhi",
          tools: ["Mixpanel"],
          time: "15:00",
          stepType: "data",
          body: "Cancellation rate in Mumbai/Delhi went from 4.2% to 5.6%, a 34% increase. 68% of cancellation reasons cite \"delivery time too long.\"",
        },
        {
          title: "ETA model v3.8 added 12-minute safety buffer on April 25",
          tools: ["GitHub", "BigQuery"],
          time: "15:08",
          stepType: "scan",
          body: "Model update added worst-case traffic buffer. Shown ETAs increased by 12 min while actual delivery improved by 3 min, creating a 15-min perception gap.",
        },
        {
          title: "Actual delivery: 25 min avg vs shown ETA: 40 min avg",
          tools: ["BigQuery"],
          time: "15:16",
          stepType: "check",
          body: "Post-update data: actual delivery averages 25 min, shown ETA averages 40 min. Users anchored to the high number cancel before delivery can prove itself.",
        },
        {
          title: "Cancellations peak within 2 min of order placement",
          tools: ["PostHog"],
          time: "15:22",
          stepType: "replay",
          body: "78% of cancellations happen within 2 minutes of placing the order, immediately after seeing the inflated ETA. Users reorder from competitors.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 22 min",
      rootCause: "ETA model over-buffers, inflating shown delivery times",
      rootCauseDetail:
        "ETA model v3.8 added a 12-min worst-case buffer. Actual delivery is 25 min but shown ETA says 40 min. Users cancel immediately after seeing the number.",
    },
    ticket: {
      id: "SQ-506",
      title: "Reduce ETA buffer and show delivery time as a range",
      priority: "P1",
      points: "3",
      assignee: "@arjun",
      description:
        "ETA model v3.8 added a 12-min worst-case buffer that inflates shown delivery times. Users see \"40 min\" but actual delivery is 25 min, so they cancel immediately and reorder from competitors. Each cancellation costs ₹120 in wasted prep + idle rider time. Reduce buffer and show range.",
      labels: ["delivery", "eta-model", "cancellations"],
      acceptance: [
        "Reduce safety buffer from 12 min to 5 min (acceptable late rate: <8%)",
        "Show ETA as range (\"25-35 min\") instead of single worst-case number",
        'Add "Usually arrives earlier" badge for routes with >90% on-time history',
        "Monitor cancellation rate daily for 1 week post-change",
      ],
    },
    slackSummary:
      "Cancellations up 34% in metros after ETA model added 12-min buffer. Shown: 40 min, actual: 25 min. Each cancelled order costs ₹120.",
  },
  {
    id: "sq-001",
    title: "Cart abandonment spike after payment gateway timeout increase",
    severity: "high",
    type: "anomaly",
    typeLabel: "Analytics Anomaly",
    metric: "−12%",
    metricLabel: "cart-to-order",
    usersAffected: "12,800",
    timeAgo: "8h ago",
    description:
      "Cart-to-order conversion dropped 12% after Razorpay silently doubled their server-side timeout from 15s to 30s. Users now stare at a spinner for twice as long on failed payments before seeing an error. The retry rate after timeout collapsed from 52% to 28% because users assume the app has frozen and close the tab instead of waiting. Dinner-time orders (7-10 PM) are hit hardest due to payment gateway congestion.",
    investigation: {
      steps: [
        {
          title: "Cart-to-order conversion dropped 12% week-over-week",
          tools: ["Mixpanel"],
          time: "11:00",
          stepType: "data",
          body: "Week-over-week conversion dropped 12%. Dinner-time orders (7-10 PM) hit hardest due to payment gateway congestion.",
        },
        {
          title: "Razorpay doubled server-side timeout from 15s to 30s",
          tools: ["Sentry", "BigQuery"],
          time: "11:08",
          stepType: "scan",
          body: "Razorpay config change on April 22 increased timeout from 15s to 30s. Frontend matches this with no progress indicator or fallback UX.",
        },
        {
          title: "Retry rate collapsed from 52% to 28% post-change",
          tools: ["PostHog"],
          time: "11:16",
          stepType: "data",
          body: "Session replays confirm: users wait 2x longer, then close the tab. Retry rate fell from 52% to 28%. Most assume the app is frozen.",
        },
        {
          title: '892 "payment stuck" tickets in 1 week',
          tools: ["Zendesk"],
          time: "11:22",
          stepType: "scan",
          body: "892 support tickets describing a spinning loader with no progress indication or retry option. ₹3.8Cr/week GMV at risk.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 22 min",
      rootCause: "Payment gateway timeout doubled without UX adaptation",
      rootCauseDetail:
        "Razorpay increased server-side timeout from 15s to 30s. Users now wait 2× longer on failures with no progress indicator, causing 72% to close the tab.",
    },
    ticket: {
      id: "SQ-501",
      title: "Add client-side UX timeout at 15s with progress indicator",
      priority: "P0",
      points: "3",
      assignee: "@dev",
      description:
        "Razorpay doubled their timeout to 30s but our frontend blindly matches it with no progress feedback. Users wait 2× longer on failed payments and assume the app is frozen. Add a client-side UX timeout at 15s that shows a progress state and retry option.",
      labels: ["checkout", "payment", "ux-critical"],
      acceptance: [
        'Show "Taking longer than usual" message at 15s with animated progress',
        "Visual progress polling for payment status every 3 seconds",
        "Optimistic confirmation for repeat customers with good payment history",
        "Add payment-failure retry CTA visible immediately after failure detected",
      ],
    },
    slackSummary:
      "Cart-to-order dropped 12% after Razorpay doubled timeout to 30s. Retry rate fell from 52% to 28%. ₹3.8Cr/week GMV at risk.",
  },
  {
    id: "sq-002",
    title: "Product listing conversion drop masked by flash sale traffic",
    severity: "medium",
    type: "anomaly",
    typeLabel: "Analytics Anomaly",
    metric: "−22%",
    metricLabel: "PLP-to-PDP rate",
    usersAffected: "8,900",
    timeAgo: "10h ago",
    description:
      "Product listing page (PLP) to product detail page (PDP) click-through rate silently dropped 22% after a front-end deploy changed the product card layout. Nobody caught it because a simultaneous flash sale drove 40% more category page traffic, keeping absolute PDP visits flat. The deploy removed product ratings from card thumbnails and replaced the \"Add to Cart\" quick-action with a smaller icon button. Both changes reduced engagement on mobile where 74% of browse sessions originate.",
    investigation: {
      steps: [
        {
          title: "PLP-to-PDP rate decoupled from traffic volume after deploy",
          tools: ["Mixpanel"],
          time: "09:12",
          stepType: "data",
          body: "Click-through rate dropped 22% while absolute PDP visits stayed flat. Flash sale volume increase masked the per-session engagement decline.",
        },
        {
          title: "Deploy v4.8.1 removed ratings + resized quick-add button",
          tools: ["GitHub"],
          time: "09:20",
          stepType: "scan",
          body: "Front-end deploy on May 12 removed star ratings from product cards and shrank the Add to Cart button to a 24px icon on mobile viewports.",
        },
        {
          title: "Mobile engagement dropped 31% vs desktop 8%",
          tools: ["PostHog"],
          time: "09:28",
          stepType: "replay",
          body: "Session replays show mobile users scrolling past products without tapping. Heatmaps confirm the new icon button gets 68% fewer taps than the old text button.",
        },
        {
          title: "Flash sale inflated absolute numbers, hiding the rate drop",
          tools: ["BigQuery"],
          time: "09:34",
          stepType: "check",
          body: "Flash sale drove 40% more traffic to PLPs, keeping absolute PDP visits within normal range and hiding the engagement decline from dashboards.",
        },
      ],
      durationLabel: "4 checks · 4 tools · 22 min",
      rootCause: "Product card redesign removed trust signals on mobile",
      rootCauseDetail:
        "Deploy v4.8.1 removed star ratings from product cards and shrank the Add to Cart button to a 24px icon. 74% of traffic is mobile, and flash sale masked the impact.",
    },
    ticket: {
      id: "SQ-502",
      title: "Restore star ratings and text CTA on mobile product cards",
      priority: "P0",
      points: "3",
      assignee: "@akhil",
      description:
        "Deploy v4.8.1 removed star ratings from product cards and shrank Add to Cart to a 24px icon. Mobile engagement dropped 31% but flash sale traffic masked it. Restore trust signals and proper tap targets on mobile viewports.",
      labels: ["mobile", "plp", "deploy-regression"],
      acceptance: [
        "Star ratings visible on product cards for viewports < 768px",
        'Restore "Add to Cart" as text button (min tap target 44px)',
        "A/B test icon-only variant for desktop separately",
        "Add PLP-to-PDP rate alert normalized for traffic volume changes",
      ],
    },
    slackSummary:
      "PLP-to-PDP rate dropped 22% after v4.8.1 removed ratings from product cards. Flash sale masked it. 68,400 users affected.",
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
            across every tool and hands your team a fix, not just an alert.
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

            {/* Description */}
            <p className="mt-2.5 text-[11.5px] sm:text-[12px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
              {t.description}
            </p>

            {/* Labels */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.labels.map((label) => (
                <span
                  key={label}
                  className="text-[9.5px] font-medium px-2 py-0.5 rounded-full bg-[color:var(--color-background-secondary)] border border-[color:var(--color-border-light)] text-[color:var(--color-foreground-secondary)]"
                >
                  {label}
                </span>
              ))}
            </div>

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

            <div className="mt-4 pt-3 border-t border-[color:var(--color-border-light)] flex items-center justify-between">
              <span className="text-[10px] text-[color:var(--color-foreground-muted)]">
                Linked to finding #{issue.id} · Investigation attached
              </span>
              <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-[color:var(--color-background-secondary)] border border-[color:var(--color-border-light)] text-[color:var(--color-foreground-muted)]">
                Sprint 24
              </span>
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
                  New finding detected. Ticket created and assigned.
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
