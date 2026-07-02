import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Small uppercase section heading (e.g. "By category"). */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'px-1 pb-2.5 text-[12.5px] font-bold uppercase tracking-[0.06em] text-faint',
        className,
      )}
    >
      {children}
    </div>
  )
}
