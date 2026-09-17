# SIH-182 VASP Attribution — Phase 1 Task Queue

Derived from [spec.md](./spec.md). Each task lists its **parent AC(s)**, **Test Requirements (TRs)**, and **Status**.

---

## Task 1: Bootstrap Architecture, Theming, Routing, Store, & Mock Service Layer

**Status: pending**
**Priority: high**
**Parents: AC1, AC10, AC12, AC18**
**Depends on: (none)**

### Scope

1. **File structure** — Create required empty placeholder files to satisfy AC1 structure:
   - `src/components/common/`, `src/components/dashboard/`, `src/components/investigation/`, `src/components/wallet/`, `src/components/visualization/`
   - `src/pages/`, `src/services/`, `src/hooks/`, `src/store/`
2. **Theming** — Extend Tailwind config + `src/styles/globals.css` with:
   - CSS variables for Dark/Light cyber palette (navy/black bg, neon green `#22c55e`, cyan `#22d3ee` accents, success/danger/warning, graph-*).
   - Background utility classes (`bg-grid`, `bg-glow`).
   - Document `:root` + `.light` schemes.
3. **Store (Zustand)** — `src/store/appStore.ts`:
   - `auth` slice: user, role, login/logout actions.
   - `ui` slice: theme (dark/light), sidebar open, toast queue, setters.
   - `investigations` slice: list map, current case id, loaders.
   - Typed actions, persist `theme` to localStorage.
4. **Router (React Router v7)** — `src/App.tsx` routes:
   - `/` → `LandingPage`
   - `/login` → `LoginPage`
   - `_auth/` layout (protected):
     - `/dashboard` → `DashboardPage`
     - `/investigations` → `InvestigationsListPage`
     - `/investigations/:id` → `InvestigationDetailPage`
     - `/reports/:id` → `ReportPreviewPage`
     - `/settings` → `SettingsPage`
   - 404 catch-all.
5. **Services + Types** — `src/services/`:
   - `types.ts`: interfaces `Investigation`, `WalletHop`, `VASP`, `RiskIndicator`, `TraceStage`, `TrendPoint`, `Metric`, `ApiService`.
   - `mockData.ts`: produce full realistic mock dataset (≥8 investigations, 2 full fund-flows with ≥8 hops, trend 8 weeks, metrics, VASP list, risk indicators, API services list).
   - `investigationService.ts`, `traceService.ts`, `reportService.ts`, `apiKeyService.ts` — thin typed async wrappers over `mockData.ts` (delay ~400ms) simulating APIs.
6. **Hooks** — `src/hooks/useTheme`, `useToast`, `useInvestigations`, `useTrace`, `useCurrentUser`.
7. **Utils** — Keep/extend `src/utils/cn.ts`; add `formatCrypto`, `shortAddress`, `formatDate`, `riskColor`.
8. **Delete** stale `App.css`, outdated imports. Update `main.tsx` to wrap `BrowserRouter`.
9. **App shell layout components** — `src/components/common/AppShell.tsx` (Sidebar + TopNav + Outlet), `Sidebar`, `TopNav`, `MobileBottomNav`, `ThemeToggle`, `ToastContainer`.
10. **Shadcn-style primitive components** in `common/`: `Button`, `Card`, `Badge`, `Input`, `Select`, `Table`, `Skeleton`, `EmptyState`, `ProgressCircle`, `StatusStepper`, `Sparkline`. All use `cn`, minimal, reusable.

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR1.1 | rule | Running `LS src/` shows subdirs: `assets components/{common,dashboard,investigation,wallet,visualization} pages services hooks utils store styles` | Shell `tree` / `LS` output |
| TR1.2 | rule | `src/store/appStore.ts` exports typed store with `{auth,ui,investigations}` slices, persists `theme` | TS compile + manual test |
| TR1.3 | rule | React Router routes match F1–F6 paths, protected layout required for `/dashboard`+ | Browser navigation from `/` |
| TR1.4 | rule | `src/services/types.ts` exports the 8 core interfaces; all services return typed Promise objects | TS strict build passes |
| TR1.5 | rule | Common primitives exist (Button, Card, Badge, Input, Select, Table, Skeleton, EmptyState, ProgressCircle, StatusStepper) in `components/common/` | `LS` + import graph |
| TR1.6 | rule | `npm run build` passes after task (baseline before adding screens) | Build exit 0 |
| TR1.7 | rubric | Theming: dark default palette matches cyber spec; light toggle works; CSS vars used consistently not hard-coded hex in components | 0–3, threshold ≥2, evidence: pair of screenshots + grep for `var(--` in `components/` |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 2: Landing / Hero Page

**Status: pending**
**Priority: high**
**Parents: AC2, AC8, AC9, AC16, AC17, AC19**
**Depends on: Task 1**

### Scope

1. `src/pages/LandingPage.tsx`
   - **Navbar** (simple public): Logo, Features, How it works, CTA → Login.
   - **Hero**: Headline ("Trace Unknown Crypto Wallets to VASPs. Automatically."), subhead, primary CTA "Start Investigation" (→ Login), secondary "See how it works". Animated node-graph backdrop using SVG circles/lines or Framer Motion particle field (cyber style).
   - **Problem / Solution contrast cards** (2 column: manual LEA pain points → our automated system value props).
   - **Workflow steps**: ① Submit Wallet ② Multi-Chain Trace ③ VASP Attribution ④ SAHYOG Report.
   - **Features grid** (6 cards): Multi-chain support, Confidence scoring, Risk indicators, React Flow graph, Report gen, SAHYOG integration.
   - **Trusted-by / partners strip** (mock: MCIT, NCRB, CDR, etc.).
   - **Footer**.
2. Mobile hamburger for landing nav; mobile stack for grids.
3. Smooth scroll reveal with Framer Motion.

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR2.1 | rule | Navbar contains logo + 3 nav links + Login button | DOM + screenshot |
| TR2.2 | rule | Hero headline present + 2 CTAs; "Start Investigation" navigates to `/login` | Click → URL change |
| TR2.3 | rule | Problem/Solution, Workflow (4), Features (6) sections render with cards ≥ 12 total | DOM count |
| TR2.4 | rule | 375px viewport: no horizontal scroll, mobile hamburger menu works | Screenshot pair |
| TR2.5 | rubric | Visual design (cyber backdrops, accents, spacing) — competition-grade | 0–3, ≥2, screenshot |
| TR2.6 | rubric | Animation tastefulness (hero reveal, scroll stagger) | 0–3, ≥2 |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 3: Login / Role-Based Access Page

**Status: pending**
**Priority: high**
**Parents: AC3, AC8, AC9, AC15, AC16, AC17**
**Depends on: Task 1**

### Scope

1. `src/pages/LoginPage.tsx`
   - Split layout (laptop): left animated panel (blockchain node artwork) + right form card.
   - Form fields: Email, Password, Role select (`LEA Investigator` / `Admin`).
   - Submit button with animated loading state; on submit simulate auth delay, call `login()` from store, redirect to `/dashboard`.
   - Demo credentials hint (e.g., `investigator@gov.in` / `demo1234`, admin variant).
   - Form validation (non-empty email) + error state toast.
   - Remember-me checkbox (mock).
2. Mobile: stacked layout.

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR3.1 | rule | Form includes Email, Password, Role selector, Submit | DOM |
| TR3.2 | rule | Submitting valid creds → redirects to `/dashboard`; `store.auth.user` set | URL + store |
| TR3.3 | rule | Submitting empty email shows inline error + toast | DOM + visual |
| TR3.4 | rule | 375px layout stacks correctly | Screenshot |
| TR3.5 | rule | Loading skeleton/loading state on button (≥1 state) | DOM during submit |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 4: Main Dashboard Page & Domain Components

**Status: pending**
**Priority: high**
**Parents: AC4, AC8, AC9, AC10, AC12, AC13, AC14, AC15, AC16, AC17, AC18, AC19**
**Depends on: Task 1**

### Scope

1. Dashboard layout via `AppShell` (sidebar + top nav) with Outlet.
2. `src/pages/DashboardPage.tsx` orchestrates:
   - `HeroBanner` (KPI coverage summary, case id summary)
   - `MetricsGrid` → 4 `MetricCard`s (Total Investigations, Wallets Traced, VASPs Identified, High-Risk Cases) with Framer Motion count-up.
   - `NewInvestigationForm` → `WalletInput` + `ChainSelect` + Case ID/notes + "Start Trace" (mock: creates new investigation in store, updates tracing status card animates through stages).
   - `TracingStatusCard` → `StatusStepper` (Queued → Parsing → Chain Lookup → Hop Analysis → VASP Match → Complete) with animated progress.
   - `ConfidenceScoreCard` → `ProgressCircle` (0–100%) and 4 sub-breakdown bars (tx volume, hop depth, label match, deposit signature).
   - `NearestVASPCard` → exchange name (logo/badge), risk score, jurisdiction, deposit signature matches count.
   - `RiskIndicatorsPanel` → chip badges with tooltips (Ransomware, Darknet, Mixer, Bridge, DeFi, Sanctioned).
   - `FundFlowGraph` (React Flow) with custom node types (`SourceNode`, `HopNode`, `DepositNode`, `ExchangeNode`), custom edges with amount labels, mini-map, controls.
   - `InvestigationsTable` → sortable/filterable case list with per-row action "View".
   - `TrendChart` (Recharts stacked area/bar) weekly investigations & traces.
   - Action Rail: "Generate Investigation Report" → navigate to `/reports/:id`, "Route to SAHYOG" → confirm dialog + success toast with pending badge.
3. Empty state for investigation table when 0 rows; skeleton for trend chart + flow graph on first load.

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR4.1 | rule | Dashboard contains all required 13 widgets (HeroBanner + 4 Metrics + NewInvestigationForm + TracingStatus + ConfidenceScore + NearestVASP + RiskIndicators + FundFlowGraph + InvestigationsTable + TrendChart + 2 buttons) | DOM count + screenshot |
| TR4.2 | rule | "Start Trace" creates a new case in Zustand store; TracingStepper runs through 6 stages over ~6s ending in Complete | Store + visual |
| TR4.3 | rule | Recharts TrendChart renders with 8 weekly data points; visible axes & legend | Screenshot |
| TR4.4 | rule | React Flow graph has ≥5 nodes: source + 2+ hops + 1 deposit + 1 exchange. Minimap + controls present. Edges labeled with amount. | Screenshot + node count |
| TR4.5 | rule | InvestigationsTable ≥ 8 rows, column headers include Case ID, Wallet, Chain, Status, VASP, Confidence, Risk, Date, Actions | DOM |
| TR4.6 | rule | "Generate Investigation Report" navigates to `/reports/:id` for selected/latest case | URL change |
| TR4.7 | rule | "Route to SAHYOG" opens confirm; on accept shows toast "Submitted to SAHYOG Portal" and status badge updates on case (mock) | Toast + store |
| TR4.8 | rule | Skeletons visible on initial render (for trend + table + flow, briefly) before mock load | Grep for `Skeleton` + screenshot on load |
| TR4.9 | rule | Risk panel shows ≥6 distinct chips; each renders tooltip on hover with mock evidence | DOM + hover |
| TR4.10 | rubric | Dashboard visual density, hierarchy, competition polish (glows, spacing, consistent padding, status badges, theming) | 0–3, ≥2, full dashboard screenshot |
| TR4.11 | rubric | Motion/animation (metric count-up, stepper progress, card hover, flow edges animate pulse) | 0–3, ≥2 |
| TR4.12 | rule | 375 px: AppShell collapses to hamburger drawer + bottom nav; dashboard scrolls vertically no horizontal | Screenshot + scrollWidth |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 5: Investigation Detail Page (Timeline + Full Visualization)

**Status: pending**
**Priority: high**
**Parents: AC5, AC8, AC9, AC14, AC16, AC19**
**Depends on: Task 1, Task 4 (reuse FundFlowGraph, RiskIndicatorsPanel)**

### Scope

1. `src/pages/InvestigationDetailPage.tsx`
   - Header: case ID, wallet chip with copy, chain badge, status pill, confidence score inline, breadcrumbs back to Investigations list.
   - **Tabs**: Overview, Timeline, Hops, Evidence, Report.
   - Overview: summary cards (Wallet Info, VASP Attribution, Confidence, Risk), embedded compact FundFlow.
   - Timeline tab: `TraceTimeline` component — chronological vertical timeline with event icons, event title, timestamp, detail.
   - Hops tab: data table with address, amount, USD value, block, timestamp, chain, labels, side (in/out).
   - Evidence tab: mock evidence grid (transaction links, screenshots, label matches).
   - Report tab: mini preview + CTA to full Report page.
2. Deep link `:id` resolves to store investigation; 404 if unknown id.

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR5.1 | rule | 5 Tabs present and switchable: Overview, Timeline, Hops, Evidence, Report | DOM click |
| TR5.2 | rule | Timeline has ≥6 chronological events with distinct icons and timestamps | DOM + screenshot |
| TR5.3 | rule | Hops table ≥ 8 rows with amount + address columns | DOM |
| TR5.4 | rule | Overview contains FundFlowGraph with ≥5 nodes (reuse) | Screenshot |
| TR5.5 | rule | Invalid `/investigations/does-not-exist` → 404 view | DOM |
| TR5.6 | rule | 375 px view: tabs collapse to scroll row, layout stacks | Screenshot |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 6: Report Preview / Download Page

**Status: pending**
**Priority: medium**
**Parents: AC6, AC8, AC15, AC16**
**Depends on: Task 1**

### Scope

1. `src/pages/ReportPreviewPage.tsx`
   - Paper-styled container (drop shadow, A4-ish ratio on large screens) with:
     - Letterhead: "VASP Attribution Investigation Report", Case ID, Prepared for, Date, Classified // LEO Use Only banner.
     - Section 1: Executive Summary
     - Section 2: Target Wallet Summary (address, chain, activity window, total received/sent)
     - Section 3: Fund Flow (placeholder diagram — embed mini FundFlow or static image placeholder)
     - Section 4: Nearest VASP Attribution (name, risk score, jurisdiction, confidence, deposit signature matches)
     - Section 5: Risk Indicators table
     - Section 6: Chronological Evidence Log
     - Section 7: SAHYOG Portal Request Template (fields)
     - Section 8: Digital Signatures block
   - Top toolbar: Back, Print, Download PDF (mock: triggers toast "PDF queued" + window.print() fallback).
2. Mobile: scroll vertically; toolbar sticky bottom.

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR6.1 | rule | Report has 8 named sections with headings | DOM |
| TR6.2 | rule | "Download PDF" button shows toast; calls window.print() | Console/spy |
| TR6.3 | rule | "Print" button invokes print | Console/spy |
| TR6.4 | rule | 404 for unknown `:id` | DOM |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 7: Settings / API Key Management Page

**Status: pending**
**Priority: medium**
**Parents: AC7, AC8, AC9, AC15, AC16**
**Depends on: Task 1**

### Scope

1. `src/pages/SettingsPage.tsx` with sub-tabs: Profile, API Keys, Appearance, SAHYOG Portal, Notifications.
2. **Profile tab**: user avatar upload mock, name, email, department, badge ID, save button.
3. **API Keys tab** — grid cards for each service (Blockchair, Blockchain.com, Etherscan, BscScan, TronScan, Solscan, Moralis, Alchemy):
   - Service name + logo/badge
   - Toggle (enabled/disabled)
   - Masked API key input (show/hide eye) + Save
   - Quota bar (mock) + last synced
   - "Test Connection" button → 200 success toast after ~800ms
4. **Appearance**: theme toggle accent color preset (cyan / green / purple).
5. **SAHYOG Portal**: endpoint URL mock, client ID/secret (masked), "Test Portal Connection" button.
6. **Notifications**: toggles for email/push for case updates, high-risk alerts, weekly digest.

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR7.1 | rule | 5 sub-tabs: Profile, API Keys, Appearance, SAHYOG Portal, Notifications | DOM |
| TR7.2 | rule | API Keys tab lists ≥ 8 services each with toggle, masked key, quota bar, Test Connection | DOM count |
| TR7.3 | rule | Clicking "Test Connection" on Etherscan produces success toast | DOM + toast |
| TR7.4 | rule | 375 px: settings tabs scroll horizontally, cards stack | Screenshot |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 8: Investigations List Page + Wallet Details Reusable

**Status: pending**
**Priority: medium**
**Parents: AC4 (table consistency), AC9, AC15, AC18**
**Depends on: Task 1, Task 4 (reuse InvestigationsTable)**

### Scope

1. `src/pages/InvestigationsListPage.tsx`
   - Search input, status filters (All / In Progress / Complete / High Risk), chain filters.
   - Reuse `InvestigationsTable` component.
   - Pagination (mock: 2 pages).
   - Empty state when filters match 0.
2. `src/components/wallet/WalletIdentityChip.tsx` — reusable chip with copy-to-clipboard + block explorer link placeholder.

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR8.1 | rule | List page has search + status + chain filters | DOM |
| TR8.2 | rule | Applying "High Risk" filter reduces list (at least one matches) | Row count |
| TR8.3 | rule | Empty state displays when filter yields 0 (e.g., search "zzz") | Screenshot |
| TR8.4 | rule | WalletIdentityChip shows short address and copies full address to clipboard on click | Clipboard value after click |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 9: Build avi.md — Tech Stack + Jury Questions (15–20 Q&A)

**Status: pending**
**Priority: high**
**Parents: AC11, AC20**
**Depends on: (Task 1 is fine but mostly independent)**

### Scope

Create `avi.md` at project root with:

1. **Full Tech Stack (Phase 1 + Planned Phase 2/3)**
   - Frontend (exact libs + roles)
   - State, routing, styling, charting, graph
   - Planned Backend (Python FastAPI / Node Nest — choose one)
   - Blockchain APIs (free tiers): Blockchair, Blockchain.com, Etherscan, BscScan, TronScan, Solscan, Moralis, Alchemy
   - Storage: PostgreSQL + Redis cache + S3 for report binaries
   - Security: JWT + RBAC, audit logs, PII encryption
   - SAHYOG Portal: planned REST client with mutual TLS / signed requests as per govt spec
2. **18 Jury Q&A** (must cover):
   - Blockchain tracing basics (UTXO vs account model)
   - How VASP attribution works (heuristics: co-spend, deposit-signature patterns, hot wallet labels, clustering)
   - Free API choices + rate limit strategy (fallback chain, caching, bulk endpoints)
   - Confidence scoring methodology
   - Multi-chain support architecture (BTC/ETH/TRX/BNB/SOL/MATIC)
   - Scalability: tracing 1000 wallets concurrently, hop depth 10
   - Cybersecurity: securing API keys, PII handling, LEA-only controls, auditability
   - SAHYOG integration: data format, digital signing, legal workflow
   - Legal admissibility: chain of custody, report integrity, timestamping
   - False positives / limitations: coinjoins, mixers, DeFi routing, privacy coins
   - Future scope: ZK-proof trace, cross-chain bridge attribution, automated freezing, federated LEA queries

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR9.1 | rule | `avi.md` exists at root; contains explicit sections: **Tech Stack (Frontend, Backend, Blockchain APIs, Storage, Security, SAHYOG)** and **Jury Questions & Answers** | File |
| TR9.2 | rule | Q&A count is ≥ 18 distinct questions with substantive answers (≥50 words avg) | Word + count |
| TR9.3 | rubric | Q&A depth and coverage (all 11 bullet points above are clearly addressed) | 0–3, ≥2 |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 10: Competition README.md

**Status: pending**
**Priority: high**
**Parents: AC11, AC20**
**Depends on: (independent)**

### Scope

Rewrite `README.md` (clean, professional, competition-style) with:

1. Title + tagline
2. Badges (Tech stack)
3. Problem statement (1 paragraph)
4. Solution overview (with architecture diagram placeholder)
5. **Key Features** bullets (10–12 bullets)
6. **Screenshots** placeholders (4–6 with alt text)
7. **File Structure** tree
8. **Tech Stack** condensed list
9. **Getting Started** — Prerequisites, Install, Run dev, Build
10. **Phase Roadmap** — Phase 1 (Frontend ✓), Phase 2 (Backend + Real APIs), Phase 3 (SAHYOG Integration + Deployment)
11. **Team / Acknowledgements** brief

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR10.1 | rule | README has all 11 sections listed | File headings |
| TR10.2 | rule | ≥ 4 screenshot placeholders (with alt + path placeholders) | File count |
| TR10.3 | rule | `npm install && npm run dev && npm run build` instructions present and match scripts in package.json | Diff check with package.json |
| TR10.4 | rubric | README professionalism (formatting, competition-presentation value) | 0–3, ≥2 |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 11: Build Verification, Dev Server Run, Final Polish

**Status: pending**
**Priority: high**
**Parents: AC10, AC16, AC19**
**Depends on: Tasks 1–10**

### Scope

1. Run `npm run build` — fix any TS/oxlint/build errors.
2. Run `npm run dev`, open on all 3 breakpoints, capture screenshots (evidence for rubrics).
3. Smoke-test all route flows: Landing → Login → Dashboard → create trace → Investigations → detail → report → settings.
4. Polish any visible regressions, fix contrast/accessibility, ensure bottom nav works on mobile pages.
5. GetDiagnostics check.

### Test Requirements

| ID | Type | TR | Evidence |
|---|---|---|---|
| TR11.1 | rule | `npm run build` exit 0 (zero errors) | Command output |
| TR11.2 | rule | Dev server starts (Vite ready msg); 3 URLs load without console errors | Browser console |
| TR11.3 | rule | Full smoke flow (Landing→Login→Dashboard→Investigations→Detail→Report→Settings) completes with no crashes | Manual flow |
| TR11.4 | rule | GetDiagnostics shows zero errors | Output |
| TR11.5 | rubric | Overall UI polish after smoke pass | 0–3, ≥2 |

### Completion Evidence
*(To be filled during Implement)*

---

## Task 12: Independent Review

**Status: pending**
**Priority: high**
**Parents: (Spec Mode Review phase)**
**Depends on: Tasks 1–11 completed**

*(Carried out in Review phase; creates/updates `review.md`.)*
