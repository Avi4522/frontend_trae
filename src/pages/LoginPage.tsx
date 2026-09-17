import { useState, useEffect, type FormEvent } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  Search,
  BarChart3,
  FileText,
  Eye,
  EyeOff,
  Building2,
  Landmark,
} from 'lucide-react'
import { Button } from '../components/common/Button'
import {
  Card,
  CardContent,
  CardHeader,
} from '../components/common/Card'
import { Badge } from '../components/common/Badge'
import { Input, Label } from '../components/common/Input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/common/Select'
import { ThemeToggle } from '../components/common/ThemeToggle'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useToast } from '../hooks/useToast'
import { cn } from '../utils/cn'
import type { UserRole } from '../services/types'

type FormState = {
  email: string
  password: string
  role: string
  remember: boolean
}

type FormErrors = {
  email?: string
  password?: string
}

const demoCredentials = {
  investigator: {
    email: 'investigator@gov.in',
    password: 'demo1234',
    role: 'investigator',
    name: 'Investigator Sharma',
  },
  admin: {
    email: 'admin@gov.in',
    password: 'admin1234',
    role: 'admin',
    name: 'Admin Verma',
  },
}

const EASE_OUT: readonly [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]
const EASE_IN_OUT: readonly [number, number, number, number] = [0.42, 0, 0.58, 1]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useCurrentUser()
  const { success, error } = useToast()

  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    role: '',
    remember: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required'
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(email)) return 'Please enter a valid email address'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return undefined
  }

  const validateForm = (): FormErrors => {
    return {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    }
  }

  useEffect(() => {
    if (touched.email || touched.password) {
      setErrors(validateForm())
    }
  }, [form.email, form.password, touched.email, touched.password])

  const handleBlur = (field: keyof FormState) => {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true, role: true })

    const formErrors = validateForm()
    setErrors(formErrors)

    if (formErrors.email || formErrors.password) {
      error('Validation failed', 'Please fix the errors in the form.')
      return
    }

    setSubmitting(true)

    await new Promise((r) => setTimeout(r, 900))

    const role = (form.role || 'investigator') as UserRole
    const mockName =
      role === 'admin'
        ? demoCredentials.admin.name
        : demoCredentials.investigator.name

    login({
      name: mockName,
      email: form.email,
      role,
    })

    success('Welcome back, Investigator.', 'Redirecting…')
    setSubmitting(false)
    navigate('/dashboard')
  }

  const autofill = (role: 'investigator' | 'admin') => {
    const creds = demoCredentials[role]
    setForm({
      email: creds.email,
      password: creds.password,
      role: creds.role,
      remember: form.remember,
    })
    setTouched({})
    setErrors({})
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const leftItemVariants: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: EASE_OUT },
    },
  }

  const rightItemVariants: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: EASE_OUT },
    },
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background bg-grid-dot bg-[size:22px_22px]">
      <div className="pointer-events-none absolute inset-0 bg-bg-glow" />

      <div className="absolute right-4 top-4 z-20 lg:right-8 lg:top-8">
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:grid lg:grid-cols-2">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative hidden flex-col justify-between overflow-hidden lg:flex lg:h-screen lg:min-h-0"
        >
          <CyberBackdrop />
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-12 py-16">
            <motion.div variants={leftItemVariants} className="mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/40 bg-primary/15 shadow-glow-primary">
                  <ShieldCheck className="h-12 w-12 text-primary" strokeWidth={1.8} />
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={leftItemVariants}
              className="mb-4 text-center text-3xl font-bold leading-tight tracking-tight text-foreground"
            >
              ChainTrace Investigation Console
            </motion.h1>

            <motion.p
              variants={leftItemVariants}
              className="mb-10 max-w-md text-center text-sm text-muted-foreground"
            >
              Advanced on-chain analytics platform for law enforcement agencies.
              Trace, attribute, and report crypto asset flows with precision.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="flex w-full max-w-md flex-col gap-3"
            >
              <FeatureCard
                icon={Search}
                title="Multi-chain VASP attribution"
                desc="Identify wallet origins across 7+ networks"
                variants={leftItemVariants}
              />
              <FeatureCard
                icon={BarChart3}
                title="Interactive fund-flow graphs"
                desc="Visualize transaction hops in real-time"
                variants={leftItemVariants}
              />
              <FeatureCard
                icon={FileText}
                title="SAHYOG-ready reports"
                desc="Generate court-admissible evidence packs"
                variants={leftItemVariants}
              />
            </motion.div>
          </div>

          <motion.div
            variants={leftItemVariants}
            className="relative z-10 flex items-center justify-center px-12 pb-10"
          >
            <Badge variant="warning">Classified · For Authorized LEA Use Only</Badge>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="relative z-10 flex h-40 flex-col items-center justify-center gap-3 border-b border-border/40 bg-card/30 backdrop-blur-sm lg:hidden"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 shadow-glow-primary">
            <ShieldCheck className="h-8 w-8 text-primary" strokeWidth={1.8} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            ChainTrace Console
          </h1>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:h-screen lg:min-h-0 lg:px-16 lg:py-0"
        >
          <motion.div variants={rightItemVariants} className="w-full max-w-md">
            <Card size="lg" className="relative overflow-hidden shadow-glow-primary/30">
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />

              <CardHeader className="relative gap-2">
                <div>
                  <Badge variant="info">SIH-182 · LEA Access Portal</Badge>
                </div>
                <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-foreground">
                  Sign in to your account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, Investigator. Let&apos;s trace some wallets.
                </p>
              </CardHeader>

              <CardContent className="relative">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <motion.div
                    variants={rightItemVariants}
                    className="flex flex-col gap-1.5"
                  >
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="investigator@gov.in"
                      autoComplete="email"
                      value={form.email}
                      invalid={!!errors.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      onBlur={() => handleBlur('email')}
                      className={cn(
                        'transition-all duration-200',
                        'focus:shadow-[0_0_0_3px_rgb(var(--primary)/0.15)]',
                      )}
                    />
                    {errors.email && touched.email && (
                      <p className="text-xs text-danger">{errors.email}</p>
                    )}
                  </motion.div>

                  <motion.div
                    variants={rightItemVariants}
                    className="flex flex-col gap-1.5"
                  >
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        value={form.password}
                        invalid={!!errors.password}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, password: e.target.value }))
                        }
                        onBlur={() => handleBlur('password')}
                        className={cn(
                          'pr-10 transition-all duration-200',
                          'focus:shadow-[0_0_0_3px_rgb(var(--primary)/0.15)]',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-xs text-danger">{errors.password}</p>
                    )}
                  </motion.div>

                  <motion.div
                    variants={rightItemVariants}
                    className="flex flex-col gap-1.5"
                  >
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={form.role}
                      onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
                      placeholder="Select your role"
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investigator">LEA Investigator</SelectItem>
                        <SelectItem value="admin">System Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    variants={rightItemVariants}
                    className="flex items-center justify-between"
                  >
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                      <span className="relative flex h-4 w-4 items-center justify-center">
                        <input
                          type="checkbox"
                          checked={form.remember}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, remember: e.target.checked }))
                          }
                          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                        <span
                          className={cn(
                            'flex h-4 w-4 items-center justify-center rounded-md border-2 transition-all',
                            form.remember
                              ? 'border-primary bg-primary'
                              : 'border-input bg-background',
                            'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
                          )}
                        >
                          {form.remember && (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-3 w-3 text-primary-foreground"
                              stroke="currentColor"
                              strokeWidth={3.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      </span>
                      Remember this device
                    </label>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Forgot password?
                    </a>
                  </motion.div>

                  <motion.div variants={rightItemVariants}>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={submitting}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={rightItemVariants}
                    className="flex items-center gap-3 py-1"
                  >
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      or continue with
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </motion.div>

                  <motion.div
                    variants={rightItemVariants}
                    className="grid grid-cols-2 gap-3"
                  >
                    <Button type="button" variant="outline" size="md">
                      <Building2 className="h-4 w-4" />
                      mGov SSO
                    </Button>
                    <Button type="button" variant="outline" size="md">
                      <Landmark className="h-4 w-4" />
                      NIC eOffice
                    </Button>
                  </motion.div>
                </form>

                <motion.div
                  variants={rightItemVariants}
                  className={cn(
                    'mt-6 rounded-2xl border border-dashed border-border bg-muted/30 p-4',
                  )}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Demo Credentials
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <DemoRow
                      label="Investigator"
                      email={demoCredentials.investigator.email}
                      password={demoCredentials.investigator.password}
                      onAutofill={() => autofill('investigator')}
                    />
                    <DemoRow
                      label="Admin"
                      email={demoCredentials.admin.email}
                      password={demoCredentials.admin.password}
                      onAutofill={() => autofill('admin')}
                    />
                  </div>
                </motion.div>

                <motion.p
                  variants={rightItemVariants}
                  className="mt-6 text-center text-xs leading-relaxed text-muted-foreground"
                >
                  By signing in, you agree to the DPDP Act 2023 data handling policy
                  and are bound by LEA confidentiality obligations.
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  variants,
}: {
  icon: typeof Search
  title: string
  desc: string
  variants: Variants
}) {
  return (
    <motion.div
      variants={variants}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-card/60 hover:shadow-glow-primary/30"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
    </motion.div>
  )
}

function DemoRow({
  label,
  email,
  password,
  onAutofill,
}: {
  label: string
  email: string
  password: string
  onAutofill: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-background/50 p-2.5">
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-2">
          <Badge variant="glow" className="text-[10px] leading-none">
            {label}
          </Badge>
        </div>
        <p className="mt-1 truncate text-xs font-mono text-foreground">{email}</p>
        <p className="truncate text-xs font-mono text-muted-foreground">
          {password}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onAutofill}
        className="shrink-0"
      >
        Autofill
      </Button>
    </div>
  )
}

function CyberBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g stroke="rgb(var(--primary) / 0.18)" strokeWidth="1" fill="none">
          <motion.line
            x1="120" y1="180" x2="320" y2="120"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: EASE_IN_OUT }}
          />
          <motion.line
            x1="320" y1="120" x2="520" y2="220"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: EASE_IN_OUT, delay: 0.5 }}
          />
          <motion.line
            x1="520" y1="220" x2="680" y2="160"
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: EASE_IN_OUT, delay: 1 }}
          />
          <motion.line
            x1="120" y1="180" x2="200" y2="400"
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: EASE_IN_OUT, delay: 0.3 }}
          />
          <motion.line
            x1="200" y1="400" x2="420" y2="360"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: EASE_IN_OUT, delay: 0.8 }}
          />
          <motion.line
            x1="420" y1="360" x2="520" y2="220"
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: EASE_IN_OUT, delay: 1.2 }}
          />
          <motion.line
            x1="420" y1="360" x2="600" y2="520"
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: EASE_IN_OUT, delay: 0.6 }}
          />
          <motion.line
            x1="600" y1="520" x2="680" y2="160"
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: EASE_IN_OUT, delay: 1.5 }}
          />
          <motion.line
            x1="200" y1="400" x2="150" y2="680"
            animate={{ opacity: [0.22, 0.48, 0.22] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: EASE_IN_OUT, delay: 0.9 }}
          />
          <motion.line
            x1="150" y1="680" x2="420" y2="720"
            animate={{ opacity: [0.28, 0.52, 0.28] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: EASE_IN_OUT, delay: 1.1 }}
          />
          <motion.line
            x1="420" y1="720" x2="600" y2="520"
            animate={{ opacity: [0.24, 0.5, 0.24] }}
            transition={{ duration: 5, repeat: Infinity, ease: EASE_IN_OUT, delay: 0.7 }}
          />
          <motion.line
            x1="420" y1="720" x2="700" y2="780"
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 4.7, repeat: Infinity, ease: EASE_IN_OUT, delay: 1.3 }}
          />
        </g>

        {[
          { cx: 120, cy: 180, r: 5, delay: 0 },
          { cx: 320, cy: 120, r: 4, delay: 0.4 },
          { cx: 520, cy: 220, r: 6, delay: 0.8 },
          { cx: 680, cy: 160, r: 4.5, delay: 1.2 },
          { cx: 200, cy: 400, r: 5.5, delay: 0.2 },
          { cx: 420, cy: 360, r: 7, delay: 0.6 },
          { cx: 600, cy: 520, r: 5, delay: 1 },
          { cx: 150, cy: 680, r: 4.5, delay: 1.4 },
          { cx: 420, cy: 720, r: 6, delay: 0.5 },
          { cx: 700, cy: 780, r: 5, delay: 0.9 },
        ].map((node, i) => (
          <g key={i}>
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={node.r * 4}
              fill="url(#nodeGlow)"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                ease: EASE_IN_OUT,
                delay: node.delay,
              }}
            />
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill="rgb(var(--primary))"
              animate={{
                y: [0, -6, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 4 + (i % 4) * 0.5,
                repeat: Infinity,
                ease: EASE_IN_OUT,
                delay: node.delay,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
