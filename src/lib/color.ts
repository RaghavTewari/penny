// Helpers for data-driven category colors (the per-category hex from the DB).

/** hex (#rgb or #rrggbb) → rgba() string with the given 0–1 alpha. */
export function hexA(hex: string, alpha: number): string {
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map((x) => x + x).join('')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Soft translucent version of a color (used for tinted badge backgrounds). */
export const tint = (hex: string, alpha = 0.16) => hexA(hex, alpha)

/** Readable ink color (white vs dark) to place on top of `hex`, via luminance. */
export function pickInk(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62 ? '#2A231D' : '#FFFFFF'
}
