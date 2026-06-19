import { cn } from '#/utils/cn'
import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.16)] text-[var(--ink)] hover:bg-[rgba(212,175,55,0.28)]',
  secondary:
    'border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-strong)]',
  ghost: 'border border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface)]',
}

export function Button({ className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
