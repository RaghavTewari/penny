// Penny — a little coin character whose face reacts to how the month is going.

export type Mood = 'happy' | 'neutral' | 'worried'

export function PennyMascot({ mood = 'happy', size = 64 }: { mood?: Mood; size?: number }) {
  const eyeY = mood === 'worried' ? 27 : 28
  const mouth =
    mood === 'happy'
      ? 'M22 37 Q32 47 42 37'
      : mood === 'worried'
        ? 'M23 43 Q32 35 41 43'
        : 'M25 40 L39 40'
  const brows = mood === 'worried'
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      {/* coin */}
      <circle cx="32" cy="32" r="30" fill="var(--accent)" />
      <circle cx="32" cy="32" r="25.5" fill="none" stroke="var(--accent-ink)" strokeOpacity="0.28" strokeWidth="2" />
      {/* eyes */}
      <circle cx="24" cy={eyeY} r="3" fill="var(--accent-ink)" />
      <circle cx="40" cy={eyeY} r="3" fill="var(--accent-ink)" />
      {brows && (
        <>
          <path d="M20 22 L28 24" stroke="var(--accent-ink)" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M44 22 L36 24" stroke="var(--accent-ink)" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
      {/* mouth */}
      <path
        d={mouth}
        fill="none"
        stroke="var(--accent-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* cheeks when happy */}
      {mood === 'happy' && (
        <>
          <circle cx="17" cy="36" r="3" fill="var(--accent-ink)" fillOpacity="0.22" />
          <circle cx="47" cy="36" r="3" fill="var(--accent-ink)" fillOpacity="0.22" />
        </>
      )}
    </svg>
  )
}
