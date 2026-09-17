# SIH-182 Blockchain VASP Attribution System — Phase 1 Specification

## Problem

Law Enforcement Agencies (LEAs) receive unknown/unhosted cryptocurrency wallets from cybercrime, ransomware, fraud, and darknet investigations. Currently, manual tracing across multiple blockchain explorers is slow, non-standardized, and does not produce court-admissible evidence packages. Investigators lack an automated, visual, multi-chain tool that can:
1. Accept an arbitrary wallet address on any major chain
2. Trace funds through intermediate hops to the nearest VASP (Virtual Asset Service Provider) deposit address
3. Score attribution confidence with auditable reasoning
4. Visualize the fund-flow graph for case presentations
5. Generate a standardized report ready for submission to the SAHYOG Portal for disclosure/freezing requests.

## Users & Roles

| Role | Capabilities |
|---|---|
| **Unauthenticated Visitor** | View Landing page only |
| **LEA Investigator** | Login; create/view own investigations; run wallet traces; generate reports; submit (mock) SAHYOG requests |
| **Admin** | Full investigator access + user management, global case view, API key management, audit log |

## Goals (Phase 1 — Frontend + Architecture + Dashboard)

1. Deliver a **competition-winning, production-grade responsive frontend** with dark cyber-security aesthetic, smooth animations, and professional dashboard UX.
2. Establish a **clean, modular, future-proof file structure** that can absorb a real backend in Phase 2 without major rework.
3. Implement **all core screens with realistic mock data**: Landing, Login, Dashboard, Investigation Detail, Report Preview, Settings.
4. Build the **React Flow fund-flow visualization** and **Recharts analytics** that will later consume real API responses.
5. Produce the **avi.md** and **README.md** competition deliverables including 15–20 high-quality Jury Q&A.
6. No real blockchain tracing or backend API calls — everything is mocked but structurally ready for real integration.

## Non-Goals (Phase 1)

- Real blockchain node interaction or API integration
- Backend service, database, or authentication server
- Real PDF generation (mock preview only)
- Real SAHYOG Portal submission
- Real-time WebSocket tracing pipeline

## Functional Requirements

### F1 — Landing / Hero Page
- Dark hero section with animated node-graph background, tagline, problem/solution cards, workflow steps, feature grid, CTA to Login.
- Fully responsive; mobile hamburger navigation.
- Light/Dark mode toggle (default dark).

### F2 — Login / Role-Based Access (Mock)
- Email + Password form with "LEA Investigator" and "Admin" role selector.
- Mock validation + animated loading → redirect to Dashboard.
- Demo credentials displayed as helper text.

### F3 — Main Dashboard
- **Top Nav**: breadcrumbs, role badge, theme toggle, notifications, user menu.
- **Sidebar** (collapsible on mobile as drawer): Dashboard, Investigations, Wallets, Reports, Settings.
- **Hero / Welcome banner** with case coverage KPIs.
- **4 Metric cards**: Total Investigations, Wallets Traced, VASPs Identified, High-Risk Cases.
- **Create New Investigation**: Wallet address input + multi-chain selector (BTC, ETH, TRX, BNB, SOL, MATIC, USDT-ERC20…), Case ID, case notes, "Start Trace" button.
- **Real-time Tracing Status card**: animated stepper/stages with status badges (Queued → Address Parsing → Chain Lookup → Hop Analysis → VASP Matching → Complete).
- **Confidence Score card**: animated circular progress 0–100% with confidence breakdown (transaction volume, hop depth, label match quality, deposit-signature match).
- **Nearest VASP / Exchange card**: Exchange name (e.g., Binance, WazirX, Coinbase), risk score badge, hot-wallet label, country/jurisdiction, number of matched deposit signatures.
- **Risk Indicators panel**: badges for Ransomware, Darknet, Mixer/Tumbler, Cross-Chain Bridge, DeFi High-Risk, Sanctioned Entity — each with evidence tooltips.
- **Fund-Flow Graph (React Flow)**: source wallet → 2–3 intermediate hops → deposit addresses → exchange hot wallets. Edges show approximate USD amount; nodes color-coded by type; node click shows detail popover. Mini-map + controls.
- **Case List / Investigation Table**: case ID, wallet, chain, status, VASP match, confidence, risk, created date, action buttons (view). Filtering + sorting + search.
- **Trend chart (Recharts)**: weekly investigations + wallet-trace volume.
- **Action buttons**: "Generate Investigation Report" (opens Report preview), "Route to SAHYOG" (mock confirmation).

### F4 — Investigation Detail Page
- Header with case metadata, wallet chip, chain badge, status, confidence.
- **Timeline**: chronological trace events with icons.
- **Full React Flow fund-flow** (larger canvas).
- **Hop-by-hop table**: address, amount, timestamp, chain, labels.
- **VASP attribution evidence card**.
- **Risk timeline / events**.
- Same "Generate Report" + "Route to SAHYOG" actions.

### F5 — Report Preview / Download (Mock)
- Paper-styled report preview on screen with: Case ID, Investigator, Date, Wallet Summary, Fund Flow diagram placeholder, VASP Attribution with confidence, Risk Indicators, Evidence Log, SAHYOG request template.
- "Download PDF" (mock — downloads a placeholder message / toast) and "Print" buttons.

### F6 — Settings / API Key Management
- User profile section.
- **API Keys card**: list of services (Blockchair, Etherscan, BscScan, TronScan, Solscan, Moralis, Alchemy, Blockchain.com) each with status toggle, key input masked, test connection button, usage quota bar (mock).
- Appearance (theme), SAHYOG Portal credentials (mock), Notification preferences.

### F7 — Shared UI/UX
- Loading skeletons for all cards/graphs.
- Empty states with illustrations/text when no data.
- Error state banners with retry.
- Toast notifications for actions.
- Accessibility: semantic HTML, labels, focus styles, alt text.
- Mobile: hamburger drawer + bottom nav rail for primary actions.

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Tech Stack** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router v7, Zustand (store), Recharts, React Flow (@xyflow/react), Lucide icons, clsx + tailwind-merge (cn). |
| **Performance** | Build succeeds; dev HMR works; Lighthouse-style: First paint < 1.5s, bundle reasonable (< 750 kB gzipped for the scope). |
| **Responsive** | Mobile-first: breakpoints sm/md/lg/xl for phone, tablet, laptop, desktop. Dashboard usable from 360 px. |
| **Theme** | Dark default (navy/black bg, neon green/cyan accents), light mode toggle, consistent CSS variables wired in Tailwind config. |
| **Code Quality** | Strict TypeScript, no implicit any; consistent component naming (PascalCase); hooks `use*`, services `*Service`, utils pure. |
| **Reusability** | Components in `common/` generic; domain components compose from them; minimal duplication. |
| **Build** | `npm run build` passes with TS strict and oxlint default rules. |
| **Mock Data** | All API responses mocked in `services/mock*` typed via interfaces so Phase 2 swap-in is trivial. |

## Constraints & Dependencies

- Starter Vite + React + TS + Tailwind already present; build upon it, do not switch bundler/framework.
- Dependencies already declared: `@xyflow/react`, `framer-motion`, `lucide-react`, `react-router-dom`, `recharts`, `zustand`, `clsx`, `tailwind-merge` — use these; add no new heavy deps without approval (only small pure-utility OK).
- File structure must exactly match the user's spec (subdirs under `components/`, `pages/`, `services/`, `hooks/`, `utils/`, `store/`, `styles/`).
- Output must remain Frontend-only; no Node server code.

## Assumptions

- SAHYOG Portal submission is a mock confirmation dialog + status badge only.
- "Generate PDF" triggers a toast + print-dialog call for the preview screen.
- All wallet addresses shown are well-known test/example addresses; no real user data.
- Role-based views hide Admin-only nav items for non-admin users but do not enforce real authorization.

## Open Questions

> None for Phase 1; addressed through reasonable mock defaults.

---

## Acceptance Criteria

### Rule ACs

| ID | Type | Criterion | Evidence |
|---|---|---|---|
| AC1 | rule | Repository contains the required file structure under `src/` with subdirs `components/{common,dashboard,investigation,wallet,visualization}`, `pages/`, `services/`, `hooks/`, `utils/`, `store/`, `styles/` | `LS` output of `src/` |
| AC2 | rule | Route `/` renders Landing page with hero + features + CTA | Browser screenshot + DOM contains "VASP Attribution" |
| AC3 | rule | Route `/login` renders Login form with role selector; submitting redirects to `/dashboard` | Browser flow + URL transition |
| AC4 | rule | Dashboard (`/dashboard`) contains: metric cards (≥4), wallet input + chain selector, tracing status card, confidence score, nearest VASP card, risk indicators, React Flow graph, investigation table, trend chart, "Generate Report" + "Route to SAHYOG" buttons | DOM checks + screenshot |
| AC5 | rule | Investigation Detail `/investigations/:id` renders timeline + React Flow + hop table | DOM checks |
| AC6 | rule | Report Preview `/reports/:id` renders paper-styled view with "Download PDF" (mock) + "Print" | DOM + dialog/print triggered |
| AC7 | rule | Settings `/settings` lists ≥8 blockchain API services with toggle + masked key input + test button | DOM checks |
| AC8 | rule | Dark default theme; light-mode toggle changes UI persistently across navigation | Screenshot pair + localStorage `theme` key |
| AC9 | rule | Viewport 375×812 renders dashboard without horizontal scroll; mobile hamburger and bottom nav present | Screenshot + scroll width check |
| AC10 | rule | `npm run build` exits 0 (no TS/lint/build errors) | Command output |
| AC11 | rule | Files `avi.md` and `README.md` exist at project root with required content (avi: tech stack + ≥15 jury Q&A; README: overview + features + run instructions + screenshot placeholders) | File content checks |
| AC12 | rule | Zustand store + typed services separate; components do not hardcode mock objects directly (use hooks/services) | Code grep |
| AC13 | rule | Recharts trend chart renders with mocked weekly data | Screenshot |
| AC14 | rule | React Flow fund-flow renders ≥5 nodes (source → intermediates → deposit → exchange) with colored edges; controls/minimap visible | Screenshot |
| AC15 | rule | Loading skeletons, empty states, error states are each present on at least one page | DOM/screenshot |

### Rubric ACs

| ID | Type | Criterion | Scale | Threshold | Evidence |
|---|---|---|---|---|---|
| AC16 | rubric | Visual design quality: cyber/blockchain aesthetic (neon accents, glowing cards, subtle node backdrop, status badges), professional competition-grade | 0–3 (0=plain, 1=ok, 2=strong, 3=exceptional) | ≥2 | Full-page screenshot gallery |
| AC17 | rubric | Motion/animation quality: transitions, hover effects, metric count-ups, flow progress, theme fade — tasteful, not gratuitous | 0–3 | ≥2 | Screencap or visual review |
| AC18 | rubric | Code organization & reusability: components split correctly, low duplication, shared `common/*` used by screens | 0–3 | ≥2 | Code structure grep + file counts per subdir |
| AC19 | rubric | Responsive UX on 3 breakpoints (phone 375, tablet 768, laptop 1280): layout collapses gracefully, tap targets ≥44 px | 0–3 | ≥2 | Screenshots per breakpoint |
| AC20 | rubric | Competition deliverables completeness: avi.md Q&A depth (blockchain tracing, APIs, scalability, security, SAHYOG integration, legal, limitations, future scope) + README professionalism | 0–3 | ≥2 | Document review |
