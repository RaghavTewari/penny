import { Icon } from '@/components/ui/icon'
import { monthLabel } from '@/lib/money'

type MonthNavProps = {
  month: string
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}

const btn =
  'flex size-[30px] items-center justify-center rounded-full border border-border bg-surface text-muted'

export function MonthNav({ month, onPrev, onNext, canPrev, canNext }: MonthNavProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous month"
        className={btn}
        style={{ opacity: canPrev ? 1 : 0.32, cursor: canPrev ? 'pointer' : 'default' }}
      >
        <Icon name="chevL" size={18} />
      </button>
      <div className="min-w-[96px] text-center text-sm font-bold text-text">
        {monthLabel(month)}
      </div>
      <button
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next month"
        className={btn}
        style={{ opacity: canNext ? 1 : 0.32, cursor: canNext ? 'pointer' : 'default' }}
      >
        <Icon name="chevR" size={18} />
      </button>
    </div>
  )
}
