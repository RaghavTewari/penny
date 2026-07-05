// Settings — profile, appearance, category budgets, recurring items.

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { SectionLabel } from '@/components/ui/section-label'
import { Icon } from '@/components/ui/icon'
import { CategoryBadge } from '@/components/ui/category-badge'
import { PennyMascot } from '@/components/penny-mascot'
import { EditBudgetSheet } from '@/screens/edit-budget-sheet'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useAccent } from '@/hooks/useAccent'
import { useCategories, useMonthData, useTransactions, useUpdateBudget } from '@/hooks/useBudget'
import { makeCatResolver } from '@/lib/categories'
import { money } from '@/lib/money'
import type { CategoryStat } from '@/lib/types'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="flex rounded-full bg-surface-2 p-[3px]">
      {(['light', 'dark'] as const).map((k) => {
        const sel = theme === k
        return (
          <button
            key={k}
            type="button"
            onClick={() => setTheme(k)}
            className="rounded-full px-4 py-[7px] text-[13.5px] font-bold transition-colors"
            style={{
              background: sel ? 'var(--surface)' : 'transparent',
              color: sel ? 'var(--text)' : 'var(--muted)',
              boxShadow: sel ? 'var(--shadow-soft-sm)' : 'none',
            }}
          >
            {k === 'light' ? 'Light' : 'Dark'}
          </button>
        )
      })}
    </div>
  )
}

function AccentSwatches() {
  const { accent, setAccent, options } = useAccent()
  return (
    <div className="flex gap-2">
      {options.map((c) => {
        const sel = c.toLowerCase() === accent.toLowerCase()
        return (
          <button
            key={c}
            type="button"
            onClick={() => setAccent(c)}
            aria-label={`Accent ${c}`}
            className="size-6 rounded-full transition-transform active:scale-90"
            style={{
              background: c,
              boxShadow: sel ? `0 0 0 2px var(--surface), 0 0 0 4px ${c}` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

export function Settings({ month }: { month: string }) {
  const { signOut } = useAuth()
  const { theme } = useTheme()
  const { data: d, isLoading } = useMonthData(month)
  const { data: categories = [] } = useCategories()
  const { data: txs = [] } = useTransactions(month)
  const updateBudget = useUpdateBudget()

  const [budgetCat, setBudgetCat] = useState<CategoryStat | null>(null)
  const [budgetOpen, setBudgetOpen] = useState(false)

  const resolve = useMemo(() => makeCatResolver(categories), [categories])
  const recurring = useMemo(() => txs.filter((t) => t.recurring), [txs])

  if (isLoading || !d) {
    return <div className="flex h-full items-center justify-center text-sm text-muted">Loading…</div>
  }

  const openBudget = (c: CategoryStat) => {
    setBudgetCat(c)
    setBudgetOpen(true)
  }

  return (
    <div className="px-4 pb-2">
      <div className="mb-[18px] text-[23px] font-extrabold tracking-[-0.5px] text-text">Settings</div>

      {/* Profile */}
      <Card className="mb-[22px] flex items-center gap-3">
        <PennyMascot mood="happy" size={52} />
        <div className="flex-1">
          <div className="text-[17px] font-extrabold text-text">Your budget</div>
          <div className="text-[13px] text-muted">
            {money(d.totalBudget, { cents: false })}/mo · {categories.length} categories
          </div>
        </div>
        <div className="inline-flex rounded-full bg-good-soft px-2.5 py-[5px] text-xs font-extrabold text-good">
          CAD
        </div>
      </Card>

      {/* Appearance */}
      <SectionLabel>Appearance</SectionLabel>
      <Card className="mb-[22px] p-3.5">
        <div className="flex items-center gap-3">
          <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={20} className="text-muted" />
          <span className="flex-1 text-[15px] font-bold text-text">Theme</span>
          <ThemeToggle />
        </div>
        <div className="my-3 h-px bg-border" />
        <div className="flex items-center gap-3">
          <span className="size-5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="flex-1 text-[15px] font-bold text-text">Accent</span>
          <AccentSwatches />
        </div>
      </Card>

      {/* Category budgets */}
      <SectionLabel>Category budgets</SectionLabel>
      <Card className="mb-[22px] p-1.5">
        {d.catStats.map((c, i) => (
          <div key={c.id}>
            {i > 0 && <div className="ml-[58px] mr-1 h-px bg-border" />}
            <button
              type="button"
              onClick={() => openBudget(c)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-transform active:scale-[0.98]"
            >
              <CategoryBadge emoji={c.emoji} color={c.color} size={40} />
              <div className="flex-1">
                <div className="text-[14.5px] font-bold text-text">{c.name}</div>
                <div className="text-xs text-muted">{money(c.spent, { cents: false })} spent</div>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-extrabold text-text">
                  {money(c.budget, { cents: false })}
                </div>
                <div className="text-[11px] font-bold text-faint">edit ›</div>
              </div>
            </button>
          </div>
        ))}
        <div className="mx-1 h-px bg-border" />
        <div className="flex items-center px-2 py-3">
          <span className="flex-1 text-[14.5px] font-extrabold text-text">Total monthly budget</span>
          <span className="text-[15.5px] font-extrabold text-accent">
            {money(d.totalBudget, { cents: false })}
          </span>
        </div>
      </Card>

      {/* Recurring */}
      <SectionLabel>Recurring · {recurring.length}</SectionLabel>
      <Card className="mb-[22px] p-1.5">
        {recurring.length === 0 ? (
          <div className="py-5 text-center text-sm text-muted">No recurring items.</div>
        ) : (
          recurring.map((t, i) => {
            const cat = resolve(t)
            return (
              <div key={t.id}>
                {i > 0 && <div className="ml-[52px] mr-1 h-px bg-border" />}
                <div className="flex items-center gap-2.5 px-2 py-[11px]">
                  <CategoryBadge emoji={cat.emoji} color={cat.color} size={36} />
                  <div className="flex-1">
                    <div className="text-[14.5px] font-bold text-text">{t.note || cat.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Icon name="repeat" size={12} /> Monthly · {cat.name}
                    </div>
                  </div>
                  <div
                    className="text-[14.5px] font-extrabold"
                    style={{ color: t.type === 'income' ? 'var(--good)' : 'var(--text)' }}
                  >
                    {t.type === 'income' ? '+' : ''}
                    {money(t.amount, { cents: false })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </Card>

      <button
        type="button"
        onClick={signOut}
        className="mb-3 w-full rounded-card border border-border bg-surface p-3.5 text-[14.5px] font-bold text-bad shadow-[var(--shadow-soft-sm)]"
      >
        Sign out
      </button>

      <div className="py-2 text-center text-xs text-faint">Penny · single-user</div>

      <EditBudgetSheet
        open={budgetOpen}
        cat={budgetCat}
        onClose={() => setBudgetOpen(false)}
        onSave={(id, budget) => {
          updateBudget.mutate({ id, budget })
          setBudgetOpen(false)
        }}
      />
    </div>
  )
}
