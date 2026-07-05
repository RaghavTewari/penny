// Add a category from anywhere (Home tile, log-spend grid) — no Settings trip.

import { useEffect, useState } from 'react'
import { Sheet } from '@/components/ui/sheet'
import { Icon } from '@/components/ui/icon'
import { CategoryBadge } from '@/components/ui/category-badge'
import { useAddCategory } from '@/hooks/useBudget'

const EMOJIS = [
  '🛒', '🍔', '🚗', '🏠', '💡', '📱', '🎬', '🎁', '✈️', '☕',
  '🏥', '📚', '👕', '🐶', '💪', '🎮', '🍺', '⛽', '🧾', '💅',
]
const COLORS = [
  '#5DA86A', '#6E7CE0', '#E0884F', '#4FA0C7', '#B071D0',
  '#E0A23C', '#E06A8B', '#4FB7A0', '#E0734E', '#7E8AA2',
]

export function AddCategorySheet({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated?: (id: string) => void
}) {
  const add = useAddCategory()
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJIS[0])
  const [color, setColor] = useState(COLORS[0])
  const [budget, setBudget] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setName('')
      setEmoji(EMOJIS[0])
      setColor(COLORS[0])
      setBudget('')
      setError(null)
    }
  }, [open])

  const canSave = name.trim().length > 0 && !add.isPending

  async function save() {
    if (!canSave) return
    setError(null)
    try {
      const cat = await add.mutateAsync({
        name: name.trim(),
        emoji,
        color,
        budget: Math.round(parseFloat(budget) || 0),
      })
      onCreated?.(cat.id)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add category.')
    }
  }

  return (
    <Sheet open={open} onClose={onClose} height="80%">
      <div className="flex items-center gap-3 px-5 pt-3.5">
        <CategoryBadge emoji={emoji} color={color} size={44} />
        <div className="flex-1">
          <div className="text-[17px] font-extrabold text-text">
            {name.trim() || 'New category'}
          </div>
          <div className="text-[13px] text-muted">Pick an icon, colour, and budget</div>
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

      <div className="flex-1 overflow-auto px-5 pb-4 pt-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          maxLength={24}
          className="mb-4 w-full rounded-tile border border-border bg-surface px-4 py-3 text-[15px] font-bold text-text outline-none placeholder:font-semibold placeholder:text-faint focus:border-accent"
        />

        <div className="px-1 pb-2 text-[12.5px] font-bold uppercase tracking-[0.06em] text-faint">
          Icon
        </div>
        <div className="mb-4 grid grid-cols-8 gap-1.5">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              className="flex aspect-square items-center justify-center rounded-xl text-[19px] transition-colors"
              style={{
                background: emoji === e ? 'var(--accent-soft)' : 'var(--surface-2)',
                outline: emoji === e ? '2px solid var(--accent)' : 'none',
              }}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="px-1 pb-2 text-[12.5px] font-bold uppercase tracking-[0.06em] text-faint">
          Colour
        </div>
        <div className="mb-4 flex flex-wrap gap-2.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Colour ${c}`}
              onClick={() => setColor(c)}
              className="size-8 rounded-full transition-transform active:scale-90"
              style={{
                background: c,
                boxShadow: color === c ? `0 0 0 2px var(--surface), 0 0 0 4px ${c}` : 'none',
              }}
            />
          ))}
        </div>

        <div className="px-1 pb-2 text-[12.5px] font-bold uppercase tracking-[0.06em] text-faint">
          Monthly budget
        </div>
        <div className="flex items-center rounded-tile border border-border bg-surface px-4 py-3 focus-within:border-accent">
          <span className="mr-1 text-muted">$</span>
          <input
            inputMode="decimal"
            placeholder="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/[^\d.]/g, ''))}
            className="w-full bg-transparent text-[15px] font-bold text-text outline-none placeholder:text-faint"
          />
        </div>

        {error && <div className="mt-3 text-center text-[13px] font-semibold text-bad">{error}</div>}
      </div>

      <div className="border-t border-border bg-bg px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
        <button
          type="button"
          onClick={save}
          disabled={!canSave}
          className="w-full rounded-2xl py-[15px] text-[16.5px] font-extrabold transition-colors"
          style={{
            background: canSave ? 'var(--accent)' : 'var(--surface-2)',
            color: canSave ? 'var(--accent-ink)' : 'var(--faint)',
          }}
        >
          {add.isPending ? 'Adding…' : 'Add category'}
        </button>
      </div>
    </Sheet>
  )
}
