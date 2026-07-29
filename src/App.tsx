import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AccountInputScreen } from './components/AccountInputScreen'
import { AuditLoadingScreen } from './components/AuditLoadingScreen'
import { AuthScreen } from './components/AuthScreen'
import { DiagnosticReportScreen } from './components/DiagnosticReportScreen'
import { generateAudit, loadExistingAudit } from './lib/audit-api'
import { isSupabaseConfigured, supabase } from './lib/supabase-client'
import type { AccountInput, Audit } from './types/domain'

type Screen = 'input' | 'loading' | 'diagnostic'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [screen, setScreen] = useState<Screen>('input')
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

  const handleSubmit = async (input: AccountInput) => {
    if (!session) return
    setSubmitError('')
    setScreen('loading')

    try {
      const existing = await loadExistingAudit(session.user.id, input.handle, input.platform)
      const result = existing ?? (await generateAudit(input))
      setAudit(result)
      setScreen('diagnostic')
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'L’analyse a rencontré un problème. Réessaie.',
      )
      setScreen('input')
    }
  }

  const restart = () => {
    setAudit(null)
    setSubmitError('')
    setScreen('input')
  }

  if (!authChecked) return null

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4 text-center text-sm">
        Supabase n’est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants).
      </main>
    )
  }

  if (!session) return <AuthScreen />

  if (screen === 'loading') return <AuditLoadingScreen />
  if (screen === 'diagnostic' && audit) return <DiagnosticReportScreen audit={audit} onRestart={restart} />

  return <AccountInputScreen onSubmit={handleSubmit} submitError={submitError} />
}

export default App
