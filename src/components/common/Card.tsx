import { cn } from '#/utils/cn'
import type { HTMLAttributes } from 'react'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('island-shell rounded-2xl border border-[var(--line)] bg-[var(--surface)]', className)}
      {...props}
    />
  )
}
