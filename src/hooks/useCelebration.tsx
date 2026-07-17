// Celebrations — a confetti burst + a little Penny "cheer" for good money
// moments. Two tiers: `normal` (everyday wins, e.g. staying under budget) and
// `big` (milestones, e.g. crossing a streak threshold).

import confetti from 'canvas-confetti'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { PennyMascot } from '@/components/penny-mascot'

export type Cheer = {
  message: string
  tone: 'good' | 'warn'
  /** 'big' = milestone: bigger confetti + a larger card that holds longer. */
  tier?: 'normal' | 'big'
  subtitle?: string
  /** Fire confetti (defaults to true for good, false for warn). */
  confetti?: boolean
}

type CelebrationState = { celebrate: (c: Cheer) => void }

const CelebrationContext = createContext<CelebrationState | undefined>(undefined)

const WARM = ['#E0734E', '#3FA873', '#E0A23C', '#6E7CE0', '#E06A8B', '#4FB7A0']

function fireConfetti() {
  const base = {
    ticks: 130,
    gravity: 1,
    decay: 0.92,
    startVelocity: 34,
    colors: WARM,
    disableForReducedMotion: true,
    scalar: 0.9,
  }
  confetti({ ...base, particleCount: 44, spread: 80, origin: { x: 0.5, y: 0.72 } })
  window.setTimeout(
    () => confetti({ ...base, particleCount: 22, angle: 55, spread: 55, origin: { x: 0, y: 0.85 } }),
    130,
  )
  window.setTimeout(
    () => confetti({ ...base, particleCount: 22, angle: 125, spread: 55, origin: { x: 1, y: 0.85 } }),
    130,
  )
}

/** Bigger, longer "fireworks" burst for milestones. */
function fireBig() {
  const base = { colors: WARM, disableForReducedMotion: true, scalar: 1 }
  confetti({ ...base, particleCount: 90, spread: 110, startVelocity: 42, origin: { x: 0.5, y: 0.55 } })
  const end = Date.now() + 1400
  ;(function frame() {
    confetti({ ...base, particleCount: 5, angle: 60, spread: 55, startVelocity: 38, origin: { x: 0, y: 0.8 } })
    confetti({ ...base, particleCount: 5, angle: 120, spread: 55, startVelocity: 38, origin: { x: 1, y: 0.8 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

function CheerToast({ cheer }: { cheer: Cheer }) {
  const good = cheer.tone === 'good'
  if (cheer.tier === 'big') {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-[max(24px,env(safe-area-inset-top))]">
        <div className="flex animate-[cheer-pop_3.2s_ease] flex-col items-center gap-1.5 rounded-[22px] border border-border bg-surface px-6 py-4 text-center shadow-[var(--shadow)]">
          <PennyMascot mood="happy" size={52} />
          <div className="text-[18px] font-extrabold tracking-[-0.4px] text-text">{cheer.message}</div>
          {cheer.subtitle && (
            <div className="text-[12.5px] font-semibold text-muted">{cheer.subtitle}</div>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-[max(14px,env(safe-area-inset-top))]">
      <div className="flex animate-[cheer-pop_2.4s_ease] items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-4 shadow-[var(--shadow-soft)]">
        <PennyMascot mood={good ? 'happy' : 'worried'} size={30} />
        <span
          className="text-[13.5px] font-extrabold"
          style={{ color: good ? 'var(--good)' : 'var(--warn)' }}
        >
          {cheer.message}
        </span>
      </div>
    </div>
  )
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [cheer, setCheer] = useState<Cheer | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const celebrate = useCallback((c: Cheer) => {
    const big = c.tier === 'big'
    const withConfetti = c.confetti ?? c.tone === 'good'
    if (withConfetti) (big ? fireBig : fireConfetti)()
    setCheer(c)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCheer(null), big ? 3200 : 2400)
  }, [])

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      {cheer && <CheerToast cheer={cheer} />}
    </CelebrationContext.Provider>
  )
}

export function useCelebration(): CelebrationState {
  const ctx = useContext(CelebrationContext)
  if (!ctx) throw new Error('useCelebration must be used within <CelebrationProvider>')
  return ctx
}

// ── Streak milestones ────────────────────────────────────────────
const MILESTONES = [3, 7, 14, 21, 30, 50, 100, 200, 365]

function reachedMilestone(streak: number): number {
  let r = 0
  for (const m of MILESTONES) if (streak >= m) r = m
  return r
}

function milestoneSubtitle(m: number): string {
  if (m >= 365) return 'A full year on pace — legendary 🏆'
  if (m >= 100) return '100 days! You are unstoppable'
  if (m >= 30) return 'A whole month on pace — incredible'
  if (m >= 21) return 'Three weeks strong 💪'
  if (m >= 14) return 'Two weeks and counting'
  if (m >= 7) return 'A full week on pace! 🔥'
  return 'Nice habit forming — keep it up'
}

const STREAK_KEY = 'penny.streakMilestone'

/**
 * Fires a big celebration when the live-month streak crosses a new milestone.
 * Deduped in localStorage; the first observation only sets a baseline (so an
 * already-existing streak isn't celebrated on first open).
 */
export function useStreakMilestone(streak: number | undefined, isLive: boolean) {
  const { celebrate } = useCelebration()
  useEffect(() => {
    if (streak == null || !isLive) return
    const reached = reachedMilestone(streak)
    const raw = localStorage.getItem(STREAK_KEY)
    if (raw === null) {
      localStorage.setItem(STREAK_KEY, String(reached))
      return
    }
    const stored = Number(raw)
    if (reached > stored) {
      localStorage.setItem(STREAK_KEY, String(reached))
      celebrate({
        tier: 'big',
        tone: 'good',
        message: `${reached}-day streak!`,
        subtitle: milestoneSubtitle(reached),
      })
    } else if (reached < stored) {
      localStorage.setItem(STREAK_KEY, String(reached))
    }
  }, [streak, isLive, celebrate])
}
