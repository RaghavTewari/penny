// Home — "Cards" layout. Glance at how much of the month is left, per category.
// (The prototype's `list`/`focus` alternates are intentionally not built.)

import { Card } from '@/components/ui/card'
import { Ring } from '@/components/ui/ring'
import { ProgressBar } from '@/components/ui/progress-bar'
import { CategoryBadge } from '@/components/ui/category-badge'
import { SectionLabel } from '@/components/ui/section-label'
import { PaceChip } from '@/components/pace-chip'
import { MonthNav } from '@/components/month-nav'
import { money } from '@/lib/money'
import type { CategoryStat, MonthData } from '@/lib/types'

function greeting(): string {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

function ElapsedNote({ d }: { d: MonthData }) {
  if (!d.isLive) return <>{d.daysInMonth} days · month complete</>
  return (
    <>
      Day {d.dayOfMonth} of {d.daysInMonth} · {Math.round(d.elapsed * 100)}% through
    </>
  )
}

function HeroCard({ d }: { d: MonthData }) {
  const pctLeft = d.totalBudget ? d.totalRemaining / d.totalBudget : 0
  return (
    <Card className="mb-[18px] p-[18px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold text-muted">Left to spend</div>
          <div className="text-[38px] font-extrabold leading-[1.05] tracking-[-1.2px] text-text">
            {money(d.totalRemaining)}
          </div>
        </div>
        <Ring pct={pctLeft} size={74} stroke={9} over={d.totalSpent > d.totalBudget}>
          <span className="text-[15px] font-extrabold text-text">
            {Math.round(pctLeft * 100)}%
          </span>
        </Ring>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12.5px] text-muted">
          <ElapsedNote d={d} />
        </span>
        <PaceChip pace={d.pace} />
      </div>
    </Card>
  )
}

function CategoryTile({
  c,
  onClick,
}: {
  c: CategoryStat
  onClick?: () => void
}) {
  return (
    <Card onClick={onClick} className="flex flex-col gap-2.5 p-[14px]">
      <div className="flex items-center justify-between">
        <CategoryBadge emoji={c.emoji} color={c.color} size={38} />
        {c.over && (
          <span className="rounded-full bg-bad-soft px-[7px] py-[3px] text-[11px] font-extrabold text-bad">
            over
          </span>
        )}
      </div>
      <div>
        <div className="text-[13px] font-bold text-muted">{c.name}</div>
        <div
          className="text-[22px] font-extrabold leading-[1.1] tracking-[-0.6px]"
          style={{ color: c.over ? 'var(--bad)' : 'var(--text)' }}
        >
          {c.over ? money(-c.remaining, { sign: true }) : money(c.remaining)}
        </div>
      </div>
      <div>
        <ProgressBar value={c.spent} max={c.budget} color={c.color} height={6} />
        <div className="mt-1.5 text-[11.5px] text-muted">
          of {money(c.budget, { cents: false })}
        </div>
      </div>
    </Card>
  )
}

type HomeProps = {
  d: MonthData
  month: string
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
  onOpenCat?: (c: CategoryStat) => void
}

export function Home({ d, month, onPrev, onNext, canPrev, canNext, onOpenCat }: HomeProps) {
  const cats = [...d.catStats].sort((a, b) => b.pct - a.pct)
  return (
    <div className="px-4 pb-2">
      {/* Header: greeting + month nav */}
      <div className="mb-[18px] flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-muted">{greeting()}</div>
          <div className="mt-0.5 text-[23px] font-extrabold tracking-[-0.5px] text-text">
            Here's your month
          </div>
        </div>
        <MonthNav
          month={month}
          onPrev={onPrev}
          onNext={onNext}
          canPrev={canPrev}
          canNext={canNext}
        />
      </div>

      <HeroCard d={d} />

      <SectionLabel>By category</SectionLabel>
      <div className="grid grid-cols-2 gap-[11px]">
        {cats.map((c) => (
          <CategoryTile key={c.id} c={c} onClick={onOpenCat ? () => onOpenCat(c) : undefined} />
        ))}
      </div>
    </div>
  )
}
