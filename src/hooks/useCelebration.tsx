// Celebrations — a confetti burst + a little Penny "cheer" toast for good
// money moments (income, staying under budget, streak milestones).

import confetti from 'canvas-confetti'
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { PennyMascot } from '@/components/penny-mascot'

export type Cheer = {
  message: string
  tone: 'good' | 'warn'
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

function CheerToast({ cheer }: { cheer: Cheer }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-[max(14px,env(safe-area-inset-top))]">
      <div className="flex animate-[cheer-pop_2.4s_ease] items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-4 shadow-[var(--shadow-soft)]">
        <PennyMascot mood={cheer.tone === 'good' ? 'happy' : 'worried'} size={30} />
        <span
          className="text-[13.5px] font-extrabold"
          style={{ color: cheer.tone === 'good' ? 'var(--good)' : 'var(--warn)' }}
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
    const withConfetti = c.confetti ?? c.tone === 'good'
    if (withConfetti) fireConfetti()
    setCheer(c)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCheer(null), 2400)
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
