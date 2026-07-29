import { type FormEvent, useState } from 'react'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface EmailGateScreenProps {
  onSubmit: (email: string) => void
}

export function EmailGateScreen({ onSubmit }: EmailGateScreenProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

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
      <p className="text-3xl">📋</p>
      <h1 className="mt-4 text-2xl font-semibold">Ton diagnostic est prêt.</h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        On a identifié plusieurs freins sur ton compte. Entre ton email pour l’afficher.
      </p>

      <form onSubmit={submit} className="mt-6 text-left">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="ton@email.com"
          className="w-full rounded-lg border px-3 py-2.5 text-sm"
          style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
        />
        {error && (
          <p className="mt-2 text-sm" style={{ color: 'var(--danger)' }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-4 w-full rounded-lg px-4 py-3 text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          Voir mon diagnostic
        </button>
        <p className="mt-3 text-center text-xs" style={{ color: 'var(--muted)' }}>
          Pas de spam. Ton diagnostic et tes conseils, rien d’autre.
        </p>
      </form>
    </main>
  )
}
