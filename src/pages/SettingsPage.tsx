import { useMemo, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { useToast } from '../hooks/useToast'
import { apiServices } from '../services/mockData'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { Input, Label } from '../components/common/Input'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/common/Tabs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/common/Select'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '../components/common/Table'
import { ThemeToggle } from '../components/common/ThemeToggle'
import { cn, formatDate } from '../utils/cn'
import type { ApiService, User } from '../services/types'
import {
  User as UserIcon,
  KeyRound,
  Palette,
  Globe,
  Bell,
  Camera,
  Upload,
  Building2,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  Save,
  Mail,
  Smartphone,
  Activity,
  Database,
  Server,
  ExternalLink,
} from 'lucide-react'

type AccentColor = 'primary' | 'success' | 'accent' | 'warning'

const accentSwatches: Array<{ key: AccentColor; label: string; bg: string }> = [
  { key: 'primary', label: 'Cyan', bg: 'bg-primary' },
  { key: 'success', label: 'Green', bg: 'bg-success' },
  { key: 'accent', label: 'Purple', bg: 'bg-accent' },
  { key: 'warning', label: 'Amber', bg: 'bg-warning' },
]

type NotificationPref = {
  id: string
  event: string
  description: string
  email: boolean
  push: boolean
}

const initialNotifications: NotificationPref[] = [
  {
    id: 'case-updates',
    event: 'Case Updates',
    description: 'New hop attributed, status changed',
    email: true,
    push: true,
  },
  {
    id: 'high-risk',
    event: 'High-Risk Alerts',
    description: 'New VASP match > 0.70 on flagged clusters',
    email: true,
    push: true,
  },
  {
    id: 'weekly-digest',
    event: 'Weekly Digest',
    description: 'Monday 0900 hrs',
    email: true,
    push: false,
  },
  {
    id: 'sahyog-ack',
    event: 'SAHYOG Acknowledgements',
    description: 'When portal returns ACK',
    email: true,
    push: true,
  },
  {
    id: 'system-maintenance',
    event: 'System Maintenance',
    description: 'Scheduled API rotations',
    email: false,
    push: true,
  },
]

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 select-none">
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border transition-colors bg-muted">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={cn(
            'absolute inline-block h-4 w-4 transform rounded-full bg-white shadow transition-all left-1',
            checked && 'translate-x-5 bg-primary',
          )}
        />
      </span>
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </label>
  )
}

export default function SettingsPage() {
  const user = useAppStore((s) => s.auth.user)
  const theme = useAppStore((s) => s.ui.theme)
  const toggleTheme = useAppStore((s) => s.ui.toggleTheme)
  const pushToast = useAppStore((s) => s.ui.pushToast)
  const { success, info } = useToast()

  const defaultUser: User = useMemo(
    () =>
      user ?? {
        name: 'Inspector Sharma',
        email: 'investigator@gov.in',
        role: 'investigator',
      },
    [user],
  )

  const [profile, setProfile] = useState({
    fullName: defaultUser.name,
    email: defaultUser.email,
    department: 'State Cyber Cell · Delhi Police',
    badgeId: 'DL-4812',
    rank: 'Inspector-Cyber',
    mobile: '+91 98XXX XXXXX',
    district: 'New Delhi',
  })

  const [services, setServices] = useState<ApiService[]>(apiServices)
  const [revealKeyMap, setRevealKeyMap] = useState<Record<string, boolean>>({})
  const [testingId, setTestingId] = useState<string | null>(null)
  const [savingKeyId, setSavingKeyId] = useState<string | null>(null)
  const [keyValueMap, setKeyValueMap] = useState<Record<string, string>>({})

  const [accent, setAccent] = useState<AccentColor>('primary')

  const [sahyog, setSahyog] = useState({
    endpoint: 'https://sahyog.gov.in/api/v3',
    version: 'v3.2 — Current',
    clientId: 'LEA-DEL-CYBER-04812',
    clientSecret: '',
    dscUploaded: false,
    mtlsEnabled: true,
  })
  const [revealSecret, setRevealSecret] = useState(false)
  const [sahyogTesting, setSahyogTesting] = useState(false)

  const [notifications, setNotifications] = useState<NotificationPref[]>(initialNotifications)

  const selectedThemeIdx = theme === 'dark' ? 0 : theme === 'light' ? 1 : 2

  const handleSaveProfile = () => {
    pushToast({
      title: 'Profile updated successfully',
      description: 'Your changes have been saved to your account.',
      variant: 'success',
    })
  }

  const toggleServiceEnabled = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    )
  }

  const toggleKeyReveal = (id: string) => {
    setRevealKeyMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSaveKey = async (id: string) => {
    setSavingKeyId(id)
    await new Promise((r) => setTimeout(r, 600))
    setSavingKeyId(null)
    success('API key saved', `Credentials for ${services.find((s) => s.id === id)?.name} updated.`)
  }

  const handleTestConnection = async (id: string) => {
    setTestingId(id)
    await new Promise((r) => setTimeout(r, 800))
    setTestingId(null)
    const svc = services.find((s) => s.id === id)
    if (svc) {
      success(
        `Successfully connected to ${svc.name}`,
        'Latency 187ms · 200 OK',
      )
    }
  }

  const handleUploadPhoto = () => {
    info('Upload photo', 'Photo upload dialog (mock) opened.')
  }

  const handleResetAppearance = () => {
    setAccent('primary')
    info('Appearance reset', 'Theme and accent colors restored to defaults.')
  }

  const handlePickAccent = (c: AccentColor) => {
    setAccent(c)
    info('Accent color updated (mock)')
  }

  const handleSetThemeMode = (_mode: 'dark' | 'light' | 'system') => {
    toggleTheme()
  }

  const handleTestSahyog = async () => {
    setSahyogTesting(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSahyogTesting(false)
    success(
      'SAHYOG handshake successful',
      'mTLS 1.3 · Server cert verified · ACK: SAHYOG-ACK-7291',
    )
  }

  const handleUploadDsc = () => {
    setSahyog((s) => ({ ...s, dscUploaded: true }))
    success('DSC certificate uploaded', 'PFX file staged for mTLS handshake.')
  }

  const toggleNotification = (id: string, channel: 'email' | 'push') => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, [channel]: !n[channel] } : n,
      ),
    )
  }

  const saveNotifications = () => {
    success('Notification preferences saved')
  }

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Settings
              </CardTitle>
              <CardDescription>
                Manage profile, credentials, platform appearance, and portal integrations.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profile">
        <div className="flex overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="apikeys">
              <KeyRound className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="sahyog">
              <Globe className="h-4 w-4" />
              SAHYOG Portal
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6 space-y-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="relative">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-primary/20 text-4xl font-bold text-primary shadow-glow-primary/40">
                    {(profile.fullName || 'IS')
                      .split(' ')
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>
                  <button
                    type="button"
                    aria-label="Change avatar"
                    onClick={handleUploadPhoto}
                    className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex flex-col items-center gap-2 sm:items-start">
                  <p className="text-lg font-semibold">{profile.fullName}</p>
                  <p className="text-sm text-muted-foreground">{profile.department}</p>
                  <Button size="sm" variant="outline" onClick={handleUploadPhoto}>
                    <Upload className="h-3.5 w-3.5" />
                    Upload photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="mr-1 inline h-3.5 w-3.5" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">
                    <Building2 className="mr-1 inline h-3.5 w-3.5" />
                    Department / Agency
                  </Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badgeId">
                    <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />
                    Badge ID
                  </Label>
                  <Input
                    id="badgeId"
                    value={profile.badgeId}
                    onChange={(e) => setProfile({ ...profile, badgeId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank / Post</Label>
                  <Input
                    id="rank"
                    value={profile.rank}
                    onChange={(e) => setProfile({ ...profile, rank: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">
                    <Smartphone className="mr-1 inline h-3.5 w-3.5" />
                    Mobile
                  </Label>
                  <Input
                    id="mobile"
                    value={profile.mobile}
                    onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="district">District HQ</Label>
                  <Input
                    id="district"
                    value={profile.district}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="primary" size="md" onClick={handleSaveProfile}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="apikeys">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Blockchain API Services
                <Badge variant="info" className="ml-2">
                  {services.filter((s) => s.enabled).length} / {services.length} configured
                </Badge>
              </CardTitle>
              <CardDescription>
                Toggle enabled, paste keys, test connectivity for each service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {services.map((svc) => {
                  const revealed = !!revealKeyMap[svc.id]
                  const keyVal = keyValueMap[svc.id] ?? ''
                  const quotaPct = Math.min(
                    100,
                    Math.round((svc.quotaUsed / Math.max(1, svc.quotaTotal)) * 100),
                  )
                  return (
                    <Card key={svc.id} size="sm">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                              {svc.name.charAt(0)}
                            </span>
                            <div>
                              <CardTitle className="text-base">{svc.name}</CardTitle>
                              <CardDescription className="mt-1 line-clamp-2">
                                {svc.description}
                              </CardDescription>
                            </div>
                          </div>
                          <a
                            href={svc.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${svc.name} homepage`}
                          >
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <ToggleSwitch
                            checked={svc.enabled}
                            onChange={() => toggleServiceEnabled(svc.id)}
                            label="Enabled"
                          />
                          <Badge variant={svc.enabled ? 'success' : 'default'}>
                            {svc.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`key-${svc.id}`}>API Key</Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                id={`key-${svc.id}`}
                                type={revealed ? 'text' : 'password'}
                                placeholder="sk_live_xxxxxxxxxxxx"
                                value={keyVal}
                                onChange={(e) =>
                                  setKeyValueMap((prev) => ({
                                    ...prev,
                                    [svc.id]: e.target.value,
                                  }))
                                }
                              />
                              <button
                                type="button"
                                aria-label={revealed ? 'Hide key' : 'Reveal key'}
                                onClick={() => toggleKeyReveal(svc.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              >
                                {revealed ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            <Button
                              size="md"
                              variant="outline"
                              loading={savingKeyId === svc.id}
                              onClick={() => handleSaveKey(svc.id)}
                            >
                              <Save className="h-3.5 w-3.5" />
                              Save
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-muted-foreground">
                              Quota usage
                            </span>
                            <span className="tabular-nums">
                              {svc.quotaUsed.toLocaleString()} /{' '}
                              {svc.quotaTotal.toLocaleString()} · {quotaPct}% used
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                'h-full rounded-full bg-primary transition-all',
                                quotaPct >= 90
                                  ? 'bg-danger'
                                  : quotaPct >= 70
                                    ? 'bg-warning'
                                    : 'bg-primary',
                              )}
                              style={{ width: `${quotaPct}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <Server className="mr-1 inline h-3 w-3" />
                            Last synced: {formatDate(svc.lastSynced)}
                          </p>
                        </div>

                        <div className="pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            loading={testingId === svc.id}
                            onClick={() => handleTestConnection(svc.id)}
                          >
                            <Activity className="h-3.5 w-3.5" />
                            Test Connection
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>
                Personalize the look and feel of the ChainTrace workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Label>Theme</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select your preferred visual theme.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle size="md" />
                  <div className="inline-flex h-11 items-center gap-1 rounded-2xl border border-border/70 bg-muted/40 p-1">
                    {(['dark', 'light', 'system'] as const).map((m, i) => (
                      <Button
                        key={m}
                        size="sm"
                        variant={selectedThemeIdx === i ? 'secondary' : 'ghost'}
                        onClick={() => handleSetThemeMode(m)}
                      >
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <Label>Accent color presets</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pick an accent that works best for your workflow.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  {accentSwatches.map((sw) => (
                    <button
                      key={sw.key}
                      type="button"
                      onClick={() => handlePickAccent(sw.key)}
                      aria-label={`Select ${sw.label} accent`}
                      className={cn(
                        'relative h-10 w-10 rounded-full border-2 border-white ring-2 transition-all',
                        sw.bg,
                        accent === sw.key
                          ? 'ring-foreground/60 scale-110'
                          : 'ring-transparent hover:ring-foreground/20',
                      )}
                    >
                      {accent === sw.key ? (
                        <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow" />
                      ) : null}
                      <span className="sr-only">{sw.label}</span>
                    </button>
                  ))}
                  <div className="ml-2 text-sm text-muted-foreground">
                    {accentSwatches.find((s) => s.key === accent)?.label} selected
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" size="md" onClick={handleResetAppearance}>
                Reset to defaults
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sahyog">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  SAHYOG Portal Configuration
                </CardTitle>
                <Badge variant="info">Classified</Badge>
              </div>
              <CardDescription>
                Configure the secure mTLS channel to the national law-enforcement evidence
                exchange portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="sahyog-endpoint">Portal Endpoint URL</Label>
                  <Input
                    id="sahyog-endpoint"
                    value={sahyog.endpoint}
                    onChange={(e) => setSahyog({ ...sahyog, endpoint: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sahyog-version">Portal Version</Label>
                  <Select
                    value={sahyog.version}
                    onValueChange={(v) => setSahyog({ ...sahyog, version: v })}
                  >
                    <SelectTrigger id="sahyog-version">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v3.2 — Current">v3.2 — Current</SelectItem>
                      <SelectItem value="v3.1">v3.1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sahyog-clientid">Client ID</Label>
                  <Input
                    id="sahyog-clientid"
                    value={sahyog.clientId}
                    onChange={(e) => setSahyog({ ...sahyog, clientId: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="sahyog-secret">Client Secret</Label>
                  <div className="relative">
                    <Input
                      id="sahyog-secret"
                      type={revealSecret ? 'text' : 'password'}
                      placeholder="••••••••••••••••"
                      value={sahyog.clientSecret}
                      onChange={(e) => setSahyog({ ...sahyog, clientSecret: e.target.value })}
                    />
                    <button
                      type="button"
                      aria-label={revealSecret ? 'Hide secret' : 'Reveal secret'}
                      onClick={() => setRevealSecret((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {revealSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Agency DSC Certificate</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" size="md" onClick={handleUploadDsc}>
                      <Upload className="h-4 w-4" />
                      Upload DSC .pfx
                    </Button>
                    <Badge variant={sahyog.dscUploaded ? 'success' : 'default'}>
                      {sahyog.dscUploaded ? (
                        <>
                          <Check className="h-3 w-3" />
                          agency-dsc.pfx uploaded
                        </>
                      ) : (
                        'No file uploaded'
                      )}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:col-span-2 rounded-xl border border-border/60 bg-muted/20 p-4">
                  <div>
                    <p className="text-sm font-semibold">Mutual TLS (mTLS) Enabled</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enforce client-certificate challenge on every SAHYOG request.
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={sahyog.mtlsEnabled}
                    onChange={(v) => setSahyog({ ...sahyog, mtlsEnabled: v })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                variant="primary"
                size="md"
                loading={sahyogTesting}
                onClick={handleTestSahyog}
              >
                {sahyogTesting ? 'Testing handshake…' : 'Test Portal Connection'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be contacted about case activity and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Event</Th>
                    <Th className="text-center">Email</Th>
                    <Th className="text-center">Push</Th>
                    <Th>Description</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {notifications.map((n) => (
                    <Tr key={n.id}>
                      <Td className="font-medium">{n.event}</Td>
                      <Td className="text-center">
                        <div className="flex justify-center">
                          <ToggleSwitch
                            checked={n.email}
                            onChange={() => toggleNotification(n.id, 'email')}
                          />
                        </div>
                      </Td>
                      <Td className="text-center">
                        <div className="flex justify-center">
                          <ToggleSwitch
                            checked={n.push}
                            onChange={() => toggleNotification(n.id, 'push')}
                          />
                        </div>
                      </Td>
                      <Td className="text-muted-foreground">{n.description}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="primary" size="md" onClick={saveNotifications}>
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
