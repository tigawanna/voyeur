import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Loading", className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground",
        className,
      )}
    >
      <Spinner className="size-4" />
      <span>{label}</span>
    </div>
  );
}
