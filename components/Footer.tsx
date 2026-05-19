import Link from "next/link";
import { Logo } from "./ui/Logo";
import { DEMO_URL, FOUNDER_EMAIL } from "@/lib/constants";

const EXPLORE_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Ask Squash", href: "#ask-squash" },
];

const CONTACT_LINKS = [
  { label: FOUNDER_EMAIL, href: `mailto:${FOUNDER_EMAIL}` },
  {
    label: "Book a demo",
    href: DEMO_URL,
    external: true,
  },
];

export function Footer() {
  return (
    <footer className="bg-[color:var(--color-background)] border-t border-[color:var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 sm:py-14 md:py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Brand + tagline */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-xs">
              Watches your product stack 24/7 so nothing slips past your team.
            </p>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-6 sm:gap-8 lg:gap-12 lg:justify-items-end">
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-foreground)]">
                Explore
              </h3>
              <ul className="mt-4 space-y-2.5">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[color:var(--color-foreground-secondary)] hover:text-[color:var(--color-foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-foreground)]">
                Get in touch
              </h3>
              <ul className="mt-4 space-y-2.5">
                {CONTACT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[13px] text-[color:var(--color-foreground-secondary)] hover:text-[color:var(--color-foreground)] transition-colors break-all"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 md:mt-14 pt-6 border-t border-[color:var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-[12px] text-[color:var(--color-foreground-muted)]">
            © 2026 Squash, Inc. All rights reserved.
          </p>
          <p className="text-[12px] text-[color:var(--color-foreground-muted)]">
            Built in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
