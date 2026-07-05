// Add / Edit transaction — the core loop. Log a spend (or income) in seconds,
// then the app jumps to that transaction's month and returns Home so the impact
// is visible immediately.

import { useEffect, useMemo, useState } from 'react'
import { Sheet } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Icon } from '@/components/ui/icon'
import { Keypad } from '@/components/keypad'
import { tint } from '@/lib/color'
import { money, monthOf, todayISO } from '@/lib/money'
import {
  useAddTransaction,
  useCategories,
  useDeleteTransaction,
  useUpdateTransaction,
} from '@/hooks/useBudget'
import type { Transaction, TxType } from '@/lib/types'
import type { TxInput } from '@/lib/db'

type AddSheetProps = {
  open: boolean
  editTx: Transaction | null
  /** Currently selected month (drives the default date for a new tx). */
  selectedMonth: string
  onClose: () => void
  /** Called after a NEW transaction is saved, with its month. */
  onSaved: (month: string) => void
  /** Open the add-category sheet (from the category grid). */
  onAddCategory: () => void
}

function yesterdayOf(today: string): string {
  const d = new Date(today + 'T00:00:00')
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function AddSheet({
  open,
  editTx,
  selectedMonth,
  onClose,
  onSaved,
  onAddCategory,
}: AddSheetProps) {
  const today = todayISO()
  const { data: categories = [] } = useCategories()
  const add = useAddTransaction()
  const update = useUpdateTransaction()
  const del = useDeleteTransaction(editTx ? monthOf(editTx.date) : selectedMonth)

  const isEdit = !!editTx
  const [type, setType] = useState<TxType>('expense')
  const [amount, setAmount] = useState('')
  const [catId, setCatId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(today)
  const [recurring, setRecurring] = useState(false)

  // Hydrate on open (new vs edit).
  useEffect(() => {
    if (!open) return
    if (editTx) {
      setType(editTx.type)
      setAmount(String(editTx.amount))
      setCatId(editTx.category_id ?? categories[0]?.id ?? null)
      setNote(editTx.note ?? '')
      setDate(editTx.date)
      setRecurring(editTx.recurring)
    } else {
      setType('expense')
      setAmount('')
      setCatId(categories[0]?.id ?? null)
      setNote('')
      setDate(selectedMonth === monthOf(today) ? today : `${selectedMonth}-15`)
      setRecurring(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editTx])

  // Default the category once categories load (new expense).
  useEffect(() => {
    if (open && !isEdit && !catId && categories[0]) setCatId(categories[0].id)
  }, [open, isEdit, catId, categories])

  const val = parseFloat(amount) || 0
  const valid = val > 0
  const accent = type === 'income' ? 'var(--good)' : 'var(--accent)'
  const yesterday = useMemo(() => yesterdayOf(today), [today])

  const press = (k: string) => {
    setAmount((a) => {
      if (k === 'del') return a.slice(0, -1)
      if (k === '.') return a.includes('.') ? a : a === '' ? '0.' : a + '.'
      if (a.includes('.') && a.split('.')[1].length >= 2) return a
      if (a === '0' && k !== '.') return k
      return a + k
    })
  }

  const submit = () => {
    if (!valid) return
    const input: TxInput = {
      type,
      amount: Math.round(val * 100) / 100,
      category_id: type === 'income' ? null : catId,
      note: note.trim(),
      date,
      recurring,
    }
    if (editTx) {
      update.mutate({ id: editTx.id, input })
      onClose()
    } else {
      add.mutate(input)
      onSaved(monthOf(date))
    }
  }

  const remove = () => {
    if (!editTx) return
    del.mutate(editTx.id)
    onClose()
  }

  const primaryLabel = isEdit ? 'Save changes' : type === 'income' ? 'Add income' : 'Log spend'

  return (
    <Sheet open={open} onClose={onClose} height="95%">
      {/* Header: type toggle + close */}
      <div className="flex items-center gap-2.5 px-[18px] pt-3">
        <div className="flex max-w-[220px] flex-1 rounded-full bg-surface-2 p-[3px]">
          {(['expense', 'income'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setType(k)}
              className="flex-1 rounded-full py-[7px] text-sm font-bold transition-colors"
              style={{
                background:
                  type === k ? (k === 'income' ? 'var(--good)' : 'var(--accent)') : 'transparent',
                color: type === k ? '#fff' : 'var(--muted)',
              }}
            >
              {k === 'expense' ? 'Expense' : 'Income'}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-muted"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      {/* Amount display */}
      <div className="py-5 text-center">
        <div
          className="text-[52px] font-extrabold leading-none tracking-[-2px]"
          style={{ color: valid ? 'var(--text)' : 'var(--faint)' }}
        >
          <span
            className="mr-px align-[6px] text-[30px]"
            style={{ color: valid ? accent : 'var(--faint)' }}
          >
            $
          </span>
          {amount === '' ? '0' : amount}
        </div>
      </div>

      {/* Scrollable middle */}
      <div className="flex-1 overflow-auto px-[18px]">
        {type === 'expense' && (
          <>
            <div className="px-1 pb-2.5 text-[12.5px] font-bold uppercase tracking-[0.06em] text-faint">
              Category
            </div>
            <div className="mb-[18px] grid grid-cols-4 gap-2">
              {categories.map((c) => {
                const sel = c.id === catId
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCatId(c.id)}
                    className="flex flex-col items-center gap-[5px] rounded-2xl px-1 py-2.5 transition-colors"
                    style={{
                      border: `1.5px solid ${sel ? c.color : 'var(--border)'}`,
                      background: sel ? tint(c.color, 0.12) : 'var(--surface)',
                    }}
                  >
                    <span className="text-[22px] leading-none">{c.emoji}</span>
                    <span
                      className="text-center text-[10.5px] font-bold leading-tight"
                      style={{ color: sel ? 'var(--text)' : 'var(--muted)' }}
                    >
                      {c.name}
                    </span>
                  </button>
                )
              })}
              <button
                type="button"
                onClick={onAddCategory}
                className="flex flex-col items-center gap-[5px] rounded-2xl border-[1.5px] border-dashed border-[color:var(--border)] px-1 py-2.5 text-muted"
              >
                <span className="flex size-[22px] items-center justify-center text-accent">
                  <Icon name="plus" size={20} stroke={2.4} />
                </span>
                <span className="text-center text-[10.5px] font-bold leading-tight">New</span>
              </button>
            </div>
          </>
        )}

        <div className="px-1 pb-2.5 text-[12.5px] font-bold uppercase tracking-[0.06em] text-faint">
          Details
        </div>
        <div className="mb-4 overflow-hidden rounded-[18px] border border-border bg-surface">
          {/* Note */}
          <div className="flex items-center gap-2.5 px-3.5 py-3">
            <Icon name="note" size={18} className="text-faint" />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={type === 'income' ? 'e.g. Paycheque' : 'Add a note'}
              className="flex-1 bg-transparent text-[15px] font-semibold text-text outline-none placeholder:text-faint"
            />
          </div>
          <div className="ml-11 h-px bg-border" />
          {/* Date */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5">
            <Icon name="calendar" size={18} className="text-faint" />
            <div className="flex flex-1 flex-wrap items-center gap-[7px]">
              <DatePill active={date === today} onClick={() => setDate(today)}>
                Today
              </DatePill>
              <DatePill active={date === yesterday} onClick={() => setDate(yesterday)}>
                Yesterday
              </DatePill>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-full border border-border bg-surface-2 px-2.5 py-[5px] text-[13px] font-semibold text-muted outline-none"
              />
            </div>
          </div>
          <div className="ml-11 h-px bg-border" />
          {/* Recurring */}
          <button
            type="button"
            onClick={() => setRecurring((r) => !r)}
            className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
          >
            <Icon name="repeat" size={18} className="text-faint" />
            <span className="flex-1 text-[14.5px] font-semibold text-text">Repeats monthly</span>
            <Switch on={recurring} />
          </button>
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={remove}
            className="mb-2 flex w-full items-center justify-center gap-[7px] rounded-tile border border-border py-[13px] text-[14.5px] font-bold text-bad"
          >
            <Icon name="trash" size={17} /> Delete transaction
          </button>
        )}
      </div>

      {/* Keypad + save */}
      <div className="border-t border-border bg-bg px-3.5 pb-[max(14px,env(safe-area-inset-bottom))] pt-2">
        <Keypad onPress={press} />
        <button
          type="button"
          onClick={submit}
          disabled={!valid}
          className="mt-2.5 w-full rounded-2xl py-[15px] text-[16.5px] font-extrabold transition-colors"
          style={{
            background: valid ? accent : 'var(--surface-2)',
            color: valid ? '#fff' : 'var(--faint)',
            boxShadow: valid ? 'var(--shadow-soft-sm)' : 'none',
          }}
        >
          {primaryLabel}
          {valid ? ` · ${money(val)}` : ''}
        </button>
      </div>
    </Sheet>
  )
}

function DatePill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors"
      style={{
        background: active ? 'var(--accent)' : 'var(--surface-2)',
        color: active ? 'var(--accent-ink)' : 'var(--muted)',
      }}
    >
      {children}
    </button>
  )
}
