// Brand marks for integration tiles. Follows the same approach as the
// squash_frontend `IntegrationIcon` component: three-tier fallback from
// simple-icons → custom inline SVG → colored letter badge. Renders a
// colored rounded square containing the brand's white SVG glyph.
import {
  siJira,
  siConfluence,
  siNotion,
  siLinear,
  siZendesk,
  siIntercom,
  siGmail,
  siGooglecalendar,
  siGoogledocs,
  siGooglesheets,
  siGoogledrive,
  siMixpanel,
  siMetabase,
  siPosthog,
  siPostgresql,
  siGooglebigquery,
  siAnthropic,
  siGoogleanalytics,
  siHotjar,
  siDynatrace,
  siGithub,
  siSentry,
} from "simple-icons";

type SimpleIcon = { hex: string; path: string };

// Tier 1: brands with entries in the simple-icons package
const SI_ICONS: Record<string, SimpleIcon> = {
  jira: siJira,
  confluence: siConfluence,
  notion: siNotion,
  linear: siLinear,
  zendesk: siZendesk,
  intercom: siIntercom,
  mixpanel: siMixpanel,
  metabase: siMetabase,
  posthog: siPosthog,
  gmail: siGmail,
  googlecalendar: siGooglecalendar,
  googledocs: siGoogledocs,
  googlesheets: siGooglesheets,
  googledrive: siGoogledrive,
  googlebigquery: siGooglebigquery,
  postgresql: siPostgresql,
  anthropic: siAnthropic,
  googleanalytics: siGoogleanalytics,
  hotjar: siHotjar,
  dynatrace: siDynatrace,
  github: siGithub,
  sentry: siSentry,
};

// Tier 2: brands removed from simple-icons but with well-known SVG paths
const CUSTOM_SVG: Record<string, { path: string }> = {
  // Slack — pinwheel of 4 rounded bar pairs
  slack: {
    path: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z",
  },
  // OpenAI — geometric hexagram mark
  openai: {
    path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
  },
  // Salesforce — cloud mark
  salesforce: {
    path: "M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.16 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 0 1-3.27 1.95c-.51 0-.976-.12-1.395-.313A4.32 4.32 0 0 1 9.15 20.48a4.29 4.29 0 0 1-4.105-3.054 3.964 3.964 0 0 1-.81.088A3.98 3.98 0 0 1 .21 13.523a3.98 3.98 0 0 1 1.994-3.44 4.485 4.485 0 0 1 7.796-4.67z",
  },
};

// Tier 3: brands without a vector glyph — show a colored letter badge.
// `label` overrides the default first-letter of the name when provided.
const BADGE_STYLES: Record<string, { label: string }> = {
  firecrawl: { label: "FC" },
  granola: { label: "GR" },
  signoz: { label: "SZ" },
  greylabs: { label: "GL" },
  amplitude: { label: "AM" },
  heap: { label: "HP" },
  fullstory: { label: "FS" },
  vwo: { label: "VW" },
};

export function IntegrationMark({
  name,
  color,
  slug,
  size = 28,
}: {
  name: string;
  color: string;
  slug?: string | null;
  size?: number;
}) {
  const radius = Math.round(size * 0.28);
  const padding = Math.round(size * 0.18);
  const iconSize = size - padding * 2;

  const containerBase = {
    width: size,
    height: size,
    borderRadius: radius,
    flexShrink: 0,
  } as const;

  const si = slug ? SI_ICONS[slug] : null;
  if (si) {
    return (
      <span
        className="inline-flex items-center justify-center"
        style={{ ...containerBase, backgroundColor: color }}
        aria-hidden="true"
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
        >
          <path d={si.path} />
        </svg>
      </span>
    );
  }

  const custom = slug ? CUSTOM_SVG[slug] : null;
  if (custom) {
    return (
      <span
        className="inline-flex items-center justify-center"
        style={{ ...containerBase, backgroundColor: color }}
        aria-hidden="true"
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
        >
          <path d={custom.path} />
        </svg>
      </span>
    );
  }

  const badge = slug ? BADGE_STYLES[slug] : null;
  const label = badge?.label ?? name[0];
  return (
    <span
      className="inline-flex items-center justify-center font-semibold text-white"
      style={{
        ...containerBase,
        backgroundColor: color,
        fontSize: Math.round(size * (label.length > 1 ? 0.32 : 0.4)),
        fontFamily: "var(--font-sans)",
        letterSpacing: "-0.02em",
      }}
      aria-hidden="true"
    >
      {label}
    </span>
  );
}
