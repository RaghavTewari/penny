// Sample June/May 2026 transactions from the prototype (src/data.jsx).
// Used by the "Load sample data" action so a fresh account can see a
// populated month that matches the design. Categories are referenced by
// name and resolved to the signed-in user's seeded category IDs.

import type { TxType } from './types'

export type SampleTx = {
  date: string
  category: string | null // category name, or null for income
  amount: number
  note: string
  recurring?: boolean
  type?: TxType
}

export const SAMPLE_TX: SampleTx[] = [
  // ── June 2026 (current month) ──
  { date: '2026-06-01', category: 'Rent', amount: 1850, note: 'Monthly rent', recurring: true },
  { date: '2026-06-01', category: 'Subscriptions', amount: 11.29, note: 'Spotify', recurring: true },
  { date: '2026-06-01', category: 'Subscriptions', amount: 20.99, note: 'Netflix', recurring: true },
  { date: '2026-06-05', category: 'Subscriptions', amount: 3.99, note: 'iCloud+', recurring: true },
  { date: '2026-06-15', category: 'Subscriptions', amount: 5.0, note: 'NYT', recurring: true },
  { date: '2026-06-03', category: 'Groceries', amount: 58.2, note: 'Metro' },
  { date: '2026-06-08', category: 'Groceries', amount: 121.4, note: 'Costco run' },
  { date: '2026-06-14', category: 'Groceries', amount: 92.15, note: 'No Frills' },
  { date: '2026-06-18', category: 'Groceries', amount: 36.5, note: 'Farmers market' },
  { date: '2026-06-22', category: 'Groceries', amount: 84.3, note: 'Loblaws' },
  { date: '2026-06-06', category: 'Eating out', amount: 41.2, note: 'Sunday brunch' },
  { date: '2026-06-12', category: 'Eating out', amount: 38.4, note: 'Thai takeout' },
  { date: '2026-06-16', category: 'Eating out', amount: 9.75, note: 'Coffee + bagel' },
  { date: '2026-06-21', category: 'Eating out', amount: 52.0, note: 'Sushi w/ Sam' },
  { date: '2026-06-09', category: 'Transport', amount: 22.6, note: 'Uber home' },
  { date: '2026-06-20', category: 'Transport', amount: 40.0, note: 'Presto top-up' },
  { date: '2026-06-11', category: 'Shopping', amount: 24.85, note: 'Phone case' },
  { date: '2026-06-19', category: 'Shopping', amount: 78.0, note: 'Uniqlo' },
  { date: '2026-06-13', category: 'Health', amount: 28.4, note: 'Pharmacy' },
  { date: '2026-06-07', category: 'Fun', amount: 34.0, note: 'Mini golf' },
  { date: '2026-06-17', category: 'Fun', amount: 96.0, note: 'Concert tickets' },
  { date: '2026-06-13', category: null, amount: 2160, note: 'Paycheque', recurring: true, type: 'income' },
  { date: '2026-06-10', category: null, amount: 120, note: 'Tutoring', type: 'income' },

  // ── May 2026 (history) ──
  { date: '2026-05-01', category: 'Rent', amount: 1850, note: 'Monthly rent', recurring: true },
  { date: '2026-05-01', category: 'Subscriptions', amount: 11.29, note: 'Spotify', recurring: true },
  { date: '2026-05-01', category: 'Subscriptions', amount: 20.99, note: 'Netflix', recurring: true },
  { date: '2026-05-04', category: 'Groceries', amount: 76.1, note: 'Loblaws' },
  { date: '2026-05-11', category: 'Groceries', amount: 64.55, note: 'No Frills' },
  { date: '2026-05-19', category: 'Groceries', amount: 138.2, note: 'Costco run' },
  { date: '2026-05-26', category: 'Groceries', amount: 71.4, note: 'Metro' },
  { date: '2026-05-09', category: 'Eating out', amount: 62.0, note: 'Birthday dinner' },
  { date: '2026-05-15', category: 'Eating out', amount: 44.3, note: 'Ramen night' },
  { date: '2026-05-23', category: 'Eating out', amount: 88.5, note: 'Date night' },
  { date: '2026-05-06', category: 'Transport', amount: 40.0, note: 'Presto top-up' },
  { date: '2026-05-21', category: 'Transport', amount: 51.2, note: 'Airport taxi' },
  { date: '2026-05-13', category: 'Shopping', amount: 210.0, note: 'Running shoes' },
  { date: '2026-05-28', category: 'Fun', amount: 120.0, note: 'Blue Jays game' },
  { date: '2026-05-17', category: 'Health', amount: 95.0, note: 'Dentist copay' },
  { date: '2026-05-15', category: null, amount: 2160, note: 'Paycheque', recurring: true, type: 'income' },
  { date: '2026-05-30', category: null, amount: 2160, note: 'Paycheque', recurring: true, type: 'income' },
]

/** The "today" the design assumes (Day 24 of June). */
export const DEMO_TODAY = '2026-06-24'
export const DEMO_MONTH = '2026-06'
