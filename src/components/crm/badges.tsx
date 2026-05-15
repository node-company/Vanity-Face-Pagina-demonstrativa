import { STAGE_LABELS, type Stage } from "@/lib/supabase/types";
import { scoreBand, SCORE_BAND_LABEL } from "@/lib/leads";
import { cn } from "@/lib/cn";

const STAGE_STYLE: Record<Stage, string> = {
  new: "bg-cream/10 text-cream border-cream/20",
  contacted: "bg-mist/15 text-mist-soft border-mist/40",
  qualified: "bg-gold-soft/20 text-gold-light border-gold/40",
  scheduled: "bg-gold/15 text-gold border-gold/40",
  attended: "bg-gold/25 text-gold border-gold/60",
  closed_won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  closed_lost: "bg-red-500/10 text-red-300 border-red-500/30",
};

export function StageBadge({ stage, className }: { stage: Stage; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.22em] uppercase border",
        STAGE_STYLE[stage],
        className
      )}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}

export function ScoreBadge({
  score,
  className,
  showLabel = true,
}: {
  score: number;
  className?: string;
  showLabel?: boolean;
}) {
  const band = scoreBand(score);
  const tone =
    band === "hot"
      ? "bg-gold text-navy border-gold"
      : band === "warm"
        ? "bg-cream/15 text-cream border-cream/35"
        : "bg-mist/15 text-mist-soft border-mist/40";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 text-[0.65rem] tabular tracking-[0.15em] uppercase font-semibold border",
        tone,
        className
      )}
    >
      <span>{score}</span>
      {showLabel && <span className="opacity-80">{SCORE_BAND_LABEL[band]}</span>}
    </span>
  );
}
