// ─────────────────────────────────────────────────────────────
// Shared content for the landing page. Marketing iterates here.
// Positioning: autonomous AI product manager that works 24/7
// on the customer's stack — monitors, investigates, suggests fixes.
// ─────────────────────────────────────────────────────────────

export const DEMO_URL = "https://cal.com/heysquash/squash-onboarding";
export const APP_URL = "https://app.heysquash.com";
export const FOUNDER_EMAIL = "rithen@heysquash.com";

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Ask Squash", href: "#ask-squash" },
];

// Integrations Squash plugs into. `slug` matches a Simple Icons brand
// slug when available; falsy means we fall back to a colored letter
// monogram. Grouped by category for the section grid.
export const INTEGRATIONS = [
  // Analytics
  { name: "Mixpanel", category: "Analytics", color: "#7856FF", slug: "mixpanel" },
  { name: "PostHog", category: "Analytics", color: "#1D4AFF", slug: "posthog" },
  { name: "Amplitude", category: "Analytics", color: "#1E61F0", slug: "amplitude" },
  { name: "Heap", category: "Analytics", color: "#7C3AED", slug: "heap" },
  { name: "Google Analytics", category: "Analytics", color: "#E37400", slug: "googleanalytics" },
  // Session replay
  { name: "Hotjar", category: "Session replay", color: "#FD3A5C", slug: "hotjar" },
  { name: "FullStory", category: "Session replay", color: "#FF5A1F", slug: "fullstory" },
  // Experimentation
  { name: "VWO", category: "Experimentation", color: "#EA1973", slug: "vwo" },
  // Observability
  { name: "Dynatrace", category: "Observability", color: "#1496FF", slug: "dynatrace" },
  { name: "SigNoz", category: "Observability", color: "#E75B36", slug: "signoz" },
  { name: "Sentry", category: "Observability", color: "#362D59", slug: "sentry" },
  // Customer feedback
  { name: "Zendesk", category: "Customer feedback", color: "#03363D", slug: "zendesk" },
  { name: "Intercom", category: "Customer feedback", color: "#1F8DED", slug: "intercom" },
  { name: "Granola", category: "Customer feedback", color: "#D97706", slug: "granola" },
  { name: "Salesforce", category: "Customer feedback", color: "#00A1E0", slug: "salesforce" },
  // Issues + code
  { name: "Jira", category: "Issues & code", color: "#0052CC", slug: "jira" },
  { name: "Linear", category: "Issues & code", color: "#5E6AD2", slug: "linear" },
  { name: "GitHub", category: "Issues & code", color: "#181717", slug: "github" },
  // Data
  { name: "BigQuery", category: "Data", color: "#4285F4", slug: "googlebigquery" },
  { name: "PostgreSQL", category: "Data", color: "#336791", slug: "postgresql" },
  { name: "Metabase", category: "Data", color: "#509EE3", slug: "metabase" },
  // Docs
  { name: "Notion", category: "Docs", color: "#191919", slug: "notion" },
  { name: "Confluence", category: "Docs", color: "#0052CC", slug: "confluence" },
  { name: "Google Docs", category: "Docs", color: "#1A73E8", slug: "googledocs" },
  // Comms
  { name: "Slack", category: "Comms", color: "#4A154B", slug: "slack" },
  { name: "Gmail", category: "Comms", color: "#EA4335", slug: "gmail" },
];

// ─────────────────────────────────────────────────────────────
// SOLUTION FLYWHEEL — 3 steps from the pitch deck
// ─────────────────────────────────────────────────────────────
export const SOLUTION_STEPS = [
  {
    step: "01",
    icon: "monitor",
    title: "Monitors & Detects",
    body: "Squash watches every signal in your stack continuously: events, replays, tickets, calls, error logs.",
    bullets: [
      "Anomalies in product metrics & funnel drop-offs",
      "UX friction and bugs from session recordings",
      "Pain points raised by users across feedback channels",
      "Error-log spikes, regressions, user-impacting 5xx errors",
    ],
  },
  {
    step: "02",
    icon: "investigate",
    title: "Investigates Root Cause",
    body: "It doesn't stop at the alert. Squash autonomously queries across your tools to find the real reason something broke.",
    bullets: [
      "Autonomously queries across every connected tool",
      "Cross-references event data, replays, and error logs",
      "Highlights the root cause with evidence you can audit",
    ],
  },
  {
    step: "03",
    icon: "act",
    title: "Suggests a Fix With Action",
    body: "Every insight ships with a clear next step. Already drafted, ready to assign, ready to ship.",
    bullets: [
      "Drafts a ticket for engineering with full context",
      "Triggers a hotfix through your coding agent",
      "Alerts the right team in Slack or Gmail",
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// SCENARIOS — things Squash catches that humans miss
// Replaces the old persona-based USE_CASES section.
// ─────────────────────────────────────────────────────────────
export const SCENARIOS = [
  {
    tag: "Funnel regression",
    title: "A funnel that broke on Tuesday.",
    body: "A 36% drop at the payment step, almost entirely Android 18–24. Squash flagged it Tuesday at 8am, not Friday afternoon.",
    metric: "−36%",
    metricLabel: "payment step · 7d",
    tools: ["Mixpanel", "PostHog", "BigQuery"],
  },
  {
    tag: "Churn signal",
    title: "A churn pattern hiding in feedback.",
    body: "Three enterprise accounts complained about the same SSO bug across Zendesk, Intercom, and a Granola-recorded call. Squash clustered them in one card.",
    metric: "3 accts",
    metricLabel: "₹42L ARR at risk",
    tools: ["Zendesk", "Intercom", "Granola"],
  },
  {
    tag: "Silent regression",
    title: "A 5xx spike nobody saw.",
    body: "Health-check evaluator throwing nulls in prod. Squash correlated it to a Mixpanel funnel drop and opened a Linear issue before oncall paged.",
    metric: "+312%",
    metricLabel: "error rate · 60m",
    tools: ["Dynatrace", "Mixpanel", "Linear"],
  },
];

// ─────────────────────────────────────────────────────────────
// WHY SQUASH WORKS — structural moat, drawn from the memo
// ─────────────────────────────────────────────────────────────
export const WHY_SQUASH = [
  {
    title: "Multi-source by design.",
    body: "Reads across every tool you use, not locked to one. The incumbents can't be neutral. Neutrality would weaken the lock-in their own pricing relies on.",
  },
  {
    title: "Multi-input by design.",
    body: "Combines what users do (events, replays, error logs) with what they say (tickets, calls, surveys). Single-input tools miss the connection between the two.",
  },
  {
    title: "Always on, never asked.",
    body: "Runs continuously in the background. You don't open a dashboard. Insights find you in Slack the moment something matters.",
  },
];

// ─────────────────────────────────────────────────────────────
// FAQ — rewritten for autonomous positioning
// ─────────────────────────────────────────────────────────────
export const FAQS = [
  {
    q: "What does Squash actually do all day?",
    a: "Squash runs continuously in the background, reading every signal across your analytics, session replays, support tickets, customer calls, error logs, and data warehouse. When it detects something that matters (a funnel drop, a recurring complaint, a new error pattern), it investigates across your tools, lands on a root cause, and pushes an insight into Slack or Gmail with a suggested fix already drafted.",
  },
  {
    q: "How is this different from Amplitude, Mixpanel, or PostHog?",
    a: "Those tools own the data they read. Their AI can only see events inside their own product. Squash is neutral by design. It reads across every tool you use and reasons over the combination. A funnel drop in Mixpanel plus rage clicks in PostHog plus a Stripe webhook failure becomes one root-cause card. The incumbents can't build that without breaking the lock-in their pricing depends on.",
  },
  {
    q: "How is this different from session-replay AIs like Lucent or feedback tools like Dovetail?",
    a: "Single-input tools see one slice. Replay AIs see what's on the screen but can't tell you why DAU dropped 8% last week. Feedback tools see what users say but not what they do. Squash combines behavioural data, replays, support, and error logs in one investigation, so the insight ties together signals that would never have met inside any single tool.",
  },
  {
    q: "Won't this just spam our team with alerts?",
    a: "No. Squash measures every insight by impact (revenue, users affected, enterprise accounts at risk) and only pushes the ones above your threshold. You decide what gets to Slack, what gets summarised in a weekly digest, and what stays in-app for review. The goal is one card you'd otherwise have missed, not a noisy alert feed.",
  },
  {
    q: "What tools do you integrate with?",
    a: "Squash plugs into 20+ tools out of the box, including Mixpanel, PostHog, Amplitude, Heap, Hotjar, FullStory, Sentry, SigNoz, Zendesk, Intercom, Salesforce, Granola, Jira, Linear, GitHub, BigQuery, PostgreSQL, Metabase, Notion, Confluence, Slack, and Gmail. We ship new integrations on customer demand, and custom connectors are available on request.",
  },
  {
    q: "How does setup work? How long to first insight?",
    a: "OAuth into your tools (analytics, replay, tickets, warehouse, docs). Most teams see Squash's first investigation within 48 hours of connection. Full coverage across the stack typically takes a week, and pilots include white-glove onboarding from the founders.",
  },
  {
    q: "Is my data secure? Do you train on our data?",
    a: "Your data stays in your workspace. We do not train models on customer data. All integrations use least-privilege OAuth scopes with read-only access by default. Write access (creating Linear issues, posting to Slack) is opt-in per tool.",
  },
  {
    q: "What does pricing look like?",
    a: "Squash is priced as enterprise infrastructure, with tiered platform fees that scale with the data processed and the size of the product team. Pricing starts at $18K/year and scales to custom enterprise contracts. Book a demo and we'll quote based on your stack.",
  },
];
