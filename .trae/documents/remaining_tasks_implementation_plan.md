# Remaining Tasks Implementation Plan (SIH-182 VASP Attribution Frontend)

## Repository Research

### Current State — Completed Work
- **Task 1 (Architecture)**: Full foundation complete. File structure in place: `components/common/` (19 primitives: AppShell, Sidebar, TopNav, Card, Button, Badge, Input, Select, Table, Tabs, Skeleton, EmptyState, ProgressCircle, StatusStepper, Sparkline, ThemeToggle, Toast, MobileBottomNav), `services/` (types.ts, mockData.ts + 4 typed service wrappers), `hooks/` (5 hooks: useCurrentUser, useInvestigations, useTheme, useToast, useTrace), `store/appStore.ts` (Zustand with auth/ui/investigations slices + persist theme), routing (React Router v7 with protected layout), theming (dark/light CSS vars, Tailwind extended).
- **Task 2 (Landing Page)**: Fully implemented with hero, animated node-graph backdrop, problem/solution cards, 4-step workflow, 6-feature grid, security strip, final CTA, footer, mobile hamburger drawer, Framer Motion scroll reveal.
- **Task 3 (Login Page)**: Fully implemented with split layout, cyber backdrop SVG, form with Email/Password/Role, validation, demo credentials autofill, remember-me, animated loading state, redirect to dashboard.
- **Task 9 (avi.md)**: Tech stack section + 14+ jury Q&As written (truncated; content exists).
- **Task 10 (README.md)**: All 11 sections present with architecture diagram, screenshots table, file tree, tech stack, getting started, roadmap.

### Current State — Remaining (Stubs Only)
All following pages export only a `<div>stub</div>`:
1. `DashboardPage.tsx` — stub
2. `InvestigationsListPage.tsx` — stub
3. `InvestigationDetailPage.tsx` — stub
4. `ReportPreviewPage.tsx` — stub
5. `ReportsListPage.tsx` — stub
6. `WalletsPage.tsx` — stub
7. `SettingsPage.tsx` — stub
8. `WalletIdentityChip.tsx` (in `components/wallet/`) — exists but uninspected; may need completion

### Data Foundation Available
`services/mockData.ts` exports: `defaultTraceStages` (6 stages), `metrics` (4 KPI cards), `trendPoints` (8 weeks), `vasps` (10 exchanges), `riskIndicators` (6+), `investigations` (≥8 full cases with hops, trace stages), `apiServices` (8 blockchain APIs), `timelineEvents`.

### Primitives Available
All shadcn-style components in `components/common/` are typed, styled, and use `cn()`. React Flow and Recharts are installed. Zustand store has `addInvestigation`, `updateInvestigation`, `setCurrentTraceStage`, `pushToast` actions.

---

## Files and Modules

### Files to Modify (Stubs → Full Implementation)
- `src/pages/DashboardPage.tsx`: HeroBanner + 4 MetricCards + NewInvestigationForm + TracingStatusCard + ConfidenceScoreCard + NearestVASPCard + RiskIndicatorsPanel + FundFlowGraph (React Flow) + InvestigationsTable + TrendChart (Recharts) + Action Rail with Generate Report + Route to SAHYOG. Embed widgets as internal components or inline.
- `src/pages/InvestigationsListPage.tsx`: Search bar, Status filter chips, Chain filter, Reusable InvestigationsTable (extracted or inlined), Pagination mock, Empty state.
- `src/pages/InvestigationDetailPage.tsx`: Header with breadcrumbs + case metadata + wallet chip + confidence. Tabs: Overview (summary cards + compact FundFlow), Timeline (vertical chronological events with icons), Hops (table with all columns), Evidence (grid), Report (mini preview + CTA). 404 fallback for unknown `:id`.
- `src/pages/ReportPreviewPage.tsx`: Paper-styled A4 container with 8 sections (Letterhead, Executive Summary, Wallet Summary, Fund Flow, VASP Attribution, Risk Indicators, Evidence Log, SAHYOG Template + Signatures). Top toolbar: Back / Print / Download PDF (toast + window.print()). 404 for unknown id.
- `src/pages/ReportsListPage.tsx`: Simple table with report ID, case ID, date, status (Draft/Submitted), investigator, actions (View / Download).
- `src/pages/WalletsPage.tsx`: Search, chain filter, wallet table (address, chain, first seen, last active, total received, risk, linked cases). Reuse WalletIdentityChip.
- `src/pages/SettingsPage.tsx`: 5 sub-tabs via Tabs primitive. Profile (avatar, name, email, dept, badge ID, save). API Keys (8 service cards: Blockchair, Blockchain.com, Etherscan, BscScan, TronScan, Solscan, Moralis, Alchemy — each with toggle, masked key with eye, quota bar, Test Connection button that produces success toast). Appearance (theme toggle + accent color presets). SAHYOG Portal (endpoint, client id/secret masked, Test Connection). Notifications (email/push toggles).
- `src/components/wallet/WalletIdentityChip.tsx`: Ensure it has short address display, copy-to-clipboard onClick with toast, copy icon, optionally block explorer link placeholder.

### Files to Use / Import From (No changes needed unless bugs found)
- `src/services/mockData.ts`, `src/services/types.ts`
- `src/hooks/*` (useCurrentUser, useInvestigations, useTheme, useToast, useTrace)
- `src/components/common/*` (primitives)
- `src/store/appStore.ts` (Zustand actions)

---

## Implementation Steps (Dependency Order)

### Step 1: Utility helpers + WalletIdentityChip
- Confirm `cn` exists. Add any missing format helpers inline inside each page (`shortAddress`, `formatCrypto`, `formatUsd`, `formatDate`, `riskColor`, `confidenceColor`) — no new util file required to avoid churn; helper functions at top of consuming pages.
- Ensure `WalletIdentityChip.tsx` is complete: short address, copy button, onClick writes to clipboard, shows toast "Address copied".

### Step 2: DashboardPage (Biggest page)
Build widgets in this order, inline in DashboardPage with internal helper components (or folder `components/dashboard/` if page exceeds 500 lines):
1. **HeroBanner**: Welcome back + case coverage summary ("148 open cases · 9 escalated today · SAHYOG backlog 7")
2. **MetricsGrid**: 4 MetricCard using mockData.metrics with Framer Motion count-up (use `useInView` + `animate` value from 0 to target). Each card: icon (map string → Lucide), label, big number, delta with trend arrow up/down/flat.
3. **NewInvestigationForm**: WalletInput (text), ChainSelect (Select from Chain enum BTC/ETH/TRX/BNB/SOL/MATIC/USDT-ERC20), Case ID input, Notes textarea, "Start Trace" button. On submit: create new Investigation object, dispatch `addInvestigation` to store, then animate TracingStatusCard through 6 stages over ~6 seconds using `setCurrentTraceStage` on interval. Confidence score animates 0→92 over same period. Push success toast "Trace initiated: Case INV-XXXX".
4. **TracingStatusCard**: Use `StatusStepper` primitive with 6 stages (Queued → Parsing → Chain Lookup → Hop Analysis → VASP Match → Complete). Active stage highlights, done stages show check.
5. **ConfidenceScoreCard**: `ProgressCircle` at 87% with 4 sub-bars (Tx Volume 92%, Hop Depth 78%, Label Match 91%, Deposit Signature 89%) each as thin progress bars.
6. **NearestVASPCard**: Show Binance/WazirX — logo letter badge, name, jurisdiction, risk score, hot wallet count, "47 deposit signatures matched".
7. **RiskIndicatorsPanel**: 6 risk chips (Ransomware, Darknet, Mixer, Bridge, DeFi, Sanctioned) using Badge variants. Wrap each in a hover tooltip showing evidence string (use native `title` or simple absolute div).
8. **FundFlowGraph (React Flow)**: ≥5 nodes — SourceNode (green), 2 HopNodes (cyan), 1 DepositNode (amber), 1 ExchangeNode (purple). Custom node components with rounded cards. Custom edges show USD amount as label. Add Controls + MiniMap.
9. **InvestigationsTable**: ≥8 rows from mockData.investigations — columns: Case ID, Wallet (WalletIdentityChip), Chain (Badge), Status (Badge: Tracing/Review/Closed/Escalated/Pending), VASP match name, Confidence (0–100 with color tint), Risk level, Created Date, Actions (Eye icon → navigate `/investigations/:id`).
10. **TrendChart**: Recharts AreaChart or BarChart with `trendPoints` 8 weeks. Two series: investigations + traces. Axes labeled, legend, tooltip.
11. **Action Rail**: Two buttons: "Generate Investigation Report" → navigates `/reports/:id` (use current investigation or first case). "Route to SAHYOG" → window.confirm dialog "Submit case INV-XXXX to SAHYOG Portal?" → on yes: success toast "Submitted to SAHYOG Portal" + update investigation status in store to "Escalated" + add SAHYOG badge on row.
12. **Skeletons**: Wrap TrendChart, FundFlowGraph, InvestigationsTable initial render in 1s mock loading → show Skeleton rows.
13. Layout: CSS grid — lg: 12-col grid, stacked on mobile. Match cyber aesthetic: cards with subtle border glows, backdrop-blur, consistent `rounded-3xl`.

### Step 3: InvestigationsListPage
- Top bar: Search input (filter case IDs / wallet addresses), Status filter chips (All, In Progress, Complete, High Risk — use toggle Badges), Chain multi-select chips. Pagination controls (Prev / 1 2 / Next).
- InvestigationsTable (reuse logic from Dashboard or extract). When filters yield 0 rows, render EmptyState component with "No investigations match your filters" + "Clear filters" button.
- High Risk filter: map mockData list to rows where `riskLevel === 'high' | 'critical'`; confirm row count reduces.

### Step 4: InvestigationDetailPage
- Breadcrumbs: Dashboard / Investigations / `INV-XXXX`
- Header: case ID, WalletIdentityChip, chain Badge, status Badge, confidence ProgressCircle small inline
- Tabs (5): Overview | Timeline | Hops | Evidence | Report
  - **Overview**: 4 summary cards (Wallet Info, VASP Attribution, Confidence Breakdown, Risk). Below: compact FundFlow graph (half height).
  - **Timeline**: Vertical timeline. Each event: icon (map TimelineIconType → Lucide: Info, AlertTriangle, CheckCircle, ShieldAlert, Wallet, ArrowLeftRight), title, timestamp, description. Events ≥6 chronological.
  - **Hops**: Table with all `investigation.hops` columns: #, From, To, Amount (crypto), Amount USD, Block, Timestamp, Chain, Labels (Badges), Side (In/Out Badge).
  - **Evidence**: 3×N grid cards — each card: screenshot placeholder (gradient), title (e.g., "TxHash 0xabc… Block #18,421,337"), evidence type badge, timestamp.
  - **Report**: mini Report preview + button "Open Full Report" → `/reports/:id`.
- 404: If `useParams().id` not found in store investigations list, render NotFound component (or inline "Case not found").
- Mobile: TabsList becomes `overflow-x-auto` scroll row; cards stack.

### Step 5: ReportPreviewPage
- Sticky top toolbar: Left arrow Back, Print button (calls `window.print()`), Download PDF button (toast "PDF queued for generation. Using print as preview." + also calls `window.print()`).
- Paper container: white/light background even in dark theme (use `.light` force on container or explicit `bg-white text-gray-900`). Max-w-[210mm] (A4 width), aspect ~1:√2, shadow-2xl, p-10.
- 8 sections with headings:
  1. **Letterhead**: "VASP Attribution Investigation Report" big title, Case ID, Prepared for (Officer Name · Agency), Date, red "CLASSIFIED · LEO USE ONLY" banner.
  2. **1. Executive Summary**: 2–3 paras summarizing case, confidence, VASP.
  3. **2. Target Wallet Summary**: address, chain, activity window (dates), total received/sent table.
  4. **3. Fund Flow Diagram**: embed mini FundFlow graph or placeholder illustration (styled SVG placeholder box with text).
  5. **4. Nearest VASP Attribution**: table with name, risk score, jurisdiction, confidence %, deposit signature matches.
  6. **5. Risk Indicators**: Table of risk indicators — type, severity, evidence.
  7. **6. Chronological Evidence Log**: numbered list of events with timestamps.
  8. **7. SAHYOG Portal Request Template**: fields form layout — Case Reference, Officer, Date Range, Wallets, Signatures block.
- 404 for unknown report id.

### Step 6: ReportsListPage + WalletsPage
- **ReportsListPage**: Simple table — columns: Report ID, Case ID, Generated At, Status (Draft / Submitted / Acknowledged), Investigator, Actions (View → `/reports/:id`, Download → toast).
- **WalletsPage**: Search + chain filter chips, table: Address (WalletIdentityChip), Chain, First Seen, Last Active, Total Received (USD), Risk, Linked Cases (#). Empty state if no wallets match.

### Step 7: SettingsPage
- 5 tabs: Profile | API Keys | Appearance | SAHYOG Portal | Notifications
- **Profile**: Avatar mock (upload button disabled, shows initials), inputs: Name, Email, Department, Badge ID, Save button → toast "Profile updated".
- **API Keys** (grid 1–2 cols): 8 cards from `mockData.apiServices` (Blockchair, Blockchain.com, Etherscan, BscScan, TronScan, Solscan, Moralis, Alchemy). Each: toggle switch (enabled/disabled), name with description, masked Input (type="password" with Eye/EyeOff toggle on button right), Quota progress bar (quotaUsed/quotaTotal % with label "X / Y requests"), last synced text, "Test Connection" Button → onClick: 800ms loading → success toast "Successfully connected to {Service Name}".
- **Appearance**: Theme toggle already exists; add 3 accent color presets (Cyan / Green / Purple) as clickable swatches that update CSS var or store (simple approach: write a data attr on `<html>` or add class; for mock just show selection toast).
- **SAHYOG Portal**: Endpoint URL input (default `https://sahyog.gov.in/api/v3`), Client ID input, Client Secret (masked), "Test Portal Connection" button → success toast.
- **Notifications**: Toggle groups for email + push × (Case Updates, High-Risk Alerts, Weekly Digest, SAHYOG Ack). Each toggle is a checkbox styled like Login page.

---

## Dependencies and Considerations

- **React Flow**: Already installed `@xyflow/react`. Must import default styles: `import '@xyflow/react/dist/style.css'` in the file using it (DashboardPage + InvestigationDetailPage). Custom nodes: define `nodeTypes` map. For edges with amounts: use `label` prop on `<Edge>`.
- **Recharts**: Already installed. Use `ResponsiveContainer` wrapper with width="100%" height={280} to fill cards.
- **Framer Motion count-up**: Use `useMotionValue(0)` + `useTransform` + `animate(mv, target, { duration: 1.4, ease: 'easeOut' })`.
- **Zustand store actions**: Prefer dispatching actions (addInvestigation, updateInvestigation, pushToast) rather than local-only state so state survives navigation.
- **Dark/Light theme**: All new widgets MUST use CSS variables via Tailwind (`bg-background`, `text-foreground`, `border-border`, `bg-card`, `bg-muted`, `text-muted-foreground`, semantic color tokens `--primary`, `--success`, `--danger`, `--warning`, `--info`, `--graph-*`). Do NOT hard-code hex colors.
- **Mobile responsiveness**: Every grid must collapse below `md` or `lg`. Tables: wrap in `overflow-auto`. Use `sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Tap targets ≥44px (buttons/icons padding).
- **Clipboard API**: `navigator.clipboard.writeText(address)` wrapped in try/catch with success/error toast.
- **Print styles**: ReportPreviewPaper container — force white bg, black text. Ensure Tailwind print variant works: wrap paper in `@media print { ... }` via Tailwind `print:` utilities if needed; simplest: explicit class `print:shadow-none print:border-0`.
- **TypeScript strict**: All components typed. Prefer typed interfaces over inline `any`. Use existing types from `services/types.ts` (Investigation, WalletHop, VASP, RiskIndicator, ApiService, etc.).
- **No new dependencies**: All widgets achievable with existing deps (lucide-react icons, recharts, @xyflow/react, framer-motion, zustand, react-router-dom). If a tiny helper is needed, write it inline.

---

## Validation

### After Each Page
1. Type-check in IDE (no red squiggles).
2. Dev server: navigate to route → no console errors, no blank screens (except skeleton initial load).
3. Mobile view (375×812 in DevTools): no horizontal scroll; hamburger + bottom nav present.

### After All Pages
1. **`npm run build`** → must exit 0. Fix any TS strict / oxlint errors.
2. **`npm run lint`** → zero warnings or fixed.
3. **GetDiagnostics** → zero errors.
4. **Smoke flow (manual via dev server or checklist)**:
   - `/landing` → "Start Investigation" → `/login` → autofill investigator → submit → `/dashboard`.
   - Dashboard: "Start Trace" → observe TracingStepper advance stages; after complete, confidence shows ~92%.
   - Dashboard: click "View" on any case row → `/investigations/:id` → switch all 5 tabs.
   - Dashboard: "Generate Investigation Report" → `/reports/:id` → click "Print" → print dialog (or cancel).
   - Dashboard: "Route to SAHYOG" → confirm → toast appears + case row shows Escalated.
   - Sidebar: Investigations → list → filter "High Risk" → row count reduces.
   - Sidebar: Reports → list → view first → back.
   - Sidebar: Wallets → list → search string.
   - Sidebar: Settings → API Keys → Test Connection on Etherscan → success toast.
   - Theme toggle on TopNav → switches dark/light persistently across navigation (localStorage key exists).
   - Mobile 375px: dashboard vertical scroll only; bottom nav rail visible with 5 icons.
5. **Screenshot checklist (for rubrics)**: capture dashboard, investigation detail, report preview, settings — verify cards, graph, table rendered.
6. **React Flow node count**: inspect DOM or visually count nodes in dashboard flow ≥5.
7. **Recharts trend**: verify 8 bars/areas for W1–W8, axes labels visible.

---

## Risks

### R1: Vite build chunk size bloat from React Flow + Recharts
**Handling**: Vite already split vendor chunks in vite.config.ts (per memory summary). `@xyflow/react/dist/style.css` import adds ~20KB gzip. If build fails due to chunk size, add more manual chunk splits in `vite.config.ts.build.rollupOptions.output.manualChunks` (recharts separately, react-flow separately). Low risk given Phase 1 scope (<750KB gzip target is generous).

### R2: TypeScript strict missing index signatures / optional chaining on mock data
**Handling**: All mock data arrays typed from types.ts interfaces. Use `??` fallbacks for first item access (e.g., `Object.values(investigations)[0] ?? emptyInvestigation`), and guard params id lookups with `if (!inv) return 404`.

### R3: React Flow style import path mismatch
**Handling**: Verify `@xyflow/react/dist/style.css` is the correct path for installed version ^12.11.6. If not found, `node_modules` lookup to find actual CSS path; fallback: old `reactflow/dist/style.css` is deprecated but v12 may still alias.

### R4: window.print() blocked or not triggering in dev server context
**Handling**: `window.print()` is universally supported. The print button also shows toast "Print dialog opened" for visibility regardless. The PDF "Download" button also triggers same print for Phase 1 mock.

### R5: Mobile horizontal scroll on dense tables
**Handling**: Always wrap `<Table>` in `<div className="w-full overflow-auto rounded-2xl">` (already in `Table` primitive). Additionally, wrap entire dashboard content in `<div className="overflow-x-hidden">` at page root.

### R6: Framer Motion count-up SSR hydration mismatch
**Handling**: Dashboard is behind ProtectedLayout (client-only, post-login), so no SSR. Use `useInView` ref to start animation only when card is visible (avoids animation triggering while off-screen).

### R7: Copy-to-clipboard fails in non-secure context (http)
**Handling**: Vite dev server is http localhost — modern browsers still allow `navigator.clipboard` on localhost. Wrap in `try/catch`; on error, fallback to `execCommand('copy')` (deprecated but works) or toast error "Unable to copy".
