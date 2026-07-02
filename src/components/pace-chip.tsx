import { Icon } from '@/components/ui/icon'
import type { Pace, PaceTone } from '@/lib/types'

const TONE: Record<PaceTone, string> = {
  good: 'bg-good-soft text-good',
  warn: 'bg-warn-soft text-warn',
  bad: 'bg-bad-soft text-bad',
}

export function PaceChip({ pace }: { pace: Pace }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full py-1.5 pl-2 pr-2.5 text-[13px] font-bold ${TONE[pace.tone]}`}
    >
      <Icon name={pace.tone === 'bad' ? 'arrowUp' : 'sparkle'} size={15} />
      {pace.label}
    </div>
  )
}
