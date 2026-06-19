import { cn } from "@/lib/utils";

type ForestTrailMapProps = {
  className?: string;
};

export function ForestTrailMap({ className }: ForestTrailMapProps) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden border border-border bg-base-200",
        className,
      )}
    >
      <svg
        viewBox="0 0 320 180"
        className="size-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Stylized forest trail map"
      >
        <g className="text-base-content/10" stroke="currentColor" strokeWidth="1">
          <path d="M-10 40 C 70 10 150 70 230 30 S 360 40 360 40" />
          <path d="M-10 80 C 80 50 160 110 240 70 S 360 80 360 80" />
          <path d="M-10 120 C 70 95 150 150 230 115 S 360 125 360 125" />
          <path d="M-10 160 C 90 140 170 185 250 155 S 360 165 360 165" />
        </g>

        <path
          d="M30 150 C 70 120 60 90 100 80 S 150 60 170 95 S 220 110 250 70 290 35 300 30"
          className="text-primary"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 7"
        />

        <circle cx="30" cy="150" r="5" className="fill-primary" />
        <circle cx="100" cy="80" r="4" className="fill-sky-500" />
        <circle cx="170" cy="95" r="4" className="fill-sky-500" />
        <circle cx="250" cy="70" r="4" className="fill-amber-500" />
        <circle cx="300" cy="30" r="5" className="fill-primary" />

        <circle cx="30" cy="150" r="11" className="fill-primary/15" />
        <circle cx="300" cy="30" r="11" className="fill-primary/15" />
      </svg>
    </div>
  );
}
