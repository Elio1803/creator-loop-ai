import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  AtSign,
  CalendarX,
  Check,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  X,
} from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap'

const EASE = [0.22, 1, 0.36, 1] as const

const NICHES_DEMO = [
  { handle: '@marie.fitcoach', niche: 'fitness', score: 38 },
  { handle: '@leo.cuisine', niche: 'cuisine', score: 52 },
  { handle: '@sacha.finance', niche: 'finance perso', score: 44 },
  { handle: '@nina.voyage', niche: 'voyage', score: 61 },
]

const NICHE_TICKER = [
  'fitness',
  'cuisine',
  'finance',
  'mode',
  'voyage',
  'sport',
  'beauté',
  'gaming',
  'productivité',
  'immobilier',
]

export interface LandingPageProps {
  children: ReactNode
}

export function LandingPage({ children }: LandingPageProps) {
  useEffect(() => {
    if (document.getElementById('cl-fonts')) return
    const link = document.createElement('link')
    link.id = 'cl-fonts'
    link.rel = 'stylesheet'
    link.href = FONTS_HREF
    document.head.appendChild(link)
  }, [])

  return (
    <div
      className="min-h-screen bg-[#0A0A0F] text-[#F5F5F7] antialiased selection:bg-violet-500 selection:text-white"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <GradientField />
      <Nav />
      <Hero />
      <NicheTicker />
      <ProblemSection />
      <HowItWorks />
      <DifferentiationSection />
      <DiagnosticPreview />
      <PricingSection />
      <FinalCTA />
      <section id="analyse" className="border-t border-neutral-900 bg-[#0A0A0F] py-16">
        {children}
      </section>
      <Footer />
    </div>
  )
}

function GradientField() {
  const reduce = useReducedMotion()
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        animate={reduce ? {} : { x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full opacity-[0.15] blur-3xl"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }}
      />
      <motion.div
        animate={reduce ? {} : { x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: 'radial-gradient(circle, #EC4899, transparent 70%)' }}
      />
      <motion.div
        animate={reduce ? {} : { x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-10rem] left-1/4 h-[28rem] w-[28rem] rounded-full opacity-[0.1] blur-3xl"
        style={{ background: 'radial-gradient(circle, #FB923C, transparent 70%)' }}
      />
    </div>
  )
}

function Nav() {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  useEffect(() => scrollY.on('change', (v) => setSolid(v > 40)), [scrollY])

  return (
    <motion.nav
      animate={{
        backgroundColor: solid ? 'rgba(10,10,15,0.75)' : 'rgba(10,10,15,0)',
        borderColor: solid ? 'rgba(38,38,47,1)' : 'rgba(38,38,47,0)',
      }}
      transition={{ duration: 0.3, ease: EASE }}
      className="sticky top-0 z-50 border-b backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div
          className="flex items-center gap-2 font-semibold tracking-tight"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-violet-400 via-pink-400 to-orange-300" />
          Creator Loop
        </div>
        <motion.a
          href="#analyse"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition-shadow hover:shadow-[0_0_24px_rgba(255,255,255,0.25)]"
        >
          Analyser mon compte
        </motion.a>
      </div>
    </motion.nav>
  )
}

function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % NICHES_DEMO.length), 3600)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-14 sm:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3.5 py-1.5 text-xs font-medium text-neutral-400"
          >
            <Sparkles size={13} className="text-violet-400" />
            Diagnostic gratuit en 30 secondes
          </motion.div>

          <h1
            className="text-6xl font-bold leading-[0.98] tracking-tight sm:text-7xl lg:text-[5.5rem]"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <RevealWords text="Arrête de deviner." delay={0.05} />
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
              <RevealWords text="Sache pourquoi." delay={0.32} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
            className="mt-6 max-w-md text-lg text-neutral-400"
          >
            Colle ton compte Instagram. Reçois ton diagnostic personnalisé et un plan de
            publication sur-mesure, jour par jour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <motion.a
              href="#analyse"
              whileHover={{ y: -2, boxShadow: '0 12px 32px -8px rgba(139,92,246,0.55)' }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-4 font-semibold text-white transition-shadow"
            >
              Analyser mon compte
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </motion.a>
            <span className="text-sm text-neutral-500">Gratuit · Sans carte bancaire</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="relative mx-auto w-full max-w-sm"
        >
          <FloatingCard>
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <LiveDiagnosticCard data={NICHES_DEMO[i]} />
              </motion.div>
            </AnimatePresence>
          </FloatingCard>
        </motion.div>
      </div>
    </section>
  )
}

function RevealWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(' ')
  return (
    <span className="inline">
      {words.map((w, i) => (
        <motion.span
          key={w}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.06, ease: EASE }}
          className="inline-block"
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </span>
  )
}

function FloatingCard({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      animate={reduce ? {} : { y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl shadow-black/40 backdrop-blur"
    >
      {children}
    </motion.div>
  )
}

function LiveDiagnosticCard({ data }: { data: (typeof NICHES_DEMO)[number] }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    mv.set(0)
    const controls = animate(mv, data.score, {
      duration: 1,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [data.score, mv])

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <AtSign size={14} />
        {data.handle}
      </div>
      <div className="mt-4 flex items-end gap-4">
        <div>
          <p className="text-5xl font-bold text-violet-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {display}
          </p>
          <p className="text-xs uppercase tracking-widest text-neutral-600">Score /100</p>
        </div>
        <span className="mb-1 rounded-full border border-neutral-800 px-2.5 py-1 text-xs text-neutral-400">
          niche : {data.niche}
        </span>
      </div>
      <div className="mt-4 space-y-1.5">
        <SkeletonLine w="90%" />
        <SkeletonLine w="70%" />
        <SkeletonLine w="80%" />
      </div>
    </div>
  )
}

function SkeletonLine({ w }: { w: string }) {
  return <div className="h-2 rounded-full bg-neutral-800" style={{ width: w }} />
}

function NicheTicker() {
  const items = [...NICHE_TICKER, ...NICHE_TICKER]
  return (
    <div className="relative border-y border-neutral-900 bg-neutral-950/60 py-4">
      <div className="mask-fade overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex w-max gap-8 whitespace-nowrap"
        >
          {items.map((n, i) => (
            <span key={`${n}-${i}`} className="text-sm font-medium uppercase tracking-widest text-neutral-700">
              {n} <span className="mx-8 text-neutral-800">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const PAINS = [
  {
    icon: HelpCircle,
    title: 'Tu ne sais jamais quoi publier',
    text: "Chaque jour, la même question sans réponse. L'idée n'arrive jamais assez vite.",
  },
  {
    icon: CalendarX,
    title: 'Ton rythme est irrégulier',
    text: "4 posts une semaine, rien pendant 15 jours. L'algorithme ne te fait plus confiance.",
  },
  {
    icon: TrendingDown,
    title: 'Tes vues stagnent',
    text: 'Tu publies, mais rien ne décolle. Sans savoir pourquoi, difficile de corriger.',
  },
]

function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <ScrollReveal>
        <h2
          className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Le problème n'est pas ton contenu.
        </h2>
        <p className="mt-3 max-w-md text-neutral-400">
          C'est l'absence de système. Voici ce qui bloque la majorité des comptes.
        </p>
      </ScrollReveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {PAINS.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.12}>
            <div className="h-full rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:border-neutral-700">
              <p.icon size={22} className="text-violet-400" />
              <p className="mt-4 font-semibold">{p.title}</p>
              <p className="mt-2 text-sm text-neutral-400">{p.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}

const STEPS = [
  {
    icon: AtSign,
    title: 'Colle ton compte',
    text: "Ton @ et ta niche suffisent. Rien d'autre à remplir.",
  },
  {
    icon: Target,
    title: 'Reçois ton diagnostic',
    text: 'Score, freins identifiés, et ce qui marche déjà pour toi — en 30 secondes.',
  },
  {
    icon: RefreshCw,
    title: 'Suis ton plan 30 jours',
    text: "Une mission par jour : idée, hook, script, plans à filmer. L'app s'adapte à ta régularité.",
  },
]

function HowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-5 py-24">
      <ScrollReveal>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Trois étapes. Pas plus.
        </h2>
      </ScrollReveal>

      <div className="relative mt-14">
        <div className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px bg-neutral-800 sm:block" />
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px origin-top bg-gradient-to-b from-violet-400 via-pink-400 to-orange-300 sm:block"
        />

        <div className="space-y-10">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.1}>
              <div className="flex gap-5 sm:gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950">
                  <s.icon size={18} className="text-violet-400" />
                </div>
                <div className="pt-1.5">
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-1 max-w-md text-sm text-neutral-400">{s.text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const COMPARISON = [
  {
    label: 'Sait où tu en es vraiment',
    us: 'Analyse ton compte réel, pas une feuille blanche',
    them: 'Tu pars de zéro, sans diagnostic',
  },
  {
    label: 'Te dit quoi publier',
    us: 'Une mission unique par jour, pas 50 options',
    them: 'Un chat vide où tu dois tout formuler',
  },
  {
    label: 'Vérifie que ça marche',
    us: 'Ré-analyse ton compte chaque semaine',
    them: 'Aucun suivi une fois le texte généré',
  },
  {
    label: 'Coût réel',
    us: '9,99 €/mois, plafonné',
    them: 'Gratuit en apparence, ton temps payé en frustration',
  },
]

function DifferentiationSection() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-24">
      <ScrollReveal>
        <p className="text-center text-sm font-medium uppercase tracking-widest text-violet-400">
          Pourquoi pas juste un chat IA
        </p>
        <h2
          className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Un générateur te donne du texte.
          <br />
          <span className="text-neutral-500">Ça ne te donne pas de résultat.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-center text-neutral-400">
          ChatGPT et les générateurs de contenu partent d'une page blanche et oublient qui tu es
          dès que tu fermes l'onglet. Creator Loop connaît ton compte, se souvient de ta
          progression, et s'adapte à ta régularité — semaine après semaine.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mt-12 overflow-hidden rounded-2xl border border-neutral-800">
          <div className="grid grid-cols-[1.3fr_1fr_1fr] bg-neutral-900/60 text-sm">
            <div className="p-4 text-neutral-500" />
            <div className="flex items-center gap-2 p-4 font-semibold text-violet-300">
              <Sparkles size={15} />
              Creator Loop
            </div>
            <div className="p-4 font-medium text-neutral-500">Chat IA générique</div>
          </div>

          {COMPARISON.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
              className="grid grid-cols-[1.3fr_1fr_1fr] border-t border-neutral-800 text-sm"
            >
              <div className="p-4 text-neutral-300">{row.label}</div>
              <div className="flex items-start gap-2 border-l border-neutral-800 bg-violet-500/[0.04] p-4 text-neutral-200">
                <Check size={15} className="mt-0.5 shrink-0 text-violet-400" />
                {row.us}
              </div>
              <div className="flex items-start gap-2 border-l border-neutral-800 p-4 text-neutral-500">
                <X size={15} className="mt-0.5 shrink-0 text-neutral-700" />
                {row.them}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}

function DiagnosticPreview() {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'start 40%'] })

  useEffect(
    () =>
      scrollYProgress.on('change', (v) => {
        if (v > 0.15 && !started.current) {
          started.current = true
          animate(mv, 41, { duration: 1.1, ease: EASE, onUpdate: (n) => setDisplay(Math.round(n)) })
        }
      }),
    [scrollYProgress, mv],
  )

  return (
    <section ref={ref} className="mx-auto max-w-3xl px-5 py-24">
      <ScrollReveal>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Un exemple de diagnostic réel.
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-7 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Score de croissance</p>
          <p className="mt-2 text-6xl font-bold text-violet-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {display}
            <span className="text-2xl text-neutral-600">/100</span>
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-neutral-400">
            « Ton compte a du potentiel mais il est freiné par 3 problèmes précis. Les deux
            premiers se corrigent cette semaine. »
          </p>

          <div className="relative mt-6 overflow-hidden rounded-xl border border-neutral-800">
            <div className="space-y-2 p-5 opacity-60 blur-[3px]" aria-hidden="true">
              <p className="text-left text-sm font-semibold">Jour 1 — Réécris ton bio</p>
              <p className="text-left text-xs text-neutral-500">
                Ta bio décrit. Elle doit promettre. Voici les 3 lignes exactes…
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/50">
              <a href="#analyse" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950">
                Voir mon propre diagnostic
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

function PricingSection() {
  return (
    <section className="mx-auto max-w-md px-5 py-24">
      <ScrollReveal>
        <h2 className="text-center text-3xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Un seul plan. Clair.
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500">Des limites définies, pas de facture surprise.</p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mt-8 rounded-2xl border border-violet-500/40 bg-neutral-900 p-6">
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold">Creator</p>
            <p>
              <span className="text-3xl font-bold">9,99 €</span>
              <span className="text-sm text-neutral-500"> /mois</span>
            </p>
          </div>
          <ul className="mt-5 space-y-2.5 text-sm text-neutral-300">
            {[
              'Plan 30 jours personnalisé',
              '30 scripts complets par mois',
              '1 ré-analyse de ton compte chaque semaine',
              'Suivi de ta régularité',
            ].map((li) => (
              <li key={li} className="flex gap-2.5">
                <Check size={16} className="mt-0.5 shrink-0 text-violet-400" />
                {li}
              </li>
            ))}
          </ul>
          <motion.a
            href="#analyse"
            whileHover={{ boxShadow: '0 10px 28px -8px rgba(139,92,246,0.55)' }}
            whileTap={{ scale: 0.99 }}
            className="mt-6 block rounded-xl bg-violet-500 px-6 py-4 text-center font-semibold text-white"
          >
            Commencer gratuitement
          </motion.a>
        </div>
      </ScrollReveal>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="relative mx-auto max-w-3xl px-5 py-24 text-center">
      <ScrollReveal>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Ton prochain post commence
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
            par un diagnostic.
          </span>
        </h2>
        <motion.a
          href="#analyse"
          whileHover={{ y: -2, boxShadow: '0 14px 36px -10px rgba(139,92,246,0.6)' }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-7 py-4 font-semibold text-white"
        >
          Analyser mon compte gratuitement
          <ArrowRight size={17} />
        </motion.a>
      </ScrollReveal>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-neutral-900 px-5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-neutral-600 sm:flex-row">
        <span>© {new Date().getFullYear()} Creator Loop</span>
        <span>Fait avec Claude Code</span>
      </div>
    </footer>
  )
}

function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
