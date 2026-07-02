// Typed data layer — every Supabase call lives behind this module.
// Rows are scoped to the signed-in user by RLS; we set user_id on insert.

import { supabase } from './supabase'
import { addMonth } from './money'
import { SAMPLE_TX } from './sampleData'
import type {
  Category,
  CategoryRow,
  Transaction,
  TransactionRow,
  TxType,
} from './types'

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    color: row.color,
    budget: Number(row.budget),
    sort_order: row.sort_order,
  }
}

function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type as TxType,
    amount: Number(row.amount),
    category_id: row.category_id,
    note: row.note,
    date: row.date,
    recurring: row.recurring,
  }
}

async function currentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw error ?? new Error('Not signed in')
  return data.user.id
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapCategory)
}

export type MonthTotal = { key: string; spent: number; income: number }

/** Per-month spent/income totals across all of the user's transactions. */
export async function getHistory(): Promise<MonthTotal[]> {
  const { data, error } = await supabase.from('transactions').select('date, amount, type')
  if (error) throw error
  const map = new Map<string, MonthTotal>()
  for (const r of data ?? []) {
    const key = (r.date as string).slice(0, 7)
    const m = map.get(key) ?? { key, spent: 0, income: 0 }
    if (r.type === 'income') m.income += Number(r.amount)
    else m.spent += Number(r.amount)
    map.set(key, m)
  }
  return [...map.values()].sort((a, b) => (a.key < b.key ? -1 : 1))
}

/** All transactions whose `date` falls in the given YYYY-MM month. */
export async function getTransactions(month: string): Promise<Transaction[]> {
  const start = `${month}-01`
  const end = `${addMonth(month, 1)}-01`
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', start)
    .lt('date', end)
    .order('date', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapTransaction)
}

export type TxInput = {
  type: TxType
  amount: number
  category_id: string | null
  note: string
  date: string
  recurring: boolean
}

export async function insertTransaction(input: TxInput): Promise<Transaction> {
  const user_id = await currentUserId()
  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...input, user_id })
    .select('*')
    .single()
  if (error) throw error
  return mapTransaction(data)
}

export async function updateTransaction(
  id: string,
  input: TxInput,
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update(input)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return mapTransaction(data)
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}

export async function updateBudget(id: string, budget: number): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update({ budget })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return mapCategory(data)
}

/** Set budgets for many categories at once (used by first-run onboarding). */
export async function updateBudgets(updates: { id: string; budget: number }[]): Promise<void> {
  const results = await Promise.all(
    updates.map((u) => supabase.from('categories').update({ budget: u.budget }).eq('id', u.id)),
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

/**
 * One-off: load the prototype's June/May sample transactions for the current
 * user, resolving each sample's category name to the user's seeded category.
 */
export async function seedSampleData(): Promise<void> {
  const user_id = await currentUserId()

  // Idempotency guard: never seed on top of existing transactions.
  const { count, error: countErr } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
  if (countErr) throw countErr
  if ((count ?? 0) > 0) return

  const cats = await getCategories()
  const byName = new Map(cats.map((c) => [c.name, c.id]))

  const rows = SAMPLE_TX.map((s) => ({
    user_id,
    type: (s.type ?? 'expense') as TxType,
    amount: s.amount,
    category_id: s.category ? (byName.get(s.category) ?? null) : null,
    note: s.note,
    date: s.date,
    recurring: s.recurring ?? false,
  }))

  const { error } = await supabase.from('transactions').insert(rows)
  if (error) throw error
}
