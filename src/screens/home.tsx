// Home — playful, gamified. Penny reacts to your month, a momentum ribbon shows
// your streak of on-pace days, and category "jars" fill as you spend.

import { Card } from '@/components/ui/card'
import { SectionLabel } from '@/components/ui/section-label'
import { Icon } from '@/components/ui/icon'
import { MonthNav } from '@/components/month-nav'
import { PennyMascot, type Mood } from '@/components/penny-mascot'
import { MomentumStrip } from '@/components/momentum-strip'
import { CategoryJar } from '@/components/category-jar'
import { money } from '@/lib/money'
import type { CategoryStat, MonthData } from '@/lib/types'

function greeting(): string {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

function moodOf(d: MonthData): Mood {
  if (d.pace.tone === 'bad') return 'worried'
  if (d.pace.tone === 'warn') return 'neutral'
  return 'happy'
}

function streakMessage(d: MonthData): string {
  const { streak } = d.momentum
  if (d.pace.tone === 'bad') return 'Ease up a little — you can bounce back'
  if (streak >= 5) return "You're on a roll! Keep it going"
  if (streak >= 1) return 'Nice pace — stay under to grow it'
  return 'Spend under your pace to start a streak'
}

function StreakHero({ d }: { d: MonthData }) {
  const { streak, noSpendDays } = d.momentum
  const flame = streak > 0 ? '🔥' : '🌱'
  return (
    <Card className="mb-[18px] p-[18px]">
      <div className="flex items-center gap-3.5">
        <PennyMascot mood={moodOf(d)} size={56} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[19px] leading-none">{flame}</span>
            <span className="text-[32px] font-extrabold leading-none tracking-[-1px] text-text">
              {streak}
            </span>
            <span className="text-sm font-bold text-muted">
              day{streak === 1 ? '' : 's'} on pace
            </span>
          </div>
          <div className="mt-1.5 text-[12.5px] font-semibold text-muted">{streakMessage(d)}</div>
        </div>
      </div>

      <div className="mt-3.5">
        <MomentumStrip momentum={d.momentum} />
      </div>

      <div className="mt-3.5 flex items-center justify-between text-[12.5px]">
        <span className="text-muted">
          Left this month <span className="font-extrabold text-text">{money(d.totalRemaining)}</span>
        </span>
        {d.isLive ? (
          <span className="text-muted">
            Safe today{' '}
            <span className="font-extrabold text-accent">{money(d.safeToday, { cents: false })}</span>
          </span>
        ) : (
          <span className="text-muted">
            {noSpendDays} no-spend day{noSpendDays === 1 ? '' : 's'}
          </span>
        )}
      </div>
    </Card>
  )
}

function AddCategoryTile({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[128px] flex-col items-center justify-center gap-2 rounded-[20px] border-[1.5px] border-dashed border-[color:var(--faint)] bg-transparent text-muted transition-transform active:scale-[0.97]"
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-accent">
        <Icon name="plus" size={20} stroke={2.4} />
      </span>
      <span className="text-[12.5px] font-bold">Add category</span>
    </button>
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
  onAddCategory: () => void
}

export function Home({
  d,
  month,
  onPrev,
  onNext,
  canPrev,
  canNext,
  onOpenCat,
  onAddCategory,
}: HomeProps) {
  const cats = [...d.catStats].sort((a, b) => b.pct - a.pct)
  return (
    <div className="px-4 pb-2">
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

      <StreakHero d={d} />

      <SectionLabel>By category</SectionLabel>
      <div className="grid grid-cols-2 gap-[11px]">
        {cats.map((c) => (
          <CategoryJar key={c.id} c={c} onClick={onOpenCat ? () => onOpenCat(c) : undefined} />
        ))}
        <AddCategoryTile onClick={onAddCategory} />
      </div>
    </div>
  )
}
