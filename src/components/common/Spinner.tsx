export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-[var(--ink-soft)]">
      <span className="size-4 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--accent)]" />
      <span>{label}</span>
    </div>
  )
}
