// Inline SVG icon set (stroke = currentColor), ported from the prototype's
// `Icon` component so the glyphs match the design exactly.

import type { CSSProperties } from 'react'

export type IconName =
  | 'home' | 'activity' | 'receipt' | 'plus' | 'stats' | 'settings'
  | 'chevL' | 'chevR' | 'chevD' | 'close' | 'check' | 'repeat'
  | 'calendar' | 'note' | 'trash' | 'edit' | 'arrowUp' | 'arrowDown'
  | 'sun' | 'moon' | 'sparkle' | 'wallet' | 'tag'

const P = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const PATHS: Record<IconName, React.ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20h14V9.5" /></>,
  activity: <path d="M4 6h16M4 12h16M4 18h10" />,
  receipt: <><path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z" /><path d="M9 8h6M9 12h6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  stats: <path d="M5 20V10M12 20V4M19 20v-7" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" /></>,
  chevL: <path d="M15 5l-7 7 7 7" />,
  chevR: <path d="M9 5l7 7-7 7" />,
  chevD: <path d="M5 9l7 7 7-7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 6.5" />,
  repeat: <><path d="M17 2l3 3-3 3" /><path d="M20 5H8a4 4 0 0 0-4 4v1" /><path d="M7 22l-3-3 3-3" /><path d="M4 19h12a4 4 0 0 0 4-4v-1" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>,
  note: <><path d="M5 3h14v18H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16v4z" /><path d="M14 6l4 4" /></>,
  arrowUp: <path d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
  sun: <><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="3" /><path d="M3 10h18M16 14.5h2" /></>,
  tag: <><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z" /><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" /></>,
}

type IconProps = {
  name: IconName
  size?: number
  stroke?: number
  className?: string
  style?: CSSProperties
}

export function Icon({ name, size = 24, stroke = 2, className, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={stroke}
      className={className}
      style={style}
      aria-hidden="true"
      {...P}
    >
      {PATHS[name]}
    </svg>
  )
}
