import { Icon, type IconName } from '@/components/ui/icon'

export type View = 'home' | 'activity' | 'stats' | 'settings'

type TabBarProps = {
  view: View
  onView: (v: View) => void
  onAdd: () => void
}

function Tab({
  id,
  icon,
  label,
  active,
  onView,
}: {
  id: View
  icon: IconName
  label: string
  active: boolean
  onView: (v: View) => void
}) {
  return (
    <button
      onClick={() => onView(id)}
      className="flex flex-1 flex-col items-center gap-[3px] pt-2 pb-0.5 transition-colors"
      style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}
    >
      <Icon name={icon} size={24} stroke={active ? 2.4 : 2} />
      <span className="text-[10.5px]" style={{ fontWeight: active ? 800 : 600 }}>
        {label}
      </span>
    </button>
  )
}

export function TabBar({ view, onView, onAdd }: TabBarProps) {
  return (
    <div className="relative flex shrink-0 items-start border-t border-border bg-surface px-1.5 pb-[max(22px,env(safe-area-inset-bottom))]">
      <Tab id="home" icon="home" label="Home" active={view === 'home'} onView={onView} />
      <Tab id="activity" icon="activity" label="Activity" active={view === 'activity'} onView={onView} />
      <div className="flex w-[72px] shrink-0 justify-center">
        <button
          onClick={onAdd}
          aria-label="Add transaction"
          className="-mt-[18px] flex size-[58px] items-center justify-center rounded-full text-accent-ink"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 8px 20px var(--accent-shadow)',
          }}
        >
          <Icon name="plus" size={30} stroke={2.6} />
        </button>
      </div>
      <Tab id="stats" icon="stats" label="Insights" active={view === 'stats'} onView={onView} />
      <Tab id="settings" icon="settings" label="Settings" active={view === 'settings'} onView={onView} />
    </div>
  )
}
