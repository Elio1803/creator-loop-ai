import { supabase } from './supabase-client'
import type { AccountInput, Audit } from '../types/domain'

interface EdgeFunctionError {
  error?: { code?: string; message?: string }
}

async function invokeGenerateAudit(input: AccountInput): Promise<Audit> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')

  const { data, error } = await supabase.functions.invoke<{ audit: Audit }>('generate-audit', {
    body: input,
  })

  if (error) {
    const context = (error as { context?: Response }).context
    if (context) {
      const body = (await context.clone().json().catch(() => null)) as EdgeFunctionError | null
      if (body?.error?.message) throw new Error(body.error.message)
    }
    throw error
  }
  if (!data?.audit) throw new Error('Réponse d’audit invalide.')
  return data.audit
}

export async function generateAudit(input: AccountInput): Promise<Audit> {
  return invokeGenerateAudit(input)
}

const AUDIT_COLUMNS =
  'id, score_progression, score_regularite, score_coherence, score_clarte, score_diversite, potentiel_amelioration, explication_regularite, explication_coherence, explication_clarte, explication_diversite, frein_principal, meilleur_levier, created_at'

interface AuditRow {
  id: string
  score_progression: number
  score_regularite: number
  score_coherence: number
  score_clarte: number
  score_diversite: number
  potentiel_amelioration: Audit['potentielAmelioration']
  explication_regularite: string
  explication_coherence: string
  explication_clarte: string
  explication_diversite: string
  frein_principal: string
  meilleur_levier: string
  created_at: string
}

function rowToAudit(row: AuditRow): Audit {
  return {
    id: row.id,
    scoreProgression: row.score_progression,
    scoreRegularite: row.score_regularite,
    scoreCoherence: row.score_coherence,
    scoreClarte: row.score_clarte,
    scoreDiversite: row.score_diversite,
    potentielAmelioration: row.potentiel_amelioration,
    explicationRegularite: row.explication_regularite,
    explicationCoherence: row.explication_coherence,
    explicationClarte: row.explication_clarte,
    explicationDiversite: row.explication_diversite,
    freinPrincipal: row.frein_principal,
    meilleurLevier: row.meilleur_levier,
    createdAt: row.created_at,
  }
}

export async function loadLatestAudit(userId: string): Promise<Audit | null> {
  if (!supabase) return null

  const { data: audit } = await supabase
    .from('audits')
    .select(AUDIT_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return audit ? rowToAudit(audit) : null
}

export async function saveLeadEmail(userId: string, email: string): Promise<void> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.')

  const { error } = await supabase
    .from('creator_profiles')
    .upsert({ user_id: userId, email }, { onConflict: 'user_id' })

  if (error) throw error
}
