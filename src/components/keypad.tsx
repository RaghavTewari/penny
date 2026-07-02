// Custom 3×4 keypad driving the amount (not the OS keyboard).

import { Icon } from '@/components/ui/icon'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'] as const

export function Keypad({ onPress }: { onPress: (k: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onPress(k)}
          className="flex items-center justify-center rounded-tile bg-surface py-[13px] text-[22px] font-bold text-text shadow-[var(--shadow-soft-sm)] active:scale-95"
        >
          {k === 'del' ? <Icon name="chevL" size={22} /> : k}
        </button>
      ))}
    </div>
  )
}
