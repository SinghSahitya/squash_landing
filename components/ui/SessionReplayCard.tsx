// Mini session-replay thumbnail used in the Detect showcase and
// elsewhere we want to evoke "we watched a real session". Pure SVG —
// no actual video, just the framing that reads as a replay card.
export function SessionReplayCard({
  index,
  duration,
  note,
}: {
  index: number;
  duration: string;
  note: string;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-white overflow-hidden">
      <div
        className="relative aspect-video bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-white/60 tabular-nums">
          {duration}
        </span>
        <span className="absolute top-1.5 right-1.5 inline-flex w-1.5 h-1.5 rounded-full bg-[color:var(--color-error)]" />
        <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-[10px] font-semibold text-[color:var(--color-foreground)]">
          Session #{index}
        </p>
        <p className="mt-0.5 text-[10px] leading-snug text-[color:var(--color-foreground-muted)]">
          {note}
        </p>
      </div>
    </div>
  );
}
