// Small on/off switch (accent when on).

export function Switch({ on }: { on: boolean }) {
  return (
    <div
      className="flex h-7 w-[46px] shrink-0 rounded-full p-[3px] transition-colors duration-200"
      style={{
        background: on ? 'var(--accent)' : 'var(--surface-2)',
        justifyContent: on ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        className="size-[22px] rounded-full bg-white transition-all duration-200"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
      />
    </div>
  )
}
