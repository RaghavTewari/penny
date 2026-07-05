import type { Database } from './database.types'

export type CategoryRow = Database['public']['Tables']['categories']['Row']
export type TransactionRow = Database['public']['Tables']['transactions']['Row']

export type TxType = 'expense' | 'income'

/** App-facing category (the columns the UI cares about). */
export type Category = Pick<
  CategoryRow,
  'id' | 'name' | 'emoji' | 'color' | 'budget' | 'sort_order'
>

/** App-facing transaction. `date` is YYYY-MM-DD. */
export type Transaction = {
  id: string
  type: TxType
  amount: number
  category_id: string | null
  note: string
  date: string
  recurring: boolean
}

/** Fixed pseudo-category for income (not a DB row). */
export const INCOME_CAT = {
  id: 'income',
  name: 'Income',
  emoji: '💸',
  color: '#3FA873',
} as const

/** A category enriched with this month's spend stats. */
export type CategoryStat = Category & {
  spent: number
  remaining: number
  pct: number
  over: boolean
}

export type PaceTone = 'good' | 'warn' | 'bad'
export type Pace = { label: string; tone: PaceTone }

export type DayState = 'clear' | 'ontrack' | 'over' | 'future'
export type MomentumDay = { date: string; day: number; spend: number; state: DayState }
export type Momentum = {
  days: MomentumDay[]
  streak: number
  noSpendDays: number
  bestStreak: number
  dailyAllowance: number
  lastDay: number
}

export type MonthData = {
  month: string
  catStats: CategoryStat[]
  totalBudget: number
  totalSpent: number
  totalRemaining: number
  income: number
  net: number
  isLive: boolean
  elapsed: number
  daysInMonth: number
  dayOfMonth: number
  dailyAvg: number
  projected: number
  pace: Pace
  momentum: Momentum
  /** Remaining budget spread over the days left — "safe to spend today". */
  safeToday: number
}
