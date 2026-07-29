export const SOCIAL_PLATFORMS = ['instagram', 'tiktok'] as const
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

export const PUBLISHING_GOALS = ['audience', 'communaute', 'vente', 'notoriete'] as const
export type PublishingGoal = (typeof PUBLISHING_GOALS)[number]

export const PUBLISHING_RHYTHMS = ['quotidien', '2_3_semaine', '1_semaine', 'irregulier'] as const
export type PublishingRhythm = (typeof PUBLISHING_RHYTHMS)[number]

export const IMPROVEMENT_POTENTIALS = ['faible', 'moyen', 'eleve'] as const
export type ImprovementPotential = (typeof IMPROVEMENT_POTENTIALS)[number]

export const GOAL_LABELS: Record<PublishingGoal, string> = {
  audience: 'Développer mon audience',
  communaute: 'Construire une communauté',
  vente: 'Vendre un produit ou service',
  notoriete: 'Gagner en notoriété',
}

export const RHYTHM_LABELS: Record<PublishingRhythm, string> = {
  quotidien: 'Quotidien',
  '2_3_semaine': '2 à 3 fois par semaine',
  '1_semaine': 'Une fois par semaine',
  irregulier: 'Irrégulier',
}

export const POTENTIAL_LABELS: Record<ImprovementPotential, string> = {
  faible: 'Faible',
  moyen: 'Moyen',
  eleve: 'Élevé',
}

export interface AccountInput {
  handle: string
  platform: SocialPlatform
  niche: string
  objectif: PublishingGoal
  rythme: PublishingRhythm
  contenuBrut: string
}

export interface Audit {
  id: string
  scoreProgression: number
  scoreRegularite: number
  scoreCoherence: number
  scoreClarte: number
  scoreDiversite: number
  potentielAmelioration: ImprovementPotential
  explicationRegularite: string
  explicationCoherence: string
  explicationClarte: string
  explicationDiversite: string
  freinPrincipal: string
  meilleurLevier: string
  createdAt: string
}
