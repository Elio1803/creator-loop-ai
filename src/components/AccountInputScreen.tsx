import { type FormEvent, useState } from 'react'
import {
  GOAL_LABELS,
  PUBLISHING_GOALS,
  PUBLISHING_RHYTHMS,
  RHYTHM_LABELS,
  type AccountInput,
  type PublishingGoal,
  type PublishingRhythm,
} from '../types/domain'

const MIN_SUJETS = 3
const MAX_SUJETS = 10
const MAX_SUJET_LENGTH = 280

export interface AccountInputScreenProps {
  onSubmit: (input: AccountInput) => void
  submitError: string
}

export function AccountInputScreen({ onSubmit, submitError }: AccountInputScreenProps) {
  const [handle, setHandle] = useState('')
  const [niche, setNiche] = useState('')
  const [objectif, setObjectif] = useState<PublishingGoal>('audience')
  const [rythme, setRythme] = useState<PublishingRhythm>('irregulier')
  const [sujetsText, setSujetsText] = useState('')
  const [validationError, setValidationError] = useState('')
  const sujetsLineCount = sujetsText.split('\n').filter((line) => line.trim()).length

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const sujetsRecents = sujetsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (sujetsRecents.length < MIN_SUJETS) {
      setValidationError(
        `Ajoute au moins ${MIN_SUJETS} publications récentes pour un diagnostic fiable.`,
      )
      return
    }
    if (sujetsRecents.length > MAX_SUJETS) {
      setValidationError(
        `${MAX_SUJETS} sujets maximum (tu en as ${sujetsRecents.length}). Retire les lignes en trop.`,
      )
      return
    }
    const tooLongIndex = sujetsRecents.findIndex((line) => line.length > MAX_SUJET_LENGTH)
    if (tooLongIndex !== -1) {
      setValidationError(
        `La ligne ${tooLongIndex + 1} dépasse ${MAX_SUJET_LENGTH} caractères. Raccourcis-la.`,
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
      sujetsRecents,
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

        <label className="block text-sm">
          Tes 5 à 10 derniers sujets ou légendes publiés (un par ligne)
          <textarea
            required
            rows={6}
            value={sujetsText}
            onChange={(event) => setSujetsText(event.target.value)}
            placeholder={'Comment j’organise ma semaine\nMa routine du matin en 5 étapes\n…'}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
          />
          <span className="mt-1 block text-xs" style={{ color: 'var(--muted)' }}>
            {sujetsLineCount}/{MAX_SUJETS} lignes · {MAX_SUJET_LENGTH} caractères max par ligne
          </span>
        </label>

        {(validationError || submitError) && (
          <p className="text-sm" style={{ color: 'var(--danger)' }}>
            {validationError || submitError}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          Analyser mon compte
        </button>
      </form>
    </main>
  )
}
