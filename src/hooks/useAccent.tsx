import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { hexA, pickInk } from '@/lib/color'

/** Curated accent options (from the prototype's tweak). First is the default. */
export const ACCENTS = ['#E0734E', '#3FA873', '#6E7CE0', '#D8568B', '#E0A23C'] as const

type AccentState = {
  accent: string
  setAccent: (a: string) => void
  options: readonly string[]
}

const AccentContext = createContext<AccentState | undefined>(undefined)
const STORAGE_KEY = 'budgie.accent'
const DEFAULT = ACCENTS[0]

/** Push the accent + its derived tokens onto the root as inline CSS vars. */
function applyAccent(hex: string) {
  const s = document.documentElement.style
  s.setProperty('--accent', hex)
  s.setProperty('--accent-ink', pickInk(hex))
  s.setProperty('--accent-soft', hexA(hex, 0.3))
  s.setProperty('--accent-shadow', hexA(hex, 0.45))
}

function initialAccent(): string {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved && /^#[0-9a-fA-F]{6}$/.test(saved) ? saved : DEFAULT
}

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<string>(initialAccent)

  useEffect(() => {
    applyAccent(accent)
    localStorage.setItem(STORAGE_KEY, accent)
  }, [accent])

  return (
    <AccentContext.Provider value={{ accent, setAccent, options: ACCENTS }}>
      {children}
    </AccentContext.Provider>
  )
}

export function useAccent(): AccentState {
  const ctx = useContext(AccentContext)
  if (!ctx) throw new Error('useAccent must be used within <AccentProvider>')
  return ctx
}
