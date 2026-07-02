// Money + date helpers. Currency is CAD throughout (product decision).

const CAD = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })

type MoneyOpts = { cents?: boolean; sign?: boolean }

/** Format a CAD amount. `cents:false` drops decimals; `sign:true` always shows +/−. */
export function money(n: number, { cents = true, sign = false }: MoneyOpts = {}): string {
  const v = Math.abs(n)
  let s = cents ? CAD.format(v) : '$' + Math.round(v).toLocaleString('en-CA')
  if (sign) s = (n < 0 ? '−' : '+') + s
  else if (n < 0) s = '−' + s
  return s
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** "2026-06" → "June 2026" */
export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${y}`
}

/** "2026-06" → "Jun 2026" */
export function monthShort(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MONTH_NAMES[m - 1].slice(0, 3)} ${y}`
}

export function daysInMonth(key: string): number {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

export function addMonth(key: string, delta: number): string {
  let [y, m] = key.split('-').map(Number)
  m += delta
  while (m < 1) { m += 12; y -= 1 }
  while (m > 12) { m -= 12; y += 1 }
  return `${y}-${String(m).padStart(2, '0')}`
}

/** Full weekday + month + day, e.g. "Wed, Jun 18". */
export function fmtDay(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function fmtDayShort(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

/** "Today" / "Yesterday" / "Wed, Jun 18" relative to `today`. */
export function relDay(date: string, today: string): string {
  if (date === today) return 'Today'
  const a = new Date(date + 'T00:00:00')
  const b = new Date(today + 'T00:00:00')
  const diff = Math.round((b.getTime() - a.getTime()) / 86_400_000)
  if (diff === 1) return 'Yesterday'
  return fmtDay(date)
}

/** Fraction of the month elapsed; only meaningful for the live month. */
export function monthElapsed(key: string, today: string): number {
  const dim = daysInMonth(key)
  if (today.slice(0, 7) === key) {
    const day = Number(today.split('-')[2])
    return Math.min(1, day / dim)
  }
  return key < today.slice(0, 7) ? 1 : 0
}

/** Today's date as YYYY-MM-DD in local time. */
export function todayISO(): string {
  const d = new Date()
  const off = d.getTimezoneOffset() * 60_000
  return new Date(d.getTime() - off).toISOString().slice(0, 10)
}

/** YYYY-MM bucket for a date. */
export function monthOf(date: string): string {
  return date.slice(0, 7)
}
