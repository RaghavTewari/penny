// Client-side derived stats for the selected month. These are NOT stored —
// they're recomputed from the month's transactions (see README "Derived calculations").

import { daysInMonth, monthElapsed, monthOf } from './money'
import type { Category, MonthData, Pace, Transaction } from './types'

/**
 * Pace chip: compares spend fraction (spent/budget) to month-elapsed fraction.
 * Mirrors `computePace()` in the prototype.
 */
export function computePace(
  spentFrac: number,
  elapsed: number,
  isLive: boolean,
  over: boolean,
): Pace {
  if (over) return { label: 'Over budget', tone: 'bad' }
  if (!isLive) return { label: 'Came in under', tone: 'good' }
  const diff = spentFrac - elapsed
  if (diff > 0.08) return { label: 'Spending quickly', tone: 'warn' }
  if (diff < -0.08) return { label: 'Pacing nicely', tone: 'good' }
  return { label: 'Right on track', tone: 'good' }
}

/**
 * Derive per-category + monthly stats for `monthKey` from the given
 * categories and that month's transactions.
 */
export function derive(
  categories: Category[],
  transactions: Transaction[],
  monthKey: string,
  today: string,
): MonthData {
  const spentBy: Record<string, number> = {}
  let income = 0
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount
    else if (t.category_id) spentBy[t.category_id] = (spentBy[t.category_id] ?? 0) + t.amount
  }

  const catStats = categories.map((c) => {
    const spent = spentBy[c.id] ?? 0
    const remaining = c.budget - spent
    return {
      ...c,
      spent,
      remaining,
      pct: c.budget ? spent / c.budget : 0,
      over: spent > c.budget,
    }
  })

  const totalBudget = categories.reduce((s, c) => s + c.budget, 0)
  const totalSpent = catStats.reduce((s, c) => s + c.spent, 0)
  const isLive = monthKey === monthOf(today)
  const elapsed = monthElapsed(monthKey, today)
  const over = totalSpent > totalBudget
  const dim = daysInMonth(monthKey)
  const dayOfMonth = isLive ? Number(today.split('-')[2]) : dim
  const dailyAvg = dayOfMonth ? totalSpent / dayOfMonth : 0

  return {
    month: monthKey,
    catStats,
    totalBudget,
    totalSpent,
    totalRemaining: totalBudget - totalSpent,
    income,
    net: income - totalSpent,
    isLive,
    elapsed,
    daysInMonth: dim,
    dayOfMonth,
    dailyAvg,
    projected: dailyAvg * dim,
    pace: computePace(totalBudget ? totalSpent / totalBudget : 0, elapsed, isLive, over),
  }
}
