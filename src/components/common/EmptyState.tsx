import { Card } from '#/components/common/Card'

interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="px-6 py-12 text-center">
      <h2 className="mb-2 text-lg font-semibold text-[var(--ink)]">{title}</h2>
      <p className="m-0 text-sm text-[var(--ink-soft)]">{description}</p>
    </Card>
  )
}
