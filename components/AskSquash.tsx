import { ChatMockAnimated } from "./ui/ChatMockAnimated";

// Ask Squash — secondary capability. Squash also doubles as a
// context-aware copilot. Positioned AFTER the three autonomous
// showcases so visitors understand the chat is a bonus, not the lead.
export function AskSquash() {
  return (
    <section
      id="ask-squash"
      aria-labelledby="ask-heading"
      className="py-16 sm:py-20 md:py-32 bg-[color:var(--color-background)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
              Ask Squash
            </p>
            <h2
              id="ask-heading"
              className="mt-3 text-[30px] sm:text-[36px] md:text-[42px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-foreground)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              And when you{" "}
              <span className="italic text-[color:var(--color-primary)]">
                do
              </span>{" "}
              have a question, ask the teammate that&apos;s already read everything.
            </h2>
            <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)]">
              Squash is wired into your analytics, sessions, tickets, calls, and
              backlog. Ask a funnel question, draft a ticket, summarise complaints.
              It answers like someone who&apos;s already read everything.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "Ask a data question. Squash writes the SQL, runs it, and visualises the answer.",
                "Draft a Jira / Linear ticket grounded in real session and ticket evidence.",
                "Summarise what customers are complaining about most this month, with sources.",
              ].map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2.5 text-[13.5px] sm:text-[14px] text-[color:var(--color-foreground-secondary)] leading-relaxed"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="mt-1 text-[color:var(--color-primary)] flex-shrink-0"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <ChatMockAnimated />
          </div>
        </div>
      </div>
    </section>
  );
}
