# Creator Loop AI — Phase 1 (validation technique)

Coach IA de progression pour créateurs de contenu. Cette phase couvre
uniquement : saisie du compte (manuelle assistée), audit, score, diagnostic
personnalisé. Pas de paywall, pas de plan 7 jours, pas de missions
quotidiennes (Phase 2).

Stack : React + TypeScript + Vite + Tailwind CSS + Supabase (auth, DB, RLS,
Edge Functions). Les appels IA (Anthropic) passent uniquement par l'Edge
Function `generate-audit`, jamais depuis le client.

## Mise en route

```bash
npm install
cp .env.example .env.local   # renseigner VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm run dev                  # http://localhost:4174
```

## Backend Supabase

1. Créer un projet Supabase, puis appliquer le schéma :
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```
2. Configurer les secrets de l'Edge Function `generate-audit` :
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=... ANTHROPIC_MODEL=...
   ```
   (`SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont déjà fournis
   automatiquement à toutes les Edge Functions par Supabase.)
3. Déployer la fonction (pas de déploiement automatique au push) :
   ```bash
   supabase functions deploy generate-audit
   ```
4. En production, définir `ALLOWED_ORIGINS` (secret de la fonction) avec le
   domaine du front déployé — sinon seuls `localhost:4174`/`5173` sont
   acceptés.

## Ce que fait Phase 1

- Écran 1 : saisie du compte (`@handle`, plateforme, niche, objectif,
  rythme, 5-10 derniers sujets publiés)
- Écran 2 : animation d'analyse
- Écran 3 : diagnostic (score de progression, 4 sous-scores expliqués,
  frein principal, meilleur levier) — persisté, jamais régénéré à la
  revisite du même compte
- Quota : 3 audits/jour/utilisateur, appliqué côté serveur
  (`consume_ai_quota`) ; coût IA loggé dans `private.ai_usage`
