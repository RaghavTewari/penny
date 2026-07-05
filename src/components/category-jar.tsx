// A category "jar" — the whole tile fills from the bottom with the category's
// color as you spend, so budgets feel like vessels emptying/filling.

import { CategoryBadge } from '@/components/ui/category-badge'
import { tint } from '@/lib/color'
import { money } from '@/lib/money'
import type { CategoryStat } from '@/lib/types'

export function CategoryJar({ c, onClick }: { c: CategoryStat; onClick?: () => void }) {
  const pct = c.budget > 0 ? Math.min(1, c.spent / c.budget) : c.spent > 0 ? 1 : 0
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col gap-2.5 overflow-hidden rounded-[20px] border border-border bg-surface p-3.5 text-left shadow-[var(--shadow-soft-sm)] transition-transform active:scale-[0.97]"
    >
      {/* fill */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: `${pct * 100}%`,
          background: c.over ? 'var(--bad-soft)' : tint(c.color, 0.15),
          transition: 'height .5s cubic-bezier(.22,1,.36,1)',
        }}
      />
      <div className="relative flex items-center justify-between">
        <CategoryBadge emoji={c.emoji} color={c.color} size={38} />
        {c.over && (
          <span className="rounded-full bg-bad px-[7px] py-[3px] text-[11px] font-extrabold text-white">
            over
          </span>
        )}
      </div>
      <div className="relative">
        <div className="text-[13px] font-bold text-muted">{c.name}</div>
        <div
          className="text-[22px] font-extrabold leading-[1.1] tracking-[-0.6px]"
          style={{ color: c.over ? 'var(--bad)' : 'var(--text)' }}
        >
          {c.over ? money(-c.remaining, { sign: true }) : money(c.remaining)}
        </div>
        <div className="mt-0.5 text-[11.5px] font-semibold text-muted">
          {money(c.spent, { cents: false })} of {money(c.budget, { cents: false })}
        </div>
      </div>
    </button>
  )
}
