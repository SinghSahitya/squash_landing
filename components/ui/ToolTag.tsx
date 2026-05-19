import { IntegrationMark } from "./IntegrationMark";
import { INTEGRATIONS } from "@/lib/constants";

// Small inline pill showing a tool's brand mark + name. Used inside
// investigation steps, scenario footers, and anywhere we cite which
// tool a signal came from. Reads color + slug from the central
// INTEGRATIONS list so we never duplicate brand data.
export function ToolTag({ name, size = "sm" }: { name: string; size?: "sm" | "xs" }) {
  const integration = INTEGRATIONS.find((i) => i.name === name);
  const color = integration?.color ?? "#7a7873";
  const slug = integration?.slug;

  const iconSize = size === "xs" ? 12 : 14;
  const padX = size === "xs" ? "px-1.5" : "px-2";
  const textSize = size === "xs" ? "text-[10px]" : "text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${padX} py-1 rounded-md bg-[color:var(--color-background-tertiary)] border border-[color:var(--color-border)] ${textSize} font-medium text-[color:var(--color-foreground-secondary)] whitespace-nowrap`}
    >
      <IntegrationMark name={name} color={color} slug={slug} size={iconSize} />
      {name}
    </span>
  );
}
