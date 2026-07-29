# Creator Loop AI — Contexte projet

Coach IA de progression pour créateurs de contenu (pas un simple générateur
de scripts). Boucle produit : analyse → diagnostic → plan → mission
quotidienne → publication → mesure → apprentissage → adaptation. Construit
par phases (voir le brief produit complet, communiqué en conversation).

## Stack

- React + TypeScript + Vite + Tailwind (`@tailwindcss/vite`)
- Framer Motion pour les animations
- Supabase : auth (sessions anonymes activées), DB (RLS), Edge Functions
- Déploiement : GitHub Pages via GitHub Actions
  (`.github/workflows/deploy-pages.yml`), repo `Elio1803/creator-loop-ai`
- Projet Supabase : `Creator Loop AI`, ref `jtpmmstigevxmjrihrbd`, org
  Elio1803's Org

## Règle permanente : fallback manuel de saisie du contenu

Le champ « Colle tes dernières légendes ou sujets publiés »
(`src/components/AccountInputScreen.tsx`, champ `contenuBrut`) **ne doit
jamais être supprimé du code**, même après l'ajout d'un scraping
automatique du compte (ex. via un service tiers comme Apify).

**Pourquoi :** si le scraping automatique se déconnecte, casse ou est
désactivé par la plateforme source, il faut pouvoir basculer sur la saisie
manuelle en quelques minutes plutôt que de paniquer ou de redévelopper le
formulaire en urgence.

**Comment appliquer :**
- Garder `contenuBrut` comme champ toujours fonctionnel dans
  `AccountInputScreen`, même si un futur flow d'import automatique devient
  le chemin par défaut.
- Si un scraping automatique est ajouté plus tard, le concevoir comme une
  option qui *pré-remplit* ce champ plutôt que comme un remplacement qui
  le retire de l'UI.
- Le backend (`supabase/functions/generate-audit`) doit continuer
  d'accepter `contenuBrut` comme entrée, quelle que soit sa source
  (saisie manuelle ou pré-remplissage automatique).
