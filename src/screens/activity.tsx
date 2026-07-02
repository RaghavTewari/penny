// Activity — browse/edit the selected month's transactions, grouped by day.

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Pill } from '@/components/ui/pill'
import { Icon } from '@/components/ui/icon'
import { CategoryBadge } from '@/components/ui/category-badge'
import { MonthNav } from '@/components/month-nav'
import { useCategories, useTransactions } from '@/hooks/useBudget'
import { makeCatResolver, type DisplayCat } from '@/lib/categories'
import { addMonth, money, relDay, todayISO } from '@/lib/money'
import type { Transaction } from '@/lib/types'

type Filter = 'all' | 'spent' | 'income'

type DayGroup = { date: string; items: Transaction[] }

function groupByDay(txs: Transaction[]): DayGroup[] {
  const map: Record<string, Transaction[]> = {}
  for (const t of txs) (map[t.date] ||= []).push(t)
  return Object.keys(map)
    .sort((a, b) => (a < b ? 1 : -1))
    .map((date) => ({ date, items: map[date] }))
}

function TxRow({
  t,
  cat,
  onClick,
}: {
  t: Transaction
  cat: DisplayCat
  onClick: () => void
}) {
  const income = t.type === 'income'
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-1 py-[11px] text-left"
    >
      <CategoryBadge emoji={cat.emoji} color={cat.color} size={42} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[15px] font-bold text-text">
          <span className="truncate">{t.note || cat.name}</span>
          {t.recurring && (
            <span className="inline-flex text-faint">
              <Icon name="repeat" size={13} />
            </span>
          )}
        </div>
        <div className="mt-px text-[12.5px] text-muted">{cat.name}</div>
      </div>
      <div
        className="text-[15.5px] font-extrabold tracking-[-0.3px]"
        style={{ color: income ? 'var(--good)' : 'var(--text)' }}
      >
        {income ? '+' : '−'}
        {money(t.amount).replace('−', '')}
      </div>
    </button>
  )
}

type ActivityProps = {
  month: string
  currentMonth: string
  onMonth: (m: string) => void
  onEdit: (t: Transaction) => void
}

export function Activity({ month, currentMonth, onMonth, onEdit }: ActivityProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const { data: categories = [] } = useCategories()
  const { data: transactions = [], isLoading } = useTransactions(month)

  const resolve = useMemo(() => makeCatResolver(categories), [categories])

  const filtered = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    if (filter === 'spent') return sorted.filter((t) => t.type === 'expense')
    if (filter === 'income') return sorted.filter((t) => t.type === 'income')
    return sorted
  }, [transactions, filter])

  const groups = groupByDay(filtered)
  const canNext = month < currentMonth

  return (
    <div className="px-4 pb-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[23px] font-extrabold tracking-[-0.5px] text-text">Activity</div>
        <MonthNav
          month={month}
          canPrev
          canNext={canNext}
          onPrev={() => onMonth(addMonth(month, -1))}
          onNext={() => canNext && onMonth(addMonth(month, 1))}
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Pill active={filter === 'all'} onClick={() => setFilter('all')}>All</Pill>
        <Pill active={filter === 'spent'} onClick={() => setFilter('spent')}>Spent</Pill>
        <Pill active={filter === 'income'} onClick={() => setFilter('income')}>Income</Pill>
        <div className="flex-1" />
        <div className="text-[13px] font-bold text-muted">
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {!isLoading && groups.length === 0 && (
        <div className="py-16 text-center text-sm text-muted">Nothing here yet.</div>
      )}

      <div className="flex flex-col gap-[18px]">
        {groups.map((g) => {
          const dayTotal = g.items.reduce((s, t) => s + (t.type === 'income' ? 0 : t.amount), 0)
          return (
            <div key={g.date}>
              <div className="flex items-baseline justify-between px-1 pb-1">
                <span className="text-[12.5px] font-bold uppercase tracking-[0.04em] text-faint">
                  {relDay(g.date, todayISO())}
                </span>
                {dayTotal > 0 && (
                  <span className="text-[12.5px] font-bold text-muted">
                    {money(dayTotal, { cents: false })}
                  </span>
                )}
              </div>
              <Card className="p-1.5">
                {g.items.map((t, i) => (
                  <div key={t.id}>
                    {i > 0 && <div className="ml-[58px] mr-1 h-px bg-border" />}
                    <TxRow t={t} cat={resolve(t)} onClick={() => onEdit(t)} />
                  </div>
                ))}
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
