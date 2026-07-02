// Resolve the badge/name to show for a transaction: income uses the fixed
// income pseudo-category; expenses use their category (falling back gracefully
// if a category was deleted).

import { INCOME_CAT } from './types'
import type { Category, Transaction } from './types'

export type DisplayCat = { name: string; emoji: string; color: string }

const FALLBACK: DisplayCat = { name: 'Uncategorized', emoji: '🏷️', color: '#B7AC9E' }

/** Build a resolver from the user's categories. */
export function makeCatResolver(categories: Category[]) {
  const byId = new Map(categories.map((c) => [c.id, c]))
  return (t: Transaction): DisplayCat => {
    if (t.type === 'income') return INCOME_CAT
    const c = t.category_id ? byId.get(t.category_id) : undefined
    return c ?? FALLBACK
  }
}
