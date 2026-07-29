import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EASE } from '../lib/motion'
import { POTENTIAL_LABELS, type Audit } from '../types/domain'

export interface DiagnosticReportScreenProps {
  audit: Audit
  onRestart: () => void
}

interface SubScoreRowProps {
  label: string
  score: number
  explication: string
}

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

function SubScoreRow({ label, score, explication }: SubScoreRowProps) {
  return (
    <motion.div variants={rowVariants} className="border-b py-3 last:border-b-0" style={{ borderColor: 'var(--line)' }}>
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{label}</span>
        <span>{score}/100</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--surface-deep)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--accent)' }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </div>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        {explication}
      </p>
    </motion.div>
  )
}

function ScoreCounter({ score }: { score: number }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(mv, score, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (value) => setDisplay(Math.round(value)),
    })
    return () => controls.stop()
  }, [score, mv])

  return <span className="text-4xl font-semibold">{display}</span>
}

export function DiagnosticReportScreen({ audit, onRestart }: DiagnosticReportScreenProps) {
  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
        Ton diagnostic
      </p>

      <div className="mt-3 flex items-baseline gap-2">
        <ScoreCounter score={audit.scoreProgression} />
        <span className="text-lg" style={{ color: 'var(--muted)' }}>
          /100 · score de progression
        </span>
      </div>
      <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
        Potentiel d’amélioration : {POTENTIAL_LABELS[audit.potentielAmelioration]}
      </p>

      <motion.section
        className="mt-6 rounded-xl border p-4"
        style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        <SubScoreRow label="Régularité" score={audit.scoreRegularite} explication={audit.explicationRegularite} />
        <SubScoreRow
          label="Cohérence des sujets"
          score={audit.scoreCoherence}
          explication={audit.explicationCoherence}
        />
        <SubScoreRow label="Clarté du contenu" score={audit.scoreClarte} explication={audit.explicationClarte} />
        <SubScoreRow
          label="Diversité des formats"
          score={audit.scoreDiversite}
          explication={audit.explicationDiversite}
        />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
        className="mt-6 space-y-4"
      >
        <div className="rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
          <h2 className="text-sm font-semibold">Ton principal frein actuel</h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            {audit.freinPrincipal}
          </p>
        </div>

        <div className="rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}>
          <h2 className="text-sm font-semibold">Ton meilleur levier</h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            {audit.meilleurLevier}
          </p>
        </div>
      </motion.section>

      <section
        className="mt-6 rounded-xl border p-4 text-center"
        style={{ borderColor: 'var(--line)', background: 'var(--surface-deep)' }}
      >
        <p className="text-sm font-medium">Suis ton plan personnalisé pendant 7 jours</p>
        <button
          type="button"
          disabled
          className="mt-3 w-full cursor-not-allowed rounded-lg px-4 py-2 text-sm font-medium text-white opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          Bientôt disponible
        </button>
      </section>

      <button
        type="button"
        onClick={onRestart}
        className="mt-6 w-full text-sm underline"
        style={{ color: 'var(--muted)' }}
      >
        Analyser un autre compte
      </button>
    </main>
  )
}
