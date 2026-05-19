export type UseCase = {
  id: string;
  tabLabel: string;
  sessionPath: string;
  prompt: string;
  analyzingLabel: string;
  steps: string[];
  toolCalls: ToolCall[];
  summaryText: string;
  metrics: { label: string; value: string; delta: string; down: boolean }[];
  chart: ChartSpec;
  output: {
    toolName: string;
    toolColor: string;
    toolSlug?: string | null;
    kindLabel: string;
    badge: string;
    title: string;
    subtitle: string;
  };
  blurb: string;
};

export type ToolCall = {
  integration: string;
  integrationColor: string;
  integrationSlug?: string | null;
  title: string;
  request: string;
  response: string;
};

export type ChartSpec =
  | {
      kind: "line-up" | "line-down";
      title: string;
      source: string;
      linePath: string;
      points: { x: string; y: string }[];
      yAxis: { unit: string };
    }
  | {
      kind: "bars";
      title: string;
      source: string;
      bars: { label: string; value: number }[];
      yAxis: { unit: string };
    };

export const USE_CASES: UseCase[] = [
  {
    id: "checkout",
    tabLabel: "Root Cause Analysis",
    sessionPath: "squash.ai / checkout-analysis",
    blurb:
      "When a metric moves, Squash pulls the funnel data, reads the tickets, watches the sessions, and files the ticket. In one pass.",
    prompt:
      "Why is checkout conversion down on Android this week? Can you figure out what's going on and draft a Jira for the fix?",
    analyzingLabel: "Analyzing checkout funnel…",
    steps: [
      "Querying BigQuery · checkout_events",
      "Clustering 412 Zendesk tickets",
      "Scanning 38 session recordings for rage clicks",
      "Drafting Jira ticket SQ-519",
    ],
    toolCalls: [
      {
        integration: "BigQuery",
        integrationColor: "#4285F4",
        integrationSlug: "googlebigquery",
        title: "Querying BigQuery · checkout_events",
        request:
          "SELECT\n  platform, date, COUNT(*) AS starts,\n  COUNTIF(step='paid') AS paid\nFROM squash.checkout_events\nWHERE date >= CURRENT_DATE() - 14\nGROUP BY platform, date\nORDER BY date DESC",
        response:
          '{\n  "rows_scanned": 1284301,\n  "android_cvr_7d": 0.021,\n  "ios_cvr_7d": 0.048,\n  "web_cvr_7d": 0.044,\n  "regression_started": "2026-04-16",\n  "android_build": "4.2.1"\n}',
      },
      {
        integration: "Zendesk",
        integrationColor: "#03363D",
        integrationSlug: "zendesk",
        title: "Clustering 412 Zendesk tickets",
        request:
          '{\n  "filter": "tag:checkout AND platform:android",\n  "since": "7d",\n  "embed": true,\n  "cluster": "hdbscan"\n}',
        response:
          '{\n  "clusters": [\n    { "theme": "Pay button unresponsive",   "count": 241 },\n    { "theme": "App crash on tap",           "count": 118 },\n    { "theme": "Card declined loop",          "count": 53 }\n  ],\n  "top_model": "Pixel 8, Android 14",\n  "sentiment": -0.71\n}',
      },
      {
        integration: "PostHog",
        integrationColor: "#F9BD2B",
        integrationSlug: "posthog",
        title: "Scanning 38 session recordings for rage clicks",
        request:
          '{\n  "event": "rage_click",\n  "selector": "#pay-button",\n  "platform": "android",\n  "os_version": "14",\n  "since": "7d"\n}',
        response:
          '{\n  "sessions": 38,\n  "avg_clicks_before_exit": 3.4,\n  "exited_without_retry": 0.62,\n  "crash_signature": "NullPointerException at PayFragment.onConfirm()"\n}',
      },
      {
        integration: "Jira",
        integrationColor: "#0052CC",
        integrationSlug: "jira",
        title: "Drafting Jira ticket SQ-519",
        request:
          '{\n  "project": "SQ",\n  "priority": "P1",\n  "assignee": "@mobile-platform",\n  "links": { "tickets": 412, "sessions": 38 }\n}',
        response:
          '{\n  "key": "SQ-519",\n  "status": "Ready for triage",\n  "url": "https://jira.squash.ai/browse/SQ-519"\n}',
      },
    ],
    summaryText:
      "Android checkout conversion dropped to 2.1% (↓0.9 pts) this week. Root cause: payment-step crash on Android 14 after the 4.2.1 release. 38% of affected users rage-clicked the Pay button 3+ times before exiting.",
    metrics: [
      { label: "Android CVR", value: "2.1%", delta: "−0.9 pts", down: true },
      { label: "Rage clicks", value: "38%", delta: "+24 pts", down: true },
      { label: "Tickets", value: "412", delta: "3× normal", down: true },
    ],
    chart: {
      kind: "line-down",
      title: "Daily conversion · last 14 days",
      source: "BigQuery",
      linePath:
        "M0,20 L29,15 L57,25 L86,10 L114,22 L143,30 L171,28 L200,38 L229,35 L257,48 L286,55 L314,45 L343,60 L371,50 L400,62",
      yAxis: { unit: "%" },
      points: [
        { x: "Apr 9", y: "3.0" },
        { x: "Apr 10", y: "3.1" },
        { x: "Apr 11", y: "2.9" },
        { x: "Apr 12", y: "3.2" },
        { x: "Apr 13", y: "2.9" },
        { x: "Apr 14", y: "2.7" },
        { x: "Apr 15", y: "2.8" },
        { x: "Apr 16", y: "2.5" },
        { x: "Apr 17", y: "2.6" },
        { x: "Apr 18", y: "2.3" },
        { x: "Apr 19", y: "2.2" },
        { x: "Apr 20", y: "2.4" },
        { x: "Apr 21", y: "2.1" },
        { x: "Apr 22", y: "2.2" },
        { x: "Apr 23", y: "2.1" },
      ],
    },
    output: {
      toolName: "Jira",
      toolColor: "#0052CC",
      toolSlug: "jira",
      kindLabel: "Draft",
      badge: "Ready",
      title: "[P1] Android 14 payment-step crash after 4.2.1 release",
      subtitle: "SQ-519 · Squash Web · Linked: 412 tickets · 38 sessions",
    },
  },
  {
    id: "requests",
    tabLabel: "Feature requests",
    sessionPath: "squash.ai / feature-requests-q2",
    blurb:
      "Squash clusters every request, weights by what your biggest accounts are actually asking for, and queues the top themes in your backlog.",
    prompt:
      "Go through this quarter's feature requests and group them. I care more about the ones coming from our bigger accounts. Turn the top 3 into Linear tickets.",
    analyzingLabel: "Clustering requests by theme…",
    steps: [
      "Pulling 847 feature requests from Intercom",
      "Clustering by theme with embeddings",
      "Weighting by account ARR from Salesforce",
      "Drafting 3 Linear tickets",
    ],
    toolCalls: [
      {
        integration: "Intercom",
        integrationColor: "#286EFA",
        integrationSlug: "intercom",
        title: "Pulling 847 feature requests from Intercom",
        request:
          '{\n  "filter": "tag:feature-request",\n  "since": "2026-01-01",\n  "include": ["conversation", "account_id"]\n}',
        response:
          '{\n  "total": 847,\n  "distinct_accounts": 312,\n  "date_range": "2026-01-01 → 2026-04-22"\n}',
      },
      {
        integration: "OpenAI",
        integrationColor: "#10A37F",
        integrationSlug: "openai",
        title: "Clustering by theme with embeddings",
        request:
          '{\n  "model": "text-embedding-3-large",\n  "algorithm": "hdbscan",\n  "min_cluster_size": 8\n}',
        response:
          '{\n  "clusters": 14,\n  "noise_pct": 0.06,\n  "silhouette": 0.61,\n  "top_themes": ["Bulk CSV export", "SSO / SAML", "Audit logs", "Webhooks", "Custom fields"]\n}',
      },
      {
        integration: "Salesforce",
        integrationColor: "#00A1E0",
        integrationSlug: "salesforce",
        title: "Weighting by account ARR from Salesforce",
        request:
          "SELECT Id, Account.ARR, Account.Tier\nFROM Account\nWHERE Id IN :cluster_account_ids",
        response:
          '{\n  "enterprise_accounts": 128,\n  "weighted_top_3": [\n    { "theme": "Bulk CSV export", "arr_weighted": 0.28 },\n    { "theme": "SSO / SAML",     "arr_weighted": 0.22 },\n    { "theme": "Audit logs",      "arr_weighted": 0.18 }\n  ]\n}',
      },
      {
        integration: "Linear",
        integrationColor: "#5E6AD2",
        integrationSlug: "linear",
        title: "Drafting 3 Linear tickets",
        request:
          '{\n  "team": "ENG",\n  "tickets": [\n    { "title": "Bulk CSV export",     "priority": 1 },\n    { "title": "SSO / SAML",          "priority": 1 },\n    { "title": "Audit logs",          "priority": 2 }\n  ]\n}',
        response:
          '{\n  "created": ["ENG-482", "ENG-483", "ENG-484"],\n  "cycle": "Cycle 14",\n  "state": "Triage"\n}',
      },
    ],
    summaryText:
      "847 requests across 14 themes. Enterprise accounts ($50k+ ARR) over-index 2.4× on three themes: bulk CSV export, SSO/SAML, and audit logs. Top three account for 61% of ARR-weighted mentions, all queued as Linear tickets with account context.",
    metrics: [
      { label: "Requests", value: "847", delta: "14 themes", down: false },
      { label: "Enterprise share", value: "41%", delta: "+12 pts", down: false },
      { label: "ARR tied", value: "$2.1M", delta: "top 3 themes", down: false },
    ],
    chart: {
      kind: "bars",
      title: "Top themes · ARR-weighted mentions",
      source: "Intercom + Salesforce",
      yAxis: { unit: "" },
      bars: [
        { label: "Bulk CSV export", value: 82 },
        { label: "SSO / SAML", value: 64 },
        { label: "Audit logs", value: 51 },
      ],
    },
    output: {
      toolName: "Linear",
      toolColor: "#5E6AD2",
      toolSlug: "linear",
      kindLabel: "3 drafted",
      badge: "Ready",
      title: "Top 3 enterprise themes drafted as Linear tickets",
      subtitle: "ENG-482 Bulk CSV export · ENG-483 SSO · ENG-484 Audit logs",
    },
  },
  {
    id: "churn",
    tabLabel: "Churn signals",
    sessionPath: "squash.ai / churn-march",
    blurb:
      "Squash cross-references CRM churn, product telemetry, and CS notes to surface the leading indicators, two weeks before the contract gets cancelled.",
    prompt:
      "We lost 23 accounts last month. Dig into what they were doing before they left and tell me if there's a pattern. Put it in a Notion doc we can share with CS.",
    analyzingLabel: "Scanning pre-churn activity…",
    steps: [
      "Pulling 23 churned accounts from Salesforce",
      "Scanning 90-day activity in Mixpanel",
      "Parsing CS tickets and call notes",
      "Drafting Notion page for CS team",
    ],
    toolCalls: [
      {
        integration: "Salesforce",
        integrationColor: "#00A1E0",
        integrationSlug: "salesforce",
        title: "Pulling 23 churned accounts from Salesforce",
        request:
          "SELECT Id, Name, ARR, ChurnedDate, Plan\nFROM Account\nWHERE Status = 'Churned'\n  AND ChurnedDate >= 2026-03-01\n  AND ChurnedDate <= 2026-03-31",
        response:
          '{\n  "count": 23,\n  "total_arr_lost": 412000,\n  "median_tenure_days": 287,\n  "plans": { "Growth": 15, "Team": 6, "Starter": 2 }\n}',
      },
      {
        integration: "Mixpanel",
        integrationColor: "#7856FF",
        integrationSlug: "mixpanel",
        title: "Scanning 90-day activity in Mixpanel",
        request:
          '{\n  "accounts": "churned_march",\n  "window": "90d",\n  "events": ["login", "dashboard_view", "export", "share"]\n}',
        response:
          '{\n  "silent_streak_3plus_days": 18,\n  "median_last_login": "day -14",\n  "failed_exports_50mb_plus": 41,\n  "dashboards_shared": 0\n}',
      },
      {
        integration: "Zendesk",
        integrationColor: "#03363D",
        integrationSlug: "zendesk",
        title: "Parsing CS tickets and call notes",
        request:
          '{\n  "accounts": "churned_march",\n  "kinds": ["ticket", "call_note"],\n  "since": "90d"\n}',
        response:
          '{\n  "total_touchpoints": 19,\n  "escalations_pre_churn": 4,\n  "top_friction": ["export_size_limit", "no_sso", "slow_dashboards"]\n}',
      },
      {
        integration: "Notion",
        integrationColor: "#111111",
        integrationSlug: "notion",
        title: "Drafting Notion page for CS team",
        request:
          '{\n  "database": "CS · Churn Teardowns",\n  "title": "March 2026 · Teardown",\n  "share_with": ["cs", "product"]\n}',
        response:
          '{\n  "page_id": "teardown-march-2026",\n  "url": "notion.so/squash/march-churn",\n  "blocks": 42,\n  "linked_sessions": 12\n}',
      },
    ],
    summaryText:
      "18 of 23 (78%) went dark for 3+ days within their final 30. Shared friction: failed CSV exports over 50MB and zero dashboard shares. Only 4 escalated to CS before leaving. The signal was in product telemetry two weeks earlier.",
    metrics: [
      { label: "Churned", value: "23", delta: "$412k ARR", down: true },
      { label: "Silent pre-churn", value: "78%", delta: "3+ days idle", down: true },
      { label: "CS-escalated", value: "17%", delta: "vs 54% avg", down: true },
    ],
    chart: {
      kind: "line-down",
      title: "Activity · median churned account · final 30 days",
      source: "Mixpanel",
      yAxis: { unit: " events" },
      linePath:
        "M0,18 L25,22 L50,16 L75,24 L100,20 L125,18 L150,22 L175,26 L200,30 L225,36 L250,44 L275,54 L300,62 L325,68 L350,71 L375,72 L400,73",
      points: [
        { x: "−30d", y: "14" },
        { x: "−28d", y: "12" },
        { x: "−26d", y: "15" },
        { x: "−24d", y: "11" },
        { x: "−22d", y: "13" },
        { x: "−20d", y: "14" },
        { x: "−18d", y: "12" },
        { x: "−16d", y: "10" },
        { x: "−14d", y: "8" },
        { x: "−12d", y: "5" },
        { x: "−10d", y: "3" },
        { x: "−8d", y: "2" },
        { x: "−6d", y: "1" },
        { x: "−4d", y: "1" },
        { x: "−2d", y: "0" },
        { x: "−1d", y: "0" },
        { x: "day of", y: "0" },
      ],
    },
    output: {
      toolName: "Notion",
      toolColor: "#111111",
      toolSlug: "notion",
      kindLabel: "Page",
      badge: "Shared",
      title: "March churn teardown · 78% silent pre-churn pattern",
      subtitle: "CS · Product · 4 screenshots · 3 save-play templates",
    },
  },
  {
    id: "retro",
    tabLabel: "Feature retro",
    sessionPath: "squash.ai / ai-suggestions-retro",
    blurb:
      "Squash runs the adoption and retention analysis, compares against a matched control, and writes the retro, so you can decide whether to double down.",
    prompt:
      "AI suggestions has been live for 3 weeks. Is it actually working? Who's using it, who's sticking around because of it, and what's getting in the way? Write it up as a retro in a google doc.",
    analyzingLabel: "Evaluating feature impact…",
    steps: [
      "Querying PostHog for ai_suggestion events",
      "Cohorting adopters by team size and plan",
      "Comparing retention vs matched control",
      "Drafting Google Doc retro",
    ],
    toolCalls: [
      {
        integration: "PostHog",
        integrationColor: "#F9BD2B",
        integrationSlug: "posthog",
        title: "Querying PostHog for ai_suggestion events",
        request:
          '{\n  "event": "ai_suggestion_*",\n  "since": "21d",\n  "group_by": ["account_id", "week"]\n}',
        response:
          '{\n  "weekly_actives": 4204,\n  "eligible_users": 11063,\n  "adoption_rate": 0.38,\n  "p95_latency_ms": 4120\n}',
      },
      {
        integration: "Mixpanel",
        integrationColor: "#7856FF",
        integrationSlug: "mixpanel",
        title: "Cohorting adopters by team size and plan",
        request:
          '{\n  "cohort": "ai_suggestion_adopters",\n  "cut_by": ["team_size_bucket", "plan"]\n}',
        response:
          '{\n  "by_team_size": {\n    "1-4":  0.22,\n    "5-20": 0.47,\n    "21+":  0.31\n  },\n  "plan_lift": { "Growth": 0.19, "Team": 0.11, "Starter": 0.04 }\n}',
      },
      {
        integration: "PostHog",
        integrationColor: "#F9BD2B",
        integrationSlug: "posthog",
        title: "Comparing retention vs matched control",
        request:
          '{\n  "method": "propensity_matched",\n  "window": "W4 retention",\n  "features": ["plan", "team_size", "signup_source"]\n}',
        response:
          '{\n  "adopter_retention": 0.68,\n  "control_retention": 0.50,\n  "lift_pts": 18,\n  "p_value": 0.004\n}',
      },
      {
        integration: "Docs",
        integrationColor: "#1A73E8",
        integrationSlug: "googledocs",
        title: "Drafting Google Doc retro",
        request:
          '{\n  "title": "Retro · AI suggestions · Week 3",\n  "share_with": ["product", "eng"],\n  "sections": ["Outcome", "Cohort cuts", "Friction", "Action items"]\n}',
        response:
          '{\n  "doc_id": "1gX7...retro",\n  "url": "docs.google.com/retro-ai-suggestions",\n  "action_items": 5,\n  "attached_charts": 4\n}',
      },
    ],
    summaryText:
      "4.2k weekly actives (38% of eligible users). Retention lift of +18 pts vs matched control, concentrated in teams of 5-20. Main friction: suggestion latency on long docs (p95 = 4.1s) and unclear admin opt-out. Both scoped as follow-ups.",
    metrics: [
      { label: "Weekly actives", value: "4.2k", delta: "38% adoption", down: false },
      { label: "Retention lift", value: "+18pts", delta: "vs control", down: false },
      { label: "Friction signals", value: "29", delta: "2 P1, 11 P2", down: true },
    ],
    chart: {
      kind: "line-up",
      title: "Weekly retention · adopters vs control",
      source: "PostHog",
      yAxis: { unit: "%" },
      linePath:
        "M0,62 L29,58 L57,55 L86,50 L114,48 L143,42 L171,40 L200,36 L229,30 L257,25 L286,22 L314,18 L343,15 L371,12 L400,10",
      points: [
        { x: "W1", y: "50" },
        { x: "W2", y: "52" },
        { x: "W3", y: "55" },
        { x: "W4", y: "58" },
        { x: "W5", y: "60" },
        { x: "W6", y: "62" },
        { x: "W7", y: "63" },
        { x: "W8", y: "64" },
        { x: "W9", y: "65" },
        { x: "W10", y: "66" },
        { x: "W11", y: "67" },
        { x: "W12", y: "67" },
        { x: "W13", y: "68" },
        { x: "W14", y: "68" },
        { x: "W15", y: "68" },
      ],
    },
    output: {
      toolName: "Docs",
      toolColor: "#1A73E8",
      toolSlug: "googledocs",
      kindLabel: "Draft",
      badge: "Ready",
      title: "Retro · AI suggestions · Week 3 · 4.2k WAU",
      subtitle: "Product · Eng · 5 action items · attached: PostHog exports",
    },
  },
];
