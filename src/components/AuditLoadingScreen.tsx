import { useEffect, useState } from 'react'

const STEPS = [
  'Analyse de tes publications…',
  'Identification de tes thèmes…',
  'Étude de ta régularité…',
  'Recherche de tes formats récurrents…',
  'Création de ton diagnostic…',
]

const STEP_DURATION_MS = 1400

export interface AuditLoadingScreenProps {
  handle?: string
}

export function AuditLoadingScreen({ handle }: AuditLoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((current) => Math.min(current + 1, STEPS.length - 1))
    }, STEP_DURATION_MS)
    return () => clearInterval(interval)
  }, [])

  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
        style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        aria-hidden="true"
      />
      <h1 className="text-xl font-semibold">Analyse de {handle ? `@${handle}` : 'ton compte'}</h1>

      <div className="mt-6 w-full">
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--surface-deep)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: 'var(--accent)' }}
          />
        </div>

        <ul className="mt-6 space-y-2.5 text-left text-sm">
          {STEPS.map((step, index) => (
            <li key={step} className="flex items-center gap-2.5">
              <span
                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]"
                style={{
                  background: index < stepIndex ? 'var(--surface-deep)' : index === stepIndex ? 'var(--accent)' : 'var(--surface-deep)',
                  color: index < stepIndex ? 'var(--accent)' : index === stepIndex ? '#fff' : 'var(--muted)',
                }}
              >
                {index < stepIndex ? '✓' : ''}
              </span>
              <span
                style={{
                  color: index <= stepIndex ? 'var(--ink)' : 'var(--muted)',
                  fontWeight: index === stepIndex ? 600 : 400,
                  opacity: index <= stepIndex ? 1 : 0.5,
                }}
              >
                {step}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
