import { useState } from 'react'
import { TabBar, type View } from '@/components/tab-bar'
import { Home } from '@/screens/home'
import { Activity } from '@/screens/activity'
import { Stats } from '@/screens/stats'
import { Settings } from '@/screens/settings'
import { AddSheet } from '@/screens/add-sheet'
import { CategoryDetailSheet } from '@/screens/category-detail-sheet'
import { useMonthData } from '@/hooks/useBudget'
import { addMonth, monthOf, todayISO } from '@/lib/money'
import type { CategoryStat, Transaction } from '@/lib/types'

type HomeRouteProps = {
  month: string
  currentMonth: string
  onMonth: (m: string) => void
  onOpenCat: (c: CategoryStat) => void
}

function HomeRoute({ month, currentMonth, onMonth, onOpenCat }: HomeRouteProps) {
  const { data, isLoading, isError } = useMonthData(month)

  const canNext = month < currentMonth
  const canPrev = true

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-sm text-muted">Loading…</div>
  }
  if (isError || !data) {
    return (
      <div className="flex h-full items-center justify-center px-8 text-center text-sm text-bad">
        Couldn't load your budget. Check your connection and try again.
      </div>
    )
  }

  return (
    <Home
      d={data}
      month={month}
      canPrev={canPrev}
      canNext={canNext}
      onPrev={() => onMonth(addMonth(month, -1))}
      onNext={() => canNext && onMonth(addMonth(month, 1))}
      onOpenCat={onOpenCat}
    />
  )
}

export function AppShell() {
  const currentMonth = monthOf(todayISO())
  const [view, setView] = useState<View>('home')
  const [month, setMonth] = useState(currentMonth)
  const [addOpen, setAddOpen] = useState(false)
  const [editTx, setEditTx] = useState<Transaction | null>(null)
  const [detailCat, setDetailCat] = useState<CategoryStat | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const openAdd = () => {
    setEditTx(null)
    setAddOpen(true)
  }
  const openEdit = (t: Transaction) => {
    setEditTx(t)
    setAddOpen(true)
  }
  const openCat = (c: CategoryStat) => {
    setDetailCat(c)
    setDetailOpen(true)
  }

  return (
    <div className="mx-auto flex h-full max-w-[440px] flex-col overflow-hidden bg-bg text-text">
      <main className="flex-1 overflow-x-hidden overflow-y-auto pt-[max(16px,env(safe-area-inset-top))] pb-3.5">
        {view === 'home' && (
          <HomeRoute
            month={month}
            currentMonth={currentMonth}
            onMonth={setMonth}
            onOpenCat={openCat}
          />
        )}
        {view === 'activity' && (
          <Activity
            month={month}
            currentMonth={currentMonth}
            onMonth={setMonth}
            onEdit={openEdit}
          />
        )}
        {view === 'stats' && (
          <Stats month={month} currentMonth={currentMonth} onMonth={setMonth} />
        )}
        {view === 'settings' && <Settings month={month} />}
      </main>

      <TabBar view={view} onView={setView} onAdd={openAdd} />

      <AddSheet
        open={addOpen}
        editTx={editTx}
        selectedMonth={month}
        onClose={() => setAddOpen(false)}
        onSaved={(m) => {
          // Jump to the new transaction's month and return Home to see the impact.
          setAddOpen(false)
          setMonth(m)
          setView('home')
        }}
      />

      <CategoryDetailSheet
        open={detailOpen}
        cat={detailCat}
        month={month}
        onClose={() => setDetailOpen(false)}
        onEditTx={openEdit}
      />
    </div>
  )
}
