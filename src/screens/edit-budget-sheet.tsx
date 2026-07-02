// Edit Budget — set a category's monthly limit with the shared keypad.

import { useEffect, useState } from 'react'
import { Sheet } from '@/components/ui/sheet'
import { Icon } from '@/components/ui/icon'
import { CategoryBadge } from '@/components/ui/category-badge'
import { Keypad } from '@/components/keypad'
import type { CategoryStat } from '@/lib/types'

type EditBudgetSheetProps = {
  open: boolean
  cat: CategoryStat | null
  onClose: () => void
  onSave: (id: string, budget: number) => void
}

export function EditBudgetSheet({ open, cat, onClose, onSave }: EditBudgetSheetProps) {
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (open && cat) setAmount(String(cat.budget))
  }, [open, cat])

  const val = parseFloat(amount) || 0

  const press = (k: string) => {
    setAmount((a) => {
      if (k === 'del') return a.slice(0, -1)
      if (k === '.') return a.includes('.') ? a : a === '' ? '0.' : a + '.'
      if (a.includes('.') && a.split('.')[1].length >= 2) return a
      if (a === '0' && k !== '.') return k
      return a + k
    })
  }

  return (
    <Sheet open={open} onClose={onClose} height="72%">
      {cat && (
        <>
          <div className="flex items-center gap-3 px-5 pt-3.5">
            <CategoryBadge emoji={cat.emoji} color={cat.color} size={44} />
            <div className="flex-1">
              <div className="text-[17px] font-extrabold text-text">{cat.name} budget</div>
              <div className="text-[13px] text-muted">Monthly limit</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-muted"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="py-6 text-center">
            <div className="text-[48px] font-extrabold tracking-[-1.5px] text-text">
              <span className="align-[6px] text-[28px]" style={{ color: cat.color }}>
                $
              </span>
              {amount === '' ? '0' : amount}
            </div>
          </div>

          <div className="flex-1" />

          <div className="px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2">
            <Keypad onPress={press} />
            <button
              type="button"
              onClick={() => onSave(cat.id, Math.round(val))}
              disabled={val <= 0}
              className="mt-2.5 w-full rounded-2xl py-[15px] text-[16.5px] font-extrabold transition-colors"
              style={{
                background: val > 0 ? 'var(--accent)' : 'var(--surface-2)',
                color: val > 0 ? '#fff' : 'var(--faint)',
              }}
            >
              Save budget
            </button>
          </div>
        </>
      )}
    </Sheet>
  )
}
