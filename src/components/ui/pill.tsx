import type { ReactNode } from 'react'

type PillProps = {
  active?: boolean
  onClick?: () => void
  children: ReactNode
}

/** Rounded filter/segment chip (accent when active). */
export function Pill({ active, onClick, children }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors"
      style={{
        background: active ? 'var(--accent)' : 'var(--surface-2)',
        color: active ? 'var(--accent-ink)' : 'var(--muted)',
      }}
    >
      {children}
    </button>
  )
}
