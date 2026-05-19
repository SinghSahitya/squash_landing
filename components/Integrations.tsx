import { INTEGRATIONS } from "@/lib/constants";
import { IntegrationMark } from "./ui/IntegrationMark";

// Integrations. Two parts:
//   1. Infinite marquee — animated sense of breadth (great for investor pitch)
//   2. Categorized grid — practical, scannable, SEO-friendly (real names
//      as plain text help search engines and LLMs index what Squash supports)
export function Integrations() {
  // Duplicate array for seamless marquee loop
  const marqueeItems = [...INTEGRATIONS, ...INTEGRATIONS];

  // Group by category — preserve insertion order so categories appear
  // in the order we defined them in constants.
  const byCategory = INTEGRATIONS.reduce<Record<string, typeof INTEGRATIONS>>(
    (acc, item) => {
      (acc[item.category] ||= []).push(item);
      return acc;
    },
    {}
  );

  return (
    <section
      id="integrations"
      aria-labelledby="integrations-heading"
      className="py-16 sm:py-20 md:py-32 bg-[color:var(--color-background)] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)]">
            Integrations
          </p>
          <h2
            id="integrations-heading"
            className="mt-3 text-[30px] sm:text-[36px] md:text-[48px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Works on top of{" "}
            <span className="italic text-[color:var(--color-primary)]">
              your existing
            </span>{" "}
            product stack.
          </h2>
          <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-[color:var(--color-foreground-secondary)] max-w-2xl">
            No migration. No new stack. No behaviour change for your team.
            Squash plugs into the tools you already pay for and reasons across
            them the way no incumbent ever will.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div
        className="relative mt-10 sm:mt-12 md:mt-14"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex gap-3 marquee-track" style={{ width: "max-content" }}>
          {marqueeItems.map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-[color:var(--color-border)]"
            >
              <IntegrationMark name={item.name} color={item.color} slug={item.slug} size={20} />
              <span className="text-[13px] font-medium text-[color:var(--color-foreground)] whitespace-nowrap">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 md:mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-8">
          {Object.entries(byCategory).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-foreground-muted)] pb-3 border-b border-[color:var(--color-border)]">
                {category}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {items.map((item) => (
                  <li key={item.name} className="flex items-center gap-2.5">
                    <IntegrationMark name={item.name} color={item.color} slug={item.slug} size={18} />
                    <span className="text-[13.5px] text-[color:var(--color-foreground-secondary)]">
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[13px] text-[color:var(--color-foreground-muted)] text-center">
          + custom connectors on request · we ship integrations on customer demand
        </p>
      </div>
    </section>
  );
}
