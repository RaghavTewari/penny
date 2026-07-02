// Insights — quick stats, spending breakdown, and a monthly trend chart.

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { SectionLabel } from '@/components/ui/section-label'
import { MonthNav } from '@/components/month-nav'
import { useHistory, useMonthData } from '@/hooks/useBudget'
import { addMonth, money, monthShort } from '@/lib/money'
import type { ReactNode } from 'react'

type Tone = 'good' | 'bad' | undefined

function StatTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string
  sub?: ReactNode
  tone?: Tone
}) {
  const color = tone === 'good' ? 'var(--good)' : tone === 'bad' ? 'var(--bad)' : 'var(--text)'
  return (
    <Card className="flex-1 p-[15px]">
      <div className="text-[12.5px] font-bold text-muted">{label}</div>
      <div
        className="mb-px mt-[3px] text-[24px] font-extrabold tracking-[-0.8px]"
        style={{ color }}
      >
        {value}
      </div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </Card>
  )
}

type StatsProps = {
  month: string
  currentMonth: string
  onMonth: (m: string) => void
}

export function Stats({ month, currentMonth, onMonth }: StatsProps) {
  const { data: d, isLoading } = useMonthData(month)
  const { data: history = [] } = useHistory()
  const canNext = month < currentMonth

  const model = useMemo(() => {
    if (!d) return null
    const byCat = d.catStats.filter((c) => c.spent > 0).sort((a, b) => b.spent - a.spent)
    const maxSpent = byCat.length ? byCat[0].spent : 1

    const prev = history.find((h) => h.key === addMonth(month, -1))
    const delta = prev ? d.totalSpent - prev.spent : null

    const trend = [...history].sort((a, b) => (a.key < b.key ? -1 : 1)).slice(-6)
    const maxTrend = Math.max(...trend.map((t) => t.spent), 1)

    return { byCat, maxSpent, prev, delta, trend, maxTrend }
  }, [d, history, month])

  if (isLoading || !d || !model) {
    return <div className="flex h-full items-center justify-center text-sm text-muted">Loading…</div>
  }

  const { byCat, maxSpent, prev, delta, trend, maxTrend } = model

  return (
    <div className="px-4 pb-2">
      <div className="mb-[18px] flex items-center justify-between">
        <div className="text-[23px] font-extrabold tracking-[-0.5px] text-text">Insights</div>
        <MonthNav
          month={month}
          canPrev
          canNext={canNext}
          onPrev={() => onMonth(addMonth(month, -1))}
          onNext={() => canNext && onMonth(addMonth(month, 1))}
        />
      </div>

      {/* Stat tiles (2×2) */}
      <div className="mb-[11px] flex gap-[11px]">
        <StatTile
          label="Spent"
          value={money(d.totalSpent, { cents: false })}
          tone={delta != null ? (delta > 0 ? 'bad' : 'good') : undefined}
          sub={
            delta != null && prev
              ? `${delta >= 0 ? '↑' : '↓'} ${money(Math.abs(delta), { cents: false })} vs ${monthShort(prev.key).split(' ')[0]}`
              : 'this month'
          }
        />
        <StatTile
          label="Earned"
          value={money(d.income, { cents: false })}
          sub="income in"
          tone="good"
        />
      </div>
      <div className="mb-[22px] flex gap-[11px]">
        <StatTile
          label="Net saved"
          value={money(d.net, { cents: false, sign: true })}
          sub={d.net >= 0 ? 'kept this month' : 'overspent'}
          tone={d.net >= 0 ? 'good' : 'bad'}
        />
        <StatTile
          label={d.isLive ? 'Daily pace' : 'Daily avg'}
          value={money(d.dailyAvg, { cents: false })}
          sub={
            d.isLive
              ? `~${money(d.projected, { cents: false })} projected`
              : `over ${d.daysInMonth} days`
          }
        />
      </div>

      {/* Where it went */}
      <SectionLabel>Where it went</SectionLabel>
      <Card className="mb-[22px]">
        {byCat.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted">No spending yet.</div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {byCat.map((c) => (
              <div key={c.id}>
                <div className="mb-[7px] flex items-center gap-2.5">
                  <span className="text-[15px]">{c.emoji}</span>
                  <span className="flex-1 text-sm font-bold text-text">{c.name}</span>
                  <span className="text-[13.5px] font-extrabold text-text">
                    {money(c.spent, { cents: false })}
                  </span>
                  <span className="w-[34px] text-right text-[11.5px] font-bold text-muted">
                    {Math.round((c.spent / d.totalSpent) * 100)}%
                  </span>
                </div>
                <div className="h-[9px] overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${((c.spent / maxSpent) * 100).toFixed(1)}%`,
                      background: c.color,
                      transition: 'width .5s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Monthly trend */}
      <SectionLabel>Monthly trend</SectionLabel>
      <Card>
        <div className="flex h-[130px] items-end gap-2.5 px-0.5 pt-1">
          {trend.map((t) => {
            const cur = t.key === month
            return (
              <div
                key={t.key}
                className="flex h-full flex-1 flex-col items-center justify-end gap-[7px]"
              >
                <div
                  className="text-[10.5px] font-bold"
                  style={{ color: cur ? 'var(--text)' : 'var(--muted)' }}
                >
                  {money(t.spent, { cents: false })}
                </div>
                <div
                  className="w-full max-w-[38px] rounded-t-lg"
                  style={{
                    height: `${Math.max(6, (t.spent / maxTrend) * 86)}%`,
                    background: cur ? 'var(--accent)' : 'var(--accent-soft)',
                    transition: 'height .5s ease',
                  }}
                />
                <div
                  className="text-[11px] font-bold"
                  style={{ color: cur ? 'var(--text)' : 'var(--muted)' }}
                >
                  {monthShort(t.key).split(' ')[0]}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
