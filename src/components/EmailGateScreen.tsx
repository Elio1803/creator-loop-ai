import { motion } from 'framer-motion'
import { type FormEvent, useEffect, useState } from 'react'
import { EASE } from '../lib/motion'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface EmailGateScreenProps {
  score: number
  onSubmit: (email: string) => void
}

export function EmailGateScreen({ score, onSubmit }: EmailGateScreenProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIdle(true), 3000)
    return () => clearTimeout(timeout)
  }, [])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Entre une adresse email valide pour voir ton diagnostic.')
      return
    }
    setError('')
    onSubmit(email.trim())
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-10 text-center">
      <div
        className="relative mx-auto mb-6 h-24 w-full max-w-xs overflow-hidden rounded-2xl border"
        style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
      >
        <div className="flex h-full items-center justify-center" style={{ filter: 'blur(6px)' }} aria-hidden="true">
          <span className="text-5xl font-bold" style={{ color: 'var(--accent)' }}>
            {score}
          </span>
          <span className="ml-1 text-xl" style={{ color: 'var(--muted)' }}>
            /100
          </span>
        </div>
      </div>

      <h1 className="text-2xl font-semibold">Ton diagnostic est prêt.</h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        On a identifié plusieurs freins sur ton compte. Entre ton email pour l’afficher.
      </p>

      <form onSubmit={submit} className="mt-6 text-left">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setIdle(false)
          }}
          placeholder="ton@email.com"
          className="w-full rounded-lg border px-3 py-2.5 text-sm"
          style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-2 text-sm"
            style={{ color: 'var(--danger)' }}
          >
            {error}
          </motion.p>
        )}
        <motion.button
          type="submit"
          animate={idle && !email ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={idle && !email ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
          className="mt-4 w-full rounded-lg px-4 py-3 text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          Voir mon diagnostic
        </motion.button>
        <p className="mt-3 text-center text-xs" style={{ color: 'var(--muted)' }}>
          Pas de spam. Ton diagnostic et tes conseils, rien d’autre.
        </p>
      </form>
    </main>
  )
}
