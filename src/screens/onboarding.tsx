// First-run setup — a new user sets their own monthly budgets (and optional
// income) instead of inheriting preset amounts. Shown once, while every
// category budget is still $0.

import { useMemo, useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { CategoryBadge } from '@/components/ui/category-badge'
import { SectionLabel } from '@/components/ui/section-label'
import { useAddTransaction, useCategories, useUpdateBudgets } from '@/hooks/useBudget'
import { money, todayISO } from '@/lib/money'
import { INCOME_CAT } from '@/lib/types'

function AmountRow({
  emoji,
  color,
  name,
  value,
  onChange,
}: {
  emoji: string
  color: string
  name: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <CategoryBadge emoji={emoji} color={color} size={40} />
      <span className="flex-1 text-[15px] font-bold text-text">{name}</span>
      <div className="flex w-[130px] items-center rounded-tile border border-border bg-surface px-3 py-2 focus-within:border-accent">
        <span className="mr-1 text-muted">$</span>
        <input
          inputMode="decimal"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
          className="w-full bg-transparent text-right text-[15px] font-bold text-text outline-none placeholder:text-faint"
        />
      </div>
    </div>
  )
}

export function Onboarding() {
  const { data: categories = [] } = useCategories()
  const updateBudgets = useUpdateBudgets()
  const addTx = useAddTransaction()

  const [amounts, setAmounts] = useState<Record<string, string>>({})
  const [income, setIncome] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalBudget = useMemo(
    () => categories.reduce((s, c) => s + (parseFloat(amounts[c.id]) || 0), 0),
    [categories, amounts],
  )
  const canStart = totalBudget > 0 && !busy

  const setAmount = (id: string, v: string) => setAmounts((a) => ({ ...a, [id]: v }))

  async function start() {
    if (!canStart) return
    setBusy(true)
    setError(null)
    try {
      // Income first so the screen stays mounted until budgets flip the gate.
      const inc = Math.round((parseFloat(income) || 0) * 100) / 100
      if (inc > 0) {
        await addTx.mutateAsync({
          type: 'income',
          amount: inc,
          category_id: null,
          note: 'Monthly income',
          date: todayISO(),
          recurring: true,
        })
      }
      await updateBudgets.mutateAsync(
        categories.map((c) => ({ id: c.id, budget: Math.round(parseFloat(amounts[c.id]) || 0) })),
      )
      // useCategories invalidates → the gate re-renders into the app.
    } catch (e) {
      setBusy(false)
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.')
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-[440px] flex-col bg-bg text-text">
      <div className="flex-1 overflow-y-auto px-6 pt-[max(24px,env(safe-area-inset-top))] pb-4">
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className="mb-4 flex size-16 items-center justify-center rounded-[20px] text-accent-ink"
            style={{ background: 'var(--accent)' }}
          >
            <Icon name="wallet" size={32} stroke={2.2} />
          </div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.6px]">Set up your budget</h1>
          <p className="mt-1 text-sm text-muted">
            Enter a monthly limit for each category. You can change these anytime in Settings.
          </p>
        </div>

        <SectionLabel>Monthly income (optional)</SectionLabel>
        <div className="mb-5">
          <AmountRow
            emoji={INCOME_CAT.emoji}
            color={INCOME_CAT.color}
            name="Income"
            value={income}
            onChange={setIncome}
          />
        </div>

        <SectionLabel>Category budgets</SectionLabel>
        <div>
          {categories.map((c) => (
            <AmountRow
              key={c.id}
              emoji={c.emoji}
              color={c.color}
              name={c.name}
              value={amounts[c.id] ?? ''}
              onChange={(v) => setAmount(c.id, v)}
            />
          ))}
        </div>

        {error && <div className="mt-3 text-center text-[13px] font-semibold text-bad">{error}</div>}
      </div>

      <div className="border-t border-border bg-bg px-6 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-bold text-muted">Total monthly budget</span>
          <span className="font-extrabold text-text">{money(totalBudget, { cents: false })}</span>
        </div>
        <button
          type="button"
          onClick={start}
          disabled={!canStart}
          className="w-full rounded-2xl py-[15px] text-[16.5px] font-extrabold transition-colors"
          style={{
            background: canStart ? 'var(--accent)' : 'var(--surface-2)',
            color: canStart ? 'var(--accent-ink)' : 'var(--faint)',
          }}
        >
          {busy ? 'Setting up…' : 'Start budgeting'}
        </button>
      </div>
    </div>
  )
}
