// Streaks & momentum — the gamified layer. All derived client-side from the
// month's transactions (nothing stored).

import { daysInMonth, monthOf } from './money'
import type { DayState, Momentum, MomentumDay, Transaction } from './types'

/**
 * A day is "clear" (no spend), "ontrack" (spent ≤ daily allowance), or "over".
 * The streak counts consecutive non-over days ending today — it rewards staying
 * on pace, not only zero-spend days.
 */
export function computeMomentum(
  transactions: Transaction[],
  monthKey: string,
  today: string,
  totalBudget: number,
): Momentum {
  const dim = daysInMonth(monthKey)
  const isLive = monthKey === monthOf(today)
  const isFuture = monthKey > monthOf(today)
  const lastDay = isFuture ? 0 : isLive ? Number(today.split('-')[2]) : dim
  const dailyAllowance = dim ? totalBudget / dim : 0

  const spendByDay = new Array(dim + 1).fill(0)
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    const d = Number(t.date.split('-')[2])
    if (d >= 1 && d <= dim) spendByDay[d] += t.amount
  }

  const days: MomentumDay[] = []
  for (let d = 1; d <= dim; d++) {
    const spend = spendByDay[d]
    let state: DayState
    if (d > lastDay) state = 'future'
    else if (spend === 0) state = 'clear'
    else if (dailyAllowance > 0 && spend <= dailyAllowance) state = 'ontrack'
    else state = 'over'
    days.push({ date: `${monthKey}-${String(d).padStart(2, '0')}`, day: d, spend, state })
  }

  // Current streak: walk back from the latest elapsed day while not "over".
  let streak = 0
  for (let i = lastDay - 1; i >= 0; i--) {
    if (days[i].state !== 'over') streak++
    else break
  }

  // Best on-pace run across elapsed days.
  let bestStreak = 0
  let run = 0
  for (let i = 0; i < lastDay; i++) {
    if (days[i].state !== 'over') {
      run++
      if (run > bestStreak) bestStreak = run
    } else run = 0
  }

  const noSpendDays = days.slice(0, lastDay).filter((x) => x.state === 'clear').length

  return { days, streak, noSpendDays, bestStreak, dailyAllowance, lastDay }
}
