import { AppShell } from '@/screens/app-shell'
import { SignIn } from '@/screens/sign-in'
import { Onboarding } from '@/screens/onboarding'
import { useAuth } from '@/hooks/useAuth'
import { useCategories } from '@/hooks/useBudget'

function Loading() {
  return (
    <div className="flex h-full items-center justify-center bg-bg text-sm text-muted">Loading…</div>
  )
}

/** Signed-in users with no budgets set yet see first-run onboarding. */
function OnboardingGate() {
  const { data: categories, isLoading } = useCategories()
  if (isLoading || !categories) return <Loading />
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0)
  return totalBudget === 0 ? <Onboarding /> : <AppShell />
}

export default function App() {
  const { session, loading } = useAuth()

  if (loading) return <Loading />
  return session ? <OnboardingGate /> : <SignIn />
}
