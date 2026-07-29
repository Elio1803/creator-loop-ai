import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { Session } from '@supabase/supabase-js'
import { DiagnosticReportScreen } from './components/DiagnosticReportScreen'
import { Screen } from './components/Screen'
import { generateAudit, loadLatestAudit, saveLeadEmail } from './lib/audit-api'
import { isSupabaseConfigured, supabase } from './lib/supabase-client'
import type { AccountInput, Audit } from './types/domain'

// DiagnosticReportScreen stays eager: it's the very first thing a returning
// visitor sees. Everything only a new visitor or an in-progress submission
// needs is split into its own chunk instead of bloating that fast path.
const LandingPage = lazy(() => import('./components/LandingPage').then((m) => ({ default: m.LandingPage })))
const AccountInputScreen = lazy(() =>
  import('./components/AccountInputScreen').then((m) => ({ default: m.AccountInputScreen })),
)
const AuditLoadingScreen = lazy(() =>
  import('./components/AuditLoadingScreen').then((m) => ({ default: m.AuditLoadingScreen })),
)
const EmailGateScreen = lazy(() =>
  import('./components/EmailGateScreen').then((m) => ({ default: m.EmailGateScreen })),
)

type ScreenName = 'form' | 'analyzing' | 'email' | 'diagnostic'

// Keeps the theatrical analysis steps visible even when the API answers fast.
const MIN_ANALYSIS_DELAY_MS = 7000

function LoadingSpinner() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        aria-hidden="true"
      />
    </main>
  )
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [screen, setScreen] = useState<ScreenName>('form')
  const [handle, setHandle] = useState('')
  const [audit, setAudit] = useState<Audit | null>(null)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!supabase) {
      setAuthChecked(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthChecked(true)
    })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })
    return () => subscription.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    let cancelled = false
    loadLatestAudit(session.user.id).then((latest) => {
      if (!cancelled && latest) {
        setAudit(latest)
        setScreen('diagnostic')
      }
    })
    return () => {
      cancelled = true
    }
  }, [session?.user.id])

  const handleSubmit = async (input: AccountInput) => {
    if (!supabase) return
    setSubmitError('')
    setHandle(input.handle)
    setScreen('analyzing')

    try {
      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) throw error
        setSession(data.session)
      }

      const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_ANALYSIS_DELAY_MS))
      let resultPromise = generateAudit(input)
      try {
        const [result] = await Promise.all([resultPromise, minDelay])
        setAudit(result)
      } catch (error) {
        // A cached session can outlive its server-side user (e.g. token
        // expired, or the anonymous identity no longer exists). Retry once
        // with a fresh anonymous session instead of surfacing a raw auth error.
        const isAuthError = error instanceof Error && /token|auth/i.test(error.message)
        if (!isAuthError) throw error

        const { data, error: signInError } = await supabase.auth.signInAnonymously()
        if (signInError) throw signInError
        setSession(data.session)
        resultPromise = generateAudit(input)
        setAudit(await resultPromise)
      }
      setScreen('email')
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'L’analyse a rencontré un problème. Réessaie.',
      )
      setScreen('form')
    }
  }

  const handleEmailSubmit = async (email: string) => {
    if (session) {
      try {
        await saveLeadEmail(session.user.id, email)
      } catch {
        // Non bloquant : on ne perd pas le diagnostic déjà généré pour un
        // échec d'enregistrement de l'email.
      }
    }
    setScreen('diagnostic')
  }

  const restart = () => {
    setAudit(null)
    setSubmitError('')
    setScreen('form')
  }

  if (!authChecked) return <LoadingSpinner />

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4 text-center text-sm">
        Supabase n’est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants).
      </main>
    )
  }

  // Only the entry form lives inside the marketing page; once analysis
  // starts, the flow takes over the full screen (same as before).
  if (screen === 'form') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LandingPage>
          <AccountInputScreen onSubmit={handleSubmit} submitError={submitError} />
        </LandingPage>
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatePresence mode="wait">
        {screen === 'analyzing' && (
          <Screen key="analyzing">
            <AuditLoadingScreen handle={handle} />
          </Screen>
        )}
        {screen === 'email' && (
          <Screen key="email">
            <EmailGateScreen score={audit?.scoreProgression ?? 0} onSubmit={handleEmailSubmit} />
          </Screen>
        )}
        {screen === 'diagnostic' && audit && (
          <Screen key="diagnostic">
            <DiagnosticReportScreen audit={audit} onRestart={restart} />
          </Screen>
        )}
      </AnimatePresence>
    </Suspense>
  )
}

export default App
