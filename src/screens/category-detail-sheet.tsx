// Category Detail — opened from a Home tile. Shows the category's remaining
// (or over) amount, progress, and its transactions for the month. Tapping a
// row opens the Add/Edit sheet for that transaction.

import { useMemo } from 'react'
import { Sheet } from '@/components/ui/sheet'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { ProgressBar } from '@/components/ui/progress-bar'
import { CategoryBadge } from '@/components/ui/category-badge'
import { SectionLabel } from '@/components/ui/section-label'
import { useTransactions } from '@/hooks/useBudget'
import { fmtDay, money, monthLabel } from '@/lib/money'
import { tint } from '@/lib/color'
import type { CategoryStat, Transaction } from '@/lib/types'

type CategoryDetailSheetProps = {
  open: boolean
  cat: CategoryStat | null
  month: string
  onClose: () => void
  onEditTx: (t: Transaction) => void
}

export function CategoryDetailSheet({
  open,
  cat,
  month,
  onClose,
  onEditTx,
}: CategoryDetailSheetProps) {
  const { data: transactions = [] } = useTransactions(month)

  const txs = useMemo(
    () =>
      transactions
        .filter((t) => cat && t.category_id === cat.id)
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)),
    [transactions, cat],
  )

  return (
    <Sheet open={open} onClose={onClose} height="86%">
      {cat && (
        <>
          <div className="flex items-center gap-3 px-5 pt-3.5">
            <CategoryBadge emoji={cat.emoji} color={cat.color} size={46} />
            <div className="flex-1">
              <div className="text-[19px] font-extrabold text-text">{cat.name}</div>
              <div className="text-[13px] text-muted">{monthLabel(month)}</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-muted"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="px-5 pt-3">
            <div className="relative overflow-hidden rounded-[20px] border border-border bg-surface p-4 shadow-[var(--shadow-soft-sm)]">
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0"
                style={{
                  height: `${Math.min(1, cat.budget > 0 ? cat.spent / cat.budget : cat.spent > 0 ? 1 : 0) * 100}%`,
                  background: cat.over ? 'var(--bad-soft)' : tint(cat.color, 0.15),
                  transition: 'height .5s cubic-bezier(.22,1,.36,1)',
                }}
              />
              <div className="relative mb-2 flex items-baseline justify-between">
                <div>
                  <div className="text-[12.5px] font-bold text-muted">
                    {cat.over ? 'Over by' : 'Left'}
                  </div>
                  <div
                    className="text-[30px] font-extrabold tracking-[-1px]"
                    style={{ color: cat.over ? 'var(--bad)' : 'var(--text)' }}
                  >
                    {cat.over ? money(-cat.remaining) : money(cat.remaining)}
                  </div>
                </div>
                <div className="text-right text-[13px] text-muted">
                  <div>{money(cat.spent)} spent</div>
                  <div>of {money(cat.budget, { cents: false })}</div>
                </div>
              </div>
              <div className="relative">
                <ProgressBar value={cat.spent} max={cat.budget} color={cat.color} height={10} />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-5 pb-7 pt-[18px]">
            <SectionLabel>
              {txs.length} transaction{txs.length !== 1 ? 's' : ''}
            </SectionLabel>
            <Card className="p-1.5">
              {txs.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted">No spending yet.</div>
              ) : (
                txs.map((t, i) => (
                  <div key={t.id}>
                    {i > 0 && <div className="mx-3 h-px bg-border" />}
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        onEditTx(t)
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2 py-[11px] text-left transition-transform active:scale-[0.98]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-[14.5px] font-bold text-text">
                          {t.note || cat.name}
                          {t.recurring && (
                            <span className="inline-flex text-faint">
                              <Icon name="repeat" size={12} />
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted">{fmtDay(t.date)}</div>
                      </div>
                      <div className="text-[15px] font-extrabold text-text">{money(t.amount)}</div>
                    </button>
                  </div>
                ))
              )}
            </Card>
          </div>
        </>
      )}
    </Sheet>
  )
}
