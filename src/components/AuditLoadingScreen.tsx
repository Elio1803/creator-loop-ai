import { useEffect, useState } from 'react'

const STEPS = [
  'Analyse de tes publications…',
  'Identification de tes thèmes…',
  'Étude de ta régularité…',
  'Recherche de tes formats récurrents…',
  'Création de ton diagnostic…',
]

const STEP_DURATION_MS = 1400

export function AuditLoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, STEPS.length - 1))
    }, STEP_DURATION_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-6 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        aria-hidden="true"
      />
      <ul className="space-y-2 text-sm">
        {STEPS.map((step, index) => (
          <li
            key={step}
            style={{
              color: index <= stepIndex ? 'var(--ink)' : 'var(--muted)',
              fontWeight: index === stepIndex ? 600 : 400,
              opacity: index <= stepIndex ? 1 : 0.5,
            }}
          >
            {step}
          </li>
        ))}
      </ul>
    </main>
  )
}
