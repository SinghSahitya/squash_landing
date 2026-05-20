"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS, DEMO_URL, APP_URL } from "@/lib/constants";
import { Logo } from "./ui/Logo";

// Sticky header that gains a blurred background + bottom border once
// the user scrolls past the hero. Single primary CTA (Book a demo);
// existing customers get a small "Log in" link.
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[color:var(--color-background)]/80 backdrop-blur-md border-b border-[color:var(--color-border)]"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="relative max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-2" aria-label="Squash home">
          <Logo className="h-7 w-auto" />
        </Link>

        {/*
          Nav links are absolutely centered to the viewport (independent
          of the logo / CTA widths on either side) so they always sit at
          the visual midpoint regardless of how the side groups grow.
        */}
        <ul className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-[color:var(--color-foreground-secondary)] hover:text-[color:var(--color-foreground)] transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <a
            href={APP_URL}
            className="text-sm text-[color:var(--color-foreground-secondary)] hover:text-[color:var(--color-foreground)] transition-colors"
          >
            Log in
          </a>
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] transition-colors"
          >
            Book a demo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-[color:var(--color-border)] bg-[color:var(--color-background)]"
        >
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-2.5 text-sm text-[color:var(--color-foreground-secondary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="flex gap-2 pt-2">
              <a
                href={APP_URL}
                className="flex-1 text-center text-sm py-2 rounded-full border border-[color:var(--color-border)]"
              >
                Log in
              </a>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-sm font-medium py-2 rounded-full bg-[color:var(--color-primary)] text-white"
              >
                Book a demo
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
