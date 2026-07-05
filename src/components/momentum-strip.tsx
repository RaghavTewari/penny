// A ribbon of day-bars for the month: green = no-spend, terracotta = on pace,
// red = over pace, faint = future. Today's bar is taller.

import type { DayState, Momentum } from '@/lib/types'

function barStyle(state: DayState): { background: string; opacity: number } {
  switch (state) {
    case 'clear':
      return { background: 'var(--good)', opacity: 1 }
    case 'ontrack':
      return { background: 'var(--accent)', opacity: 0.5 }
    case 'over':
      return { background: 'var(--bad)', opacity: 1 }
    default:
      return { background: 'var(--surface-2)', opacity: 1 }
  }
}

export function MomentumStrip({ momentum }: { momentum: Momentum }) {
  return (
    <div className="flex items-end gap-[3px]">
      {momentum.days.map((d) => {
        const isToday = d.day === momentum.lastDay
        const s = barStyle(d.state)
        return (
          <div
            key={d.day}
            className="flex-1 rounded-full"
            style={{
              height: isToday ? 20 : 13,
              background: s.background,
              opacity: s.opacity,
              transition: 'height .3s ease',
            }}
          />
        )
      })}
    </div>
  )
}
