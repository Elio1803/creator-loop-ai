import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EASE } from '../lib/motion'

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
      <ProgressRing progress={progress} />

      <motion.h1
        key={stepIndex}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="mt-6 text-xl font-semibold"
      >
        Analyse de {handle ? `@${handle}` : 'ton compte'}
      </motion.h1>

      <div className="mx-auto mt-6 max-w-sm text-left">
        <ul className="space-y-2.5">
          {STEPS.map((step, index) => (
            <StepLine
              key={step}
              label={step}
              status={index < stepIndex ? 'done' : index === stepIndex ? 'active' : 'pending'}
            />
          ))}
        </ul>
      </div>
    </main>
  )
}

function ProgressRing({ progress }: { progress: number }) {
  const size = 88
  const stroke = 4
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const mv = useMotionValue(0)
  const dashoffset = useTransform(mv, (v) => circumference - (v / 100) * circumference)

  useEffect(() => {
    const controls = animate(mv, progress, { duration: 0.7, ease: EASE })
    return () => controls.stop()
  }, [progress, mv])

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-deep)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="h-2 w-2 rounded-full"
          style={{ background: 'var(--accent)' }}
        />
      </div>
    </div>
  )
}

function StepLine({ label, status }: { label: string; status: 'done' | 'active' | 'pending' }) {
  return (
    <motion.li
      animate={{ x: status === 'active' ? 4 : 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="flex items-center gap-2.5 text-sm"
      style={{
        color: status === 'done' ? 'var(--muted)' : status === 'active' ? 'var(--ink)' : 'var(--muted)',
        fontWeight: status === 'active' ? 600 : 400,
        opacity: status === 'pending' ? 0.5 : 1,
      }}
    >
      <span
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]"
        style={{
          background: status === 'active' ? 'var(--accent)' : 'var(--surface-deep)',
          color: status === 'active' ? '#fff' : 'var(--accent)',
        }}
      >
        <AnimatePresence>
          {status === 'done' && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {label}
    </motion.li>
  )
}
