import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FAQS } from "@/lib/constants";
import { Analytics } from "@vercel/analytics/next";

// ─────────────────────────────────────────────────────────────
// FONTS — distinctive editorial pairing
//   Instrument Serif:  hero display, section headings (Cambria-like)
//   Geist Sans:        body text (more character than Inter)
//   Geist Mono:        chat prompts and code
// ─────────────────────────────────────────────────────────────
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

// ─────────────────────────────────────────────────────────────
// SEO METADATA — optimized for "autonomous AI for product teams"
// ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://heysquash.com"),
  title: {
    default: "Squash · The AI Product Manager That Works 24/7 On Your Stack",
    template: "%s | Squash",
  },
  description:
    "Squash is the autonomous AI teammate for product teams. It watches your analytics, session replays, support tickets, customer calls, and error logs continuously, investigates issues across tools, and tells your team what to fix and ship next.",
  keywords: [
    "autonomous AI product manager",
    "AI product autopilot",
    "AI for product teams",
    "24/7 product monitoring",
    "product anomaly detection AI",
    "AI root cause analysis",
    "session replay AI agent",
    "support ticket synthesis AI",
    "product analytics AI",
    "AI insights from session replays",
    "user feedback synthesis",
    "AI for SaaS product teams",
    "Mixpanel AI",
    "PostHog AI",
    "Amplitude alternative AI",
    "Jira AI",
    "Linear AI",
    "AI PRD generator",
  ],
  authors: [{ name: "Squash" }],
  creator: "Squash",
  publisher: "Squash",
  alternates: { canonical: "https://heysquash.com" },
  openGraph: {
    type: "website",
    url: "https://heysquash.com",
    siteName: "Squash",
    title: "Squash · The AI Product Manager That Works 24/7 On Your Stack",
    description:
      "The AI teammate that watches your product 24/7 across analytics, replays, tickets, and logs, so things don't slip past you.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Squash · The AI teammate that watches your product 24/7",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Squash · The AI Product Manager That Works 24/7",
    description:
      "Squash watches your product across every tool, investigates issues, and tells your team what to fix next.",
    images: ["/og-image.png"],
    creator: "@squash",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  category: "technology",
};

// ─────────────────────────────────────────────────────────────
// JSON-LD STRUCTURED DATA
//   - Organization: knowledge graph
//   - SoftwareApplication: product category signal to Google + LLMs
//   - FAQPage: rich results + AI answer quoting
// ─────────────────────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Squash",
  url: "https://heysquash.com",
  logo: "https://heysquash.com/logo.png",
  description:
    "Squash is the autonomous AI teammate for product teams, watching your analytics, replays, tickets, and error logs 24/7 to surface what to fix and ship next.",
  sameAs: [
    "https://twitter.com/squash",
    "https://linkedin.com/company/squash",
    "https://github.com/squash",
  ],
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Squash",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Autonomous AI product manager that monitors your product stack 24/7. Squash investigates anomalies across analytics, session replays, support tickets, customer calls, and error logs, then suggests fixes with full context.",
  offers: {
    "@type": "Offer",
    price: "1500",
    priceCurrency: "USD",
    description:
      "Starter plan from $1,500/month. Enterprise pricing available, book a demo for a custom quote.",
  },
  featureList: [
    "24/7 monitoring across analytics, session replays, support tickets, customer calls, and error logs",
    "Autonomous cross-tool investigations with full root-cause analysis",
    "Anomaly and regression detection in product metrics, funnels, and infrastructure",
    "Auto-drafted Linear and Jira tickets with citations to source signals",
    "Slack and Gmail push of high-impact insights with suggested actions",
    "Context-aware copilot for on-demand product, analytics, and feedback questions",
    "20+ integrations including Mixpanel, PostHog, Amplitude, Hotjar, Sentry, Zendesk, Intercom, BigQuery, Linear, and Slack",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (QuickBooks,
          password managers, etc.) inject attributes like
          `data-qb-installed` onto <body> before React hydrates, which
          would otherwise trigger a hydration mismatch. */}
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
