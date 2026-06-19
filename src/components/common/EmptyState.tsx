import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description: string
  className?: string
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card px-6 py-12 text-center text-card-foreground shadow-sm',
        className,
      )}
    >
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="m-0 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
