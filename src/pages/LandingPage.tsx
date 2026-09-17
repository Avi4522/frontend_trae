import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Link2,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  Network,
  Building2,
  FileBadge,
  Blocks,
  Target,
  AlertOctagon,
  GitBranch,
  FileText,
  Send,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { Button } from '../components/common/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { cn } from '../utils/cn'

const navLinks = [
  { label: 'Platform', href: '#features' },
  { label: 'Solutions', href: '#how-it-works' },
  { label: 'Resources', href: '#security' },
  { label: 'Company', href: '#faq' },
]

const problemItems = [
  'Manual multi-explorer hop tracing takes 2–6 weeks',
  'No standardized evidence package for court submission',
  'Ransomware/darknet funds vanish before freeze orders execute',
  'SAHYOG submission format not standardized across agencies',
]

const solutionItems = [
  'Automated multi-chain hop trace completes in 2–5 minutes',
  'Confidence-scored VASP attribution with visual fund-flow graph',
  'SAHYOG-ready PDF report with §65B Evidence Act compliance',
  '6-stage transparent pipeline: Queued → Parsing → Chain Lookup → Hop Analysis → VASP Match → Complete',
]

const workflowSteps = [
  {
    icon: Wallet,
    title: 'Submit Wallet',
    desc: 'Enter address + chain selector, attach case metadata — system validates and queues the investigation.',
  },
  {
    icon: Network,
    title: 'Multi-Chain Trace',
    desc: 'Parallel fan-out to Blockchair, Etherscan, BscScan, TronScan, Solscan with Moralis/Alchemy fallbacks.',
  },
  {
    icon: Building2,
    title: 'VASP Attribution',
    desc: 'Heuristic clustering + hot-wallet corpus + deposit-signature matching yields a weighted confidence score.',
  },
  {
    icon: FileBadge,
    title: 'SAHYOG Report',
    desc: '§65B-compliant signed PDF, SHA-256 manifest, RFC-3161 timestamp — 1-click route to SAHYOG Portal.',
  },
]

const featureCards = [
  {
    icon: Blocks,
    title: 'Multi-Chain Coverage',
    desc: 'BTC, ETH, TRX, BNB, SOL, MATIC plus all major USDT variants (ERC-20, TRC-20, BEP-20, SPL).',
  },
  {
    icon: Target,
    title: 'Confidence Scoring',
    desc: 'Weighted 6-factor formula producing a 0–100% score with fully auditable factor breakdown.',
  },
  {
    icon: AlertOctagon,
    title: 'Risk Indicators',
    desc: 'Flags for Ransomware, Darknet, Mixer, Bridge, DeFi protocols, and OFAC/UN Sanctioned addresses.',
  },
  {
    icon: GitBranch,
    title: 'Fund-Flow Graph',
    desc: 'React Flow visualization with mini-map, node click details, export, and layered hop traversal.',
  },
  {
    icon: FileText,
    title: 'Automated Reports',
    desc: '§65B compliant PDF, SHA-256 file manifest, and RFC-3161 trusted timestamp bundled per case.',
  },
  {
    icon: Send,
    title: 'SAHYOG Integration',
    desc: 'mTLS secured + DSC-signed request pipeline with end-to-end acknowledgement tracking.',
  },
]

const securityBadges = [
  { icon: '🔐', label: 'IT Act §65B Ready' },
  { icon: '🛡️', label: 'RBAC LEA-Only Access' },
  { icon: '⚖️', label: 'PMLA §12A Aligned' },
  { icon: '🔒', label: 'PII AES-256-GCM at rest' },
]

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]
const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: EASE_OUT },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

function NodeGraphBackdrop() {
  const nodes = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (i * 37 + 11) % 100,
    y: (i * 61 + 17) % 100,
    r: 1.2 + ((i * 19) % 12) / 10,
    delay: (i % 8) * 0.22,
    duration: 4 + (i % 5),
  }))

  const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 14) {
        lines.push({
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
        })
      }
    }
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full opacity-60"
      aria-hidden
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(34,211,238)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(34,211,238)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(34,211,238)" stopOpacity="0" />
          <stop offset="50%" stopColor="rgb(168,85,247)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgb(34,211,238)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {lines.map((l, i) => (
        <motion.line
          key={`l-${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="url(#lineGrad)"
          strokeWidth="0.12"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{
            duration: 5 + (i % 4),
            repeat: Infinity,
            delay: (i % 7) * 0.35,
            ease: EASE_IN_OUT,
          }}
        />
      ))}
      {nodes.map((n) => (
        <motion.g key={n.id}>
          <circle
            cx={n.x}
            cy={n.y}
            r={n.r * 3}
            fill="url(#nodeGlow)"
            opacity="0.3"
          />
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.id % 5 === 0 ? 'rgb(168,85,247)' : 'rgb(34,211,238)'}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
              y: [0, -0.6, 0],
            }}
            transition={{
              opacity: { duration: n.duration, repeat: Infinity, delay: n.delay },
              scale: { duration: n.duration, repeat: Infinity, delay: n.delay },
              y: { duration: n.duration + 1, repeat: Infinity, delay: n.delay, ease: EASE_IN_OUT },
            }}
          />
        </motion.g>
      ))}
    </svg>
  )
}

function HeroDashboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
      className="relative"
    >
      <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-primary/45 via-accent/25 to-primary/20 opacity-70 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#0d1524]/80 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.12),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">Live Investigation</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">Trace #INV-2026-0417</span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-xl font-bold tracking-tight text-white">Fund Flow Analysis</div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1">
                <CheckCircle2 className="h-3 w-3" />
                Transactions ▾
              </span>
            </div>
          </div>
          <div className="mt-8 overflow-hidden pb-2">
            <div className="flex min-w-0 items-start">
              {[
                { label: 'Source', sub: '0x7a2f…e41b', icon: Wallet, tone: 'text-cyan-200 border-cyan-300/40 bg-cyan-300/10' },
                { label: 'Hop 1', sub: '0x3b91…c28a', icon: Network, tone: 'text-violet-200 border-violet-300/35 bg-violet-300/10' },
                { label: 'Hop 2', sub: '0x8f44…a712', icon: Network, tone: 'text-violet-200 border-violet-300/35 bg-violet-300/10' },
                { label: 'Deposit', sub: '0x1d2e…9cf0', icon: Building2, tone: 'text-amber-200 border-amber-300/35 bg-amber-300/10' },
                { label: 'Binance Hot Wallet', sub: 'Hot Wallet 0x4', icon: ShieldCheck, tone: 'text-emerald-200 border-emerald-300/35 bg-emerald-300/10' },
              ].map((n, i) => (
                <div key={n.label} className="flex min-w-0 flex-1 items-start">
                  <div className="flex min-w-[62px] flex-1 flex-col items-center text-center">
                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-[0.85rem] border shadow-[0_0_24px_rgba(34,211,238,0.08)]', n.tone)}>
                      <n.icon className="h-4 w-4" />
                    </div>
                    <div className="mt-3 text-[10px] font-semibold leading-tight text-slate-300">{n.label}</div>
                  </div>
                  {i < 4 && <div className="mt-5 h-[1px] flex-1 bg-gradient-to-r from-cyan-300/30 via-violet-300/30 to-violet-300/30" />}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100">CONFIDENCE 92%</span>
            <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-100">VASP: BINANCE</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">CHAIN: ETH</span>
          </div>
          <div className="mt-6 grid grid-cols-3 divide-x divide-white/5 border-t border-white/5 pt-5 text-center">
            <div className="px-2"><div className="text-[10px] uppercase tracking-wide text-slate-500">Transaction Stats</div><div className="mt-1 text-xs font-semibold text-white">24.5k</div></div>
            <div className="px-2"><div className="text-[10px] uppercase tracking-wide text-slate-500">Transaction Stats</div><div className="mt-1 text-xs font-semibold text-white">1,232</div></div>
            <div className="px-2"><div className="text-[10px] uppercase tracking-wide text-slate-500">Analyzed Transaction</div><div className="mt-1 text-xs font-semibold text-white">30/Sk+</div></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('/')) {
      navigate(href)
    } else {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="landing-page relative min-h-screen overflow-x-hidden bg-[#070b14] text-slate-100">
      {/* NAVBAR */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-border/60 bg-background/70 backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/40 to-accent/40 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/35 bg-white/[0.06] text-cyan-200">
                <ShieldCheck className="h-5 w-5" />
                <Link2 className="absolute h-3 w-3 translate-x-2 translate-y-2 text-violet-200" />
              </div>
            </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Chain<span className="text-cyan-300">Trace</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(l.href)
                }}
                className="relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                {l.label}
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-white/[0.06] hover:text-white" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button variant="primary" size="sm" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200" onClick={() => navigate('/login')}>
                Start Investigation
              </Button>
            </div>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/70 text-foreground hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-md"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[85%] max-w-sm flex-col border-l border-border bg-card shadow-2xl"
            >
              <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="font-bold">ChainTrace</span>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-1 flex-col gap-1 p-4">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(l.href)
                    }}
                    className="rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="mt-auto space-y-2 pt-4 border-t border-border/60">
                  <Button variant="ghost" className="w-full" onClick={() => handleNavClick('/login')}>
                    Log In
                  </Button>
                  <Button variant="primary" className="w-full" onClick={() => handleNavClick('/login')}>
                    Start Investigation
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden pt-24 pb-16 sm:pt-28">
        <div className="absolute inset-0 bg-grid-dot bg-[size:28px_28px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        <div className="absolute inset-0">
          <NodeGraphBackdrop />
        </div>
        <div className="absolute left-1/2 top-24 -z-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-300/[0.07] blur-[120px]" />
        <div className="absolute right-10 top-40 -z-0 h-[380px] w-[380px] rounded-full bg-violet-400/[0.08] blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-xl"
            >
              <motion.div custom={0} variants={fadeUp}>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300 shadow-sm backdrop-blur-md">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300">✓</span>
                  SIH-2026 · SIH-182 AUTOMATED VASP ATTRIBUTION
                </div>
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl text-balance"
              >
                <span className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                  Trace Unknown Crypto<br/>Wallets to VASPs.<br/>Automatically.
                </span>
              </motion.h1>

              <motion.p
                custom={2}
                variants={fadeUp}
                className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed"
              >
                A multi-chain blockchain intelligence platform for Indian Law Enforcement —
                from unknown wallet to SAHYOG Portal submission in minutes, not weeks.
              </motion.p>

              <motion.div
                custom={3}
                variants={fadeUp}
                className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <Button size="lg" onClick={() => navigate('/login')} className="shadow-[0_0_24px_rgba(167,139,250,0.2)] bg-slate-700/80 hover:bg-slate-700 text-white font-medium border border-white/10 rounded-xl px-6">
                  Get In-store Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/10 bg-transparent text-white hover:bg-white/5 font-medium rounded-xl px-6"
                  onClick={() => {
                    const el = document.querySelector('#how-it-works')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Start Investigation
                </Button>
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeUp}
                className="mt-12"
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-4">
                  TRUSTED BY INDIAN LEA ECOSYSTEM
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-300 opacity-60">
                  {/* Mock seals using standard icons for now */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-800"><ShieldCheck className="h-5 w-5 text-slate-400"/></div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-800"><Building2 className="h-5 w-5 text-slate-400"/></div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-800"><ShieldCheck className="h-5 w-5 text-slate-400"/></div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-800"><Building2 className="h-5 w-5 text-slate-400"/></div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-800"><ShieldCheck className="h-5 w-5 text-slate-400"/></div>
                </div>
              </motion.div>
            </motion.div>

            <div className="hidden lg:block">
              <HeroDashboardMock />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.h2
              custom={0}
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              The Problem LEA Investigators Face{' '}
              <span className="bg-gradient-to-r from-danger to-warning bg-clip-text text-transparent">
                Every Day
              </span>
            </motion.h2>
            <motion.p
              custom={1}
              variants={fadeUp}
              className="mt-4 text-muted-foreground text-base sm:text-lg"
            >
              Traditional crypto tracing is manual, slow, and rarely produces court-ready packages.
              ChainTrace fixes each failure point with automation and compliance.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mt-12 grid gap-6 md:grid-cols-2"
          >
            <motion.div custom={2} variants={fadeUp}>
              <Card className="h-full border-danger/30 [&>div]:!bg-gradient-to-br [&>div]:!from-danger/[0.06] [&>div]:!to-transparent shadow-glow-danger">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/15 text-danger border border-danger/30">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">Before ChainTrace</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    Pain points reported by investigating officers across 14+ agencies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3.5">
                    {problemItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-danger/15 text-danger border border-danger/30">
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">{item}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div custom={3} variants={fadeUp}>
              <Card className="h-full border-success/30 [&>div]:!bg-gradient-to-br [&>div]:!from-success/[0.06] [&>div]:!to-transparent shadow-glow-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success border border-success/30">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">With ChainTrace</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    Automated, auditable, and SAHYOG-compliant from day one.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3.5">
                    {solutionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-success/15 text-success border border-success/30">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90">{item}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="how-it-works" className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-grid-dot bg-[size:28px_28px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div custom={0} variants={fadeUp}>
              <Badge variant="info" className="mb-4">WORKFLOW</Badge>
            </motion.div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              From Unknown Wallet to{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SAHYOG in 4 Steps
              </span>
            </motion.h2>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-4 text-muted-foreground text-base sm:text-lg"
            >
              Purpose-built around the standard LEA investigation lifecycle — no manual steps, no guesswork.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="relative mt-14 grid gap-6 md:grid-cols-4 md:gap-4"
          >
            {workflowSteps.map((step, idx) => (
              <motion.div key={step.title} custom={idx + 3} variants={fadeUp} className="relative">
                <Card className="relative h-full group hover:border-primary/40 transition-colors">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary shadow-glow-primary">
                          <step.icon className="h-6 w-6" />
                        </div>
                        <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[12px] font-black text-primary-foreground shadow-lg">
                          {idx + 1}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-base mt-4">{step.title}</CardTitle>
                    <CardDescription className="text-[13px] leading-relaxed">{step.desc}</CardDescription>
                  </CardHeader>
                </Card>
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 z-10 -translate-y-1/2">
                    <ChevronRight className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div custom={0} variants={fadeUp}>
              <Badge variant="glow" className="mb-4">FEATURES</Badge>
            </motion.div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Built for{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                LEA-Grade Cyber Investigations
              </span>
            </motion.h2>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-4 text-muted-foreground text-base sm:text-lg"
            >
              Every feature designed around court-admissibility, speed, and multi-chain coverage.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featureCards.map((f, idx) => (
              <motion.div key={f.title} custom={idx + 3} variants={fadeUp}>
                <Card className="h-full group hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                  <CardHeader>
                    <div className="flex h-[36px] w-[36px] items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 text-primary">
                      <f.icon className="h-[20px] w-[20px]" />
                    </div>
                    <CardTitle className="text-base mt-4">{f.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{f.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECURITY / COMPLIANCE STRIP */}
      <section id="security" className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <Card className="overflow-hidden border-primary/30">
              <CardContent className="py-6">
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  {securityBadges.map((b, i) => (
                    <motion.div
                      key={b.label}
                      custom={i}
                      variants={fadeUp}
                      className="flex items-center justify-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3"
                    >
                      <span className="text-2xl">{b.icon}</span>
                      <span className="text-sm font-semibold text-foreground/90 text-center">
                        {b.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ (anchor target, minimal) */}
      <section id="faq" className="sr-only">
        <div aria-hidden="true" />
      </section>

      {/* FINAL CTA */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="relative overflow-hidden rounded-[2rem] border border-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/15" />
            <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-primary/30 blur-[140px]" />
            <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-accent/30 blur-[140px]" />
            <div className="absolute inset-0 bg-grid-dot bg-[size:26px_26px] opacity-20" />

            <div className="relative px-6 py-14 sm:px-12 sm:py-20 text-center">
              <motion.h2
                custom={0}
                variants={fadeUp}
                className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-balance"
              >
                Ready to trace your{' '}
                <span className="bg-gradient-to-r from-primary via-cyan-200 to-accent bg-clip-text text-transparent">
                  first wallet?
                </span>
              </motion.h2>
              <motion.p
                custom={1}
                variants={fadeUp}
                className="mt-4 text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto"
              >
                Onboard your agency in under 15 minutes. Free during SIH-2026 evaluation period.
              </motion.p>
              <motion.div
                custom={2}
                variants={fadeUp}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:items-center"
              >
                <Button size="lg" onClick={() => navigate('/login')} className="shadow-glow-primary">
                  Start Investigation Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  Request Demo for Agency
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border/70 bg-card/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/40 bg-card/80">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Chain<span className="text-primary">Trace</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Automated VASP attribution and SAHYOG-compliant reporting for Indian Law Enforcement.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Product</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing for agencies</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Legal</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy per DPDP 2023</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Contact</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li className="text-muted-foreground">SIH-182 Team</li>
                <li className="text-muted-foreground">Smart India Hackathon 2026</li>
                <li className="text-muted-foreground">MeitY · Govt. of India</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border/60 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
            <p>© 2026 ChainTrace · Built for Smart India Hackathon 2026 · SIH-182</p>
            <p>All cryptographic proofs are verifiable on-chain.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
