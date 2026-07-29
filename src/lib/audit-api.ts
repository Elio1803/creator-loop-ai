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

export async function loadExistingAudit(userId: string, handle: string, platform: string): Promise<Audit | null> {
  if (!supabase) return null

  const { data: account } = await supabase
    .from('social_accounts')
    .select('id')
    .eq('user_id', userId)
    .eq('platform', platform)
    .ilike('handle', handle)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!account?.id) return null

  const { data: audit } = await supabase
    .from('audits')
    .select(
      'id, score_progression, score_regularite, score_coherence, score_clarte, score_diversite, potentiel_amelioration, explication_regularite, explication_coherence, explication_clarte, explication_diversite, frein_principal, meilleur_levier, created_at',
    )
    .eq('social_account_id', account.id)
    .maybeSingle()

  if (!audit) return null

  return {
    id: audit.id,
    scoreProgression: audit.score_progression,
    scoreRegularite: audit.score_regularite,
    scoreCoherence: audit.score_coherence,
    scoreClarte: audit.score_clarte,
    scoreDiversite: audit.score_diversite,
    potentielAmelioration: audit.potentiel_amelioration,
    explicationRegularite: audit.explication_regularite,
    explicationCoherence: audit.explication_coherence,
    explicationClarte: audit.explication_clarte,
    explicationDiversite: audit.explication_diversite,
    freinPrincipal: audit.frein_principal,
    meilleurLevier: audit.meilleur_levier,
    createdAt: audit.created_at,
  }
}
