// Bottom sheet — slides up over a dimmed scrim, constrained to the app column.

import { useEffect, useState, type ReactNode } from 'react'

type SheetProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Panel height as a CSS value (e.g. '95%', '86%'). */
  height?: string
}

export function Sheet({ open, onClose, children, height = '92%' }: SheetProps) {
  const [render, setRender] = useState(open)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      setRender(true)
      const r = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(r)
    }
    setShown(false)
    const t = setTimeout(() => setRender(false), 340)
    return () => clearTimeout(t)
  }, [open])

  if (!render) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        onClick={onClose}
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'rgba(20,12,6,0.42)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          opacity: shown ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[440px] flex-col overflow-hidden rounded-t-sheet bg-bg"
        style={{
          height,
          boxShadow: '0 -10px 40px rgba(0,0,0,0.22)',
          transform: shown ? 'translateY(0)' : 'translateY(102%)',
          transition: 'transform .34s cubic-bezier(.32,.72,0,1)',
        }}
      >
        <div className="flex justify-center pt-2.5">
          <div className="h-[5px] w-10 rounded-full bg-border" />
        </div>
        {children}
      </div>
    </div>
  )
}
