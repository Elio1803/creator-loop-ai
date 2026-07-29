import { motion } from 'framer-motion'
import { type FormEvent, useState } from 'react'
import { EASE } from '../lib/motion'
import {
  GOAL_LABELS,
  PUBLISHING_GOALS,
  PUBLISHING_RHYTHMS,
  RHYTHM_LABELS,
  type AccountInput,
  type PublishingGoal,
  type PublishingRhythm,
} from '../types/domain'

const MIN_CONTENU_LENGTH = 20
const MAX_CONTENU_LENGTH = 4000

export interface AccountInputScreenProps {
  onSubmit: (input: AccountInput) => void
  submitError: string
}

export function AccountInputScreen({ onSubmit, submitError }: AccountInputScreenProps) {
  const [handle, setHandle] = useState('')
  const [niche, setNiche] = useState('')
  const [objectif, setObjectif] = useState<PublishingGoal>('audience')
  const [rythme, setRythme] = useState<PublishingRhythm>('irregulier')
  const [contenuBrut, setContenuBrut] = useState('')
  const [validationError, setValidationError] = useState('')

  const filledCount = [
    handle.trim().length >= 2,
    niche.trim().length >= 3,
    contenuBrut.trim().length >= MIN_CONTENU_LENGTH,
  ].filter(Boolean).length
  const progress = filledCount / 3
  const valid = filledCount === 3

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = contenuBrut.trim()

    if (trimmed.length < MIN_CONTENU_LENGTH) {
      setValidationError('Colle un peu plus de contenu (quelques légendes ou sujets récents) pour un diagnostic fiable.')
      return
    }
    if (trimmed.length > MAX_CONTENU_LENGTH) {
      setValidationError(
        `${MAX_CONTENU_LENGTH} caractères maximum (tu en as ${trimmed.length}). Raccourcis un peu.`,
      )
      return
    }
    setValidationError('')
    onSubmit({
      handle: handle.trim().replace(/^@/, ''),
      platform: 'instagram',
      niche: niche.trim(),
      objectif,
      rythme,
      contenuBrut: trimmed,
    })
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-semibold">Découvre ce qui freine ton compte.</h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
        Analyse ton contenu et reçois un diagnostic personnalisé en moins d’une minute.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium"
            style={{ borderColor: 'var(--accent)', background: 'var(--surface)', color: 'var(--accent)' }}
            aria-pressed="true"
          >
            Instagram
          </button>
          <button
            type="button"
            disabled
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
            title="Bientôt disponible"
          >
            TikTok · bientôt disponible
          </button>
        </div>

        <label className="block text-sm">
          Nom du compte
          <input
            required
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="@nom_du_compte"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
          />
        </label>

        <label className="block text-sm">
          Niche / thématique principale
          <input
            required
            value={niche}
            onChange={(event) => setNiche(event.target.value)}
            placeholder="ex. fitness, cuisine végétale, productivité…"
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
          />
        </label>

        <label className="block text-sm">
          Objectif principal
          <select
            value={objectif}
            onChange={(event) => setObjectif(event.target.value as PublishingGoal)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
          >
            {PUBLISHING_GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {GOAL_LABELS[goal]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          Rythme de publication actuel
          <select
            value={rythme}
            onChange={(event) => setRythme(event.target.value as PublishingRhythm)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
          >
            {PUBLISHING_RHYTHMS.map((rhythm) => (
              <option key={rhythm} value={rhythm}>
                {RHYTHM_LABELS[rhythm]}
              </option>
            ))}
          </select>
        </label>

        {/*
          Fallback manuel permanent : ne jamais retirer ce champ, meme apres
          l'ajout d'un scraping automatique (ex. Apify). S'il se deconnecte
          ou se desactive, ce champ doit rester le chemin de secours
          immediatement disponible, sans devoir le redevelopper. Voir
          CLAUDE.md a la racine du projet.
        */}
        <label className="block text-sm">
          Colle tes dernières légendes ou sujets publiés
          <textarea
            required
            rows={8}
            value={contenuBrut}
            onChange={(event) => setContenuBrut(event.target.value)}
            placeholder="Copie-colle en vrac plusieurs de tes dernières légendes Instagram (pas besoin de les mettre en forme, l’IA s’occupe de les séparer)."
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
          />
          <span className="mt-1 block text-xs" style={{ color: 'var(--muted)' }}>
            {contenuBrut.trim().length}/{MAX_CONTENU_LENGTH} caractères
          </span>
        </label>

        {(validationError || submitError) && (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>
            {validationError || submitError}
          </p>
        )}

        <motion.button
          type="submit"
          animate={{ opacity: 0.55 + progress * 0.45 }}
          whileTap={valid ? { scale: 0.98 } : {}}
          transition={{ duration: 0.35, ease: EASE }}
          className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          Analyser mon compte
        </motion.button>
      </form>
    </main>
  )
}
