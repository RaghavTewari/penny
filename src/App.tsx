import { AppShell } from '@/screens/app-shell'
import { SignIn } from '@/screens/sign-in'
import { useAuth } from '@/hooks/useAuth'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-bg text-sm text-muted">
        Loading…
      </div>
    )
  }

  return session ? <AppShell /> : <SignIn />
}
