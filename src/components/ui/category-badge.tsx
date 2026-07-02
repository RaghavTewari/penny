// Category emoji in a soft, color-tinted rounded square.

import { tint } from '@/lib/color'

type CategoryBadgeProps = {
  emoji: string
  color: string
  size?: number
}

export function CategoryBadge({ emoji, color, size = 44 }: CategoryBadgeProps) {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        background: tint(color),
        color,
        fontSize: size * 0.5,
        lineHeight: 1,
      }}
    >
      <span style={{ filter: 'saturate(1.05)' }}>{emoji}</span>
    </div>
  )
}
