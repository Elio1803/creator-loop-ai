import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AccountInputScreen } from './components/AccountInputScreen'
import { AuditLoadingScreen } from './components/AuditLoadingScreen'
import { EmailGateScreen } from './components/EmailGateScreen'
import { DiagnosticReportScreen } from './components/DiagnosticReportScreen'
import { generateAudit, loadLatestAudit, saveLeadEmail } from './lib/audit-api'
import { isSupabaseConfigured, supabase } from './lib/supabase-client'
import type { AccountInput, Audit } from './types/domain'

type Screen = 'form' | 'analyzing' | 'email' | 'diagnostic'

// Keeps the theatrical analysis steps visible even when the API answers fast.
const MIN_ANALYSIS_DELAY_MS = 7000

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [screen, setScreen] = useState<Screen>('form')
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
      let activeSession = session
      if (!activeSession) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) throw error
        activeSession = data.session
        setSession(data.session)
      }

      const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_ANALYSIS_DELAY_MS))
      const [result] = await Promise.all([generateAudit(input), minDelay])
      setAudit(result)
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

  if (!authChecked) return null

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4 text-center text-sm">
        Supabase n’est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants).
      </main>
    )
  }

  if (screen === 'analyzing') return <AuditLoadingScreen handle={handle} />
  if (screen === 'email') return <EmailGateScreen onSubmit={handleEmailSubmit} />
  if (screen === 'diagnostic' && audit) return <DiagnosticReportScreen audit={audit} onRestart={restart} />

  return <AccountInputScreen onSubmit={handleSubmit} submitError={submitError} />
}

export default App
