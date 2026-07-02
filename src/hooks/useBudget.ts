// Query + mutation hooks for categories, a month's transactions, the derived
// month stats, and optimistic transaction/budget mutations.

import { useMemo } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import {
  deleteTransaction,
  getCategories,
  getHistory,
  getTransactions,
  insertTransaction,
  seedSampleData,
  updateBudget,
  updateTransaction,
  type TxInput,
} from '@/lib/db'
import { derive } from '@/lib/derive'
import { todayISO } from '@/lib/money'
import type { Category, MonthData, Transaction } from '@/lib/types'

export const qk = {
  categories: ['categories'] as const,
  transactions: (month: string) => ['transactions', month] as const,
  history: ['history'] as const,
}

export function useCategories() {
  return useQuery({ queryKey: qk.categories, queryFn: getCategories })
}

export function useTransactions(month: string) {
  return useQuery({
    queryKey: qk.transactions(month),
    queryFn: () => getTransactions(month),
  })
}

/** Per-month spent/income totals (for the Insights trend + deltas). */
export function useHistory() {
  return useQuery({ queryKey: qk.history, queryFn: getHistory })
}

/** Invalidate everything derived from transactions (month lists + history). */
function invalidateTxData(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: ['transactions'] })
  qc.invalidateQueries({ queryKey: qk.history })
}

/** Categories + this month's transactions, combined into derived stats. */
export function useMonthData(month: string): {
  data: MonthData | undefined
  isLoading: boolean
  isError: boolean
  hasTransactions: boolean
} {
  const cats = useCategories()
  const txs = useTransactions(month)
  const today = todayISO()

  const data = useMemo(() => {
    if (!cats.data || !txs.data) return undefined
    return derive(cats.data, txs.data, month, today)
  }, [cats.data, txs.data, month, today])

  return {
    data,
    isLoading: cats.isLoading || txs.isLoading,
    isError: cats.isError || txs.isError,
    hasTransactions: (txs.data?.length ?? 0) > 0,
  }
}

// ── Mutations (optimistic, for the "instant impact" feel) ──────────

function patchMonth(
  qc: QueryClient,
  month: string,
  fn: (list: Transaction[]) => Transaction[],
) {
  qc.setQueryData<Transaction[]>(qk.transactions(month), (prev) => fn(prev ?? []))
}

export function useAddTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: TxInput) => insertTransaction(input),
    onMutate: async (input) => {
      const month = input.date.slice(0, 7)
      await qc.cancelQueries({ queryKey: qk.transactions(month) })
      const prev = qc.getQueryData<Transaction[]>(qk.transactions(month))
      const optimistic: Transaction = { id: `optimistic-${Date.now()}`, ...input }
      patchMonth(qc, month, (list) => [optimistic, ...list])
      return { month, prev, tempId: optimistic.id }
    },
    onError: (_e, _input, ctx) => {
      if (ctx) qc.setQueryData(qk.transactions(ctx.month), ctx.prev)
    },
    onSuccess: (saved, _input, ctx) => {
      if (ctx) {
        patchMonth(qc, ctx.month, (list) =>
          list.map((t) => (t.id === ctx.tempId ? saved : t)),
        )
      }
    },
    onSettled: () => invalidateTxData(qc),
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TxInput }) =>
      updateTransaction(id, input),
    // Invalidate all months: an edit can move a tx to a different month.
    onSettled: () => invalidateTxData(qc),
  })
}

export function useDeleteTransaction(month: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.transactions(month) })
      const prev = qc.getQueryData<Transaction[]>(qk.transactions(month))
      patchMonth(qc, month, (list) => list.filter((t) => t.id !== id))
      return { prev }
    },
    onError: (_e, _id, ctx) => {
      if (ctx) qc.setQueryData(qk.transactions(month), ctx.prev)
    },
    onSettled: () => invalidateTxData(qc),
  })
}

export function useUpdateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, budget }: { id: string; budget: number }) =>
      updateBudget(id, budget),
    onMutate: async ({ id, budget }) => {
      await qc.cancelQueries({ queryKey: qk.categories })
      const prev = qc.getQueryData<Category[]>(qk.categories)
      qc.setQueryData<Category[]>(qk.categories, (list) =>
        (list ?? []).map((c) => (c.id === id ? { ...c, budget } : c)),
      )
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx) qc.setQueryData(qk.categories, ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.categories })
    },
  })
}

export function useSeedSample() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => seedSampleData(),
    onSuccess: () => invalidateTxData(qc),
  })
}
