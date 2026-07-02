// Spent-vs-budget bar. Fill is the category color; turns red when over budget.

type ProgressBarProps = {
  value: number
  max: number
  color: string
  height?: number
}

export function ProgressBar({ value, max, color, height = 8 }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(1, value / max) : 0
  const over = value > max
  return (
    <div
      className="overflow-hidden rounded-full bg-surface-2"
      style={{ height }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${(pct * 100).toFixed(1)}%`,
          background: over ? 'var(--bad)' : color,
          transition: 'width .5s cubic-bezier(.22,1,.36,1)',
        }}
      />
    </div>
  )
}
