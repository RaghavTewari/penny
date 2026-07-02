import { useState, type FormEvent } from 'react'
import { Icon } from '@/components/ui/icon'
import { useAuth } from '@/hooks/useAuth'

export function SignIn() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg(null)
    setInfo(null)
    const fn = mode === 'in' ? signIn : signUp
    const { error } = await fn(email.trim(), password)
    setBusy(false)
    if (error) {
      setMsg(error)
    } else if (mode === 'up') {
      setInfo('Account created. If email confirmation is on, check your inbox to finish.')
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-[440px] flex-col justify-center bg-bg px-6 text-text">
      <div className="mb-8 flex flex-col items-center text-center">
        <div
          className="mb-4 flex size-16 items-center justify-center rounded-[20px] text-accent-ink"
          style={{ background: 'var(--accent)' }}
        >
          <Icon name="wallet" size={32} stroke={2.2} />
        </div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.8px]">Budgie</h1>
        <p className="mt-1 text-sm text-muted">
          Log a spend, see the impact instantly.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="px-1 text-[12.5px] font-bold uppercase tracking-[0.06em] text-faint">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-tile border border-border bg-surface px-4 py-3 text-[15px] text-text outline-none placeholder:text-faint focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="px-1 text-[12.5px] font-bold uppercase tracking-[0.06em] text-faint">
            Password
          </span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="rounded-tile border border-border bg-surface px-4 py-3 text-[15px] text-text outline-none placeholder:text-faint focus:border-accent"
          />
        </label>

        {msg && <div className="px-1 text-[13px] font-semibold text-bad">{msg}</div>}
        {info && <div className="px-1 text-[13px] font-semibold text-good">{info}</div>}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 rounded-tile py-3.5 text-[15px] font-extrabold text-accent-ink disabled:opacity-60"
          style={{ background: 'var(--accent)' }}
        >
          {busy ? 'Working…' : mode === 'in' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        onClick={() => {
          setMode((m) => (m === 'in' ? 'up' : 'in'))
          setMsg(null)
          setInfo(null)
        }}
        className="mt-5 text-center text-[13.5px] font-semibold text-muted"
      >
        {mode === 'in' ? (
          <>New here? <span className="text-accent">Create an account</span></>
        ) : (
          <>Already have an account? <span className="text-accent">Sign in</span></>
        )}
      </button>
    </div>
  )
}
