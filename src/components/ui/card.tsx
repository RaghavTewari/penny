import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CardProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
}

/** Soft white surface card (radius 22, subtle shadow + border). */
export function Card({ children, className, onClick }: CardProps) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cn(
        'rounded-card border border-border bg-surface p-4 text-left',
        'shadow-[var(--shadow-soft-sm)]',
        onClick && 'w-full cursor-pointer transition-transform active:scale-[0.985]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
