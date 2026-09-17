# ChainTrace — Automated VASP Attribution for Law Enforcement

> Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs

ChainTrace enables law enforcement agencies (LEAs) to rapidly attribute unidentified cryptocurrency wallets to licensed Virtual Asset Service Providers, producing court-admissible evidence packages ready for SAHYOG Portal submission.

---

<span style="display:inline-block;padding:4px 10px;margin:2px;border-radius:4px;background:#2563eb;color:#fff;font-size:12px;font-weight:600;">React 18</span>
<span style="display:inline-block;padding:4px 10px;margin:2px;border-radius:4px;background:#3178c6;color:#fff;font-size:12px;font-weight:600;">TypeScript</span>
<span style="display:inline-block;padding:4px 10px;margin:2px;border-radius:4px;background:#646cff;color:#fff;font-size:12px;font-weight:600;">Vite</span>
<span style="display:inline-block;padding:4px 10px;margin:2px;border-radius:4px;background:#38bdf8;color:#fff;font-size:12px;font-weight:600;">Tailwind CSS</span>
<span style="display:inline-block;padding:4px 10px;margin:2px;border-radius:4px;background:#1a365d;color:#fff;font-size:12px;font-weight:600;">React Flow</span>
<span style="display:inline-block;padding:4px 10px;margin:2px;border-radius:4px;background:#0ea5e9;color:#fff;font-size:12px;font-weight:600;">Recharts</span>
<span style="display:inline-block;padding:4px 10px;margin:2px;border-radius:4px;background:#7c3aed;color:#fff;font-size:12px;font-weight:600;">Framer Motion</span>
<span style="display:inline-block;padding:4px 10px;margin:2px;border-radius:4px;background:#f59e0b;color:#fff;font-size:12px;font-weight:600;">Zustand</span>
<span style="display:inline-block;padding:4px 10px;margin:2px;border-radius:4px;background:#16a34a;color:#fff;font-size:12px;font-weight:600;">Phase 1 · Frontend Ready</span>

---

## Problem Statement

Law enforcement agencies investigating cryptocurrency-related crimes face critical bottlenecks: unidentified wallet addresses cannot be linked to real-world entities without laborious manual cross-referencing across siloed blockchain explorers; SAHYOG Portal submissions require standardized evidence packages that take days to assemble manually; multi-chain transactions fragment investigative trails across Bitcoin, Ethereum, and other networks; and the absence of a unified attribution pipeline leads to inconsistent evidence quality that risks rejection during judicial proceedings.

## Solution Overview

ChainTrace delivers an end-to-end blockchain intelligence platform that automates wallet-to-VASP attribution through a six-stage analytical pipeline, consuming multi-chain transaction data via industry-standard blockchain APIs and cross-referencing against a curated VASP label database. The system produces a quantified confidence score alongside structured risk indicators, rendering the full fund-flow topology as an interactive graph and generating court-ready reports formatted for direct SAHYOG Portal submission.

The architecture follows a clear separation of concerns: a law-enforcement-grade frontend provides secure, role-based access to investigation workspaces, while a backend orchestration layer handles trace execution, result caching, and evidence compilation. Phase 1 delivers the complete responsive frontend with mock data and production-ready architecture; Phase 2 integrates real blockchain API adapters and persistence layers; Phase 3 completes production deployment with SAHYOG mTLS integration and signed PDF reports.

```text
                        ChainTrace Architecture
┌──────────────────────────────────────────────────────────────┐
│                         Frontend (React 18)                  │
│  ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Dashboard│ │Investigation│ │ Wallet   │ │ Report Gen   │  │
│  └─────┬────┘ └─────┬──────┘ └─────┬────┘ └──────┬───────┘  │
└────────┼────────────┼──────────────┼─────────────┼──────────┘
         │            │              │             │
         ▼            ▼              ▼             ▼
┌──────────────────────────────────────────────────────────────┐
│                      Backend API Layer (FastAPI)             │
└────────┬─────────────────────┬────────────────┬──────────────┘
         │                     │                │
         ▼                     ▼                ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Blockchain APIs │  │  VASP Label DB  │  │  Redis Cache    │
│  (TronScan,      │  │  (Labeled       │  │  (Result Cache, │
│   Blockchair,    │  │   Addresses)    │  │   Rate Limit)   │
│   Etherscan)     │  └─────────────────┘  └─────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  PostgreSQL     │  │  SAHYOG Client  │  │  PDF / Report   │
│  (Investigations│  │  (mTLS Auth,    │  │  Signing Engine │
│   Users, Cases) │  │   Submission)   │  │                 │
└─────────────────┘  └────────┬────────┘  └─────────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  SAHYOG Portal  │
                     └─────────────────┘
```

## Key Features

- **Multi-chain wallet trace** across Bitcoin, Ethereum, Tron, and 12+ supported networks with unified address normalization.
- **Six-stage attribution pipeline** encompassing address resolution, transaction graph traversal, clustering heuristics, label matching, risk scoring, and evidence bundling.
- **React Flow fund-flow visualization** rendering upstream/downstream transaction topology with zoom, pan, node inspection, and path highlighting.
- **Quantified confidence scoring** (0–100) per VASP attribution with weighted sub-scores for transaction volume, timing correlation, and counterparty density.
- **Six risk indicator categories**: mixing service exposure, sanctioned-entity interaction, structuring patterns, high-velocity churning, cross-chain tumbling, and darknet marketplace linkage.
- **Automated report generation** producing standardized evidence packages with transaction CSV exports, graph snapshots, and chain-of-custody metadata.
- **SAHYOG-ready submission** with pre-mapped field schemas, digitally signed manifests, and compliant attachment packaging for direct portal upload.
- **Role-based access control (RBAC)** supporting Investigator, Supervisor, and Auditor roles with granular permission scopes and audit logging.
- **LEA-grade dark UI** with high-contrast typography, reduced motion defaults, OPSEC-aware session management, and no third-party analytics.
- **Responsive mobile-first design** with full workspace parity across desktop, tablet, and field-deployed mobile devices.
- **Dual dark/light theme** with persistent user preference and system-color-scheme fallback for varied workstation environments.
- **Mock API-ready architecture** with service interface abstractions enabling backend integration via dependency swap without UI refactoring.

## Screenshots

| 01 Landing Hero | 02 Login Screen | 03 Main Dashboard |
|---|---|---|
| ![Landing Page](./docs/screenshots/01-landing.png)<br>*Landing hero with capability overview and secure authentication entry point.* | ![Login Screen](./docs/screenshots/02-login.png)<br>*RBAC-aware authentication with agency ID, two-factor support, and session controls.* | ![Main Dashboard](./docs/screenshots/03-dashboard.png)<br>*Investigator dashboard with active caseload, attribution statistics, and risk trend panel.* |
| **04 Fund Flow Graph** | **05 Investigation Detail** | **06 Report Preview** |
| ![Fund Flow Graph](./docs/screenshots/04-fundflow.png)<br>*Interactive React Flow visualization of upstream/downward transaction topology with VASP node attribution.* | ![Investigation Detail](./docs/screenshots/05-investigation.png)<br>*Case workspace with confidence scorecard, six-category risk indicators, and chronological timeline.* | ![Report Preview](./docs/screenshots/06-report.png)<br>*Court-admissible report preview with transaction evidence, graph exhibits, and SAHYOG submission readiness checklist.* |

## Project Structure

```text
SIH-182(TRAE)/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── investigation/
│   │   ├── wallet/
│   │   └── visualization/
│   ├── pages/
│   ├── services/
│   │   └── mockData.ts
│   ├── hooks/
│   ├── utils/
│   │   └── cn.ts
│   ├── store/
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── avi.md
├── README.md
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── postcss.config.js
├── .oxlintrc.json
├── .gitignore
└── index.html
```

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 18, TypeScript, React Router DOM, Vite |
| State Management | Zustand (global store), React Context (theming) |
| Visualization | React Flow (@xyflow/react), Recharts |
| Theming | Tailwind CSS, Framer Motion, tailwind-merge, clsx |
| Icons | Lucide React |
| Linting | Oxlint |
| Build Tool | Vite 7, TypeScript Compiler (tsc) |
| *(Phase 2 Planned) Backend* | FastAPI, Pydantic v2, httpx, asyncio |
| *(Phase 2 Planned) Blockchain APIs* | TronScan, Blockchair, Etherscan, Tatum, Amberdata |
| *(Phase 2 Planned) Storage* | PostgreSQL, Redis, S3-compatible object storage |

## Getting Started

### Prerequisites

- **Node.js** 20.0 or higher
- **npm** 10.0 or higher

### Installation

```bash
cd SIH-182(TRAE)
npm install
```

### Development

```bash
npm run dev
```

Application will be served at: **http://localhost:5173**

### Build

```bash
npm run build
```

Production artifacts are emitted to the `dist/` directory.

### Preview

```bash
npm run preview
```

Serves the production build locally for pre-deployment validation.

### Lint

```bash
npm run lint
```

Runs Oxlint across the codebase with configured rule set.

## Phase Roadmap

| Phase | Deliverables | Status |
|---|---|---|
| Phase 1 | Complete responsive Frontend, mock data, theming, routing, store, all pages, README + avi.md deliverables | ✅ Done (This commit) |
| Phase 2 | FastAPI Backend, real blockchain API adapters, VASP label database, real trace pipeline, PostgreSQL + Redis | 🔜 Upcoming |
| Phase 3 | SAHYOG Portal mTLS integration, PDF report signing, deployment (Docker, CI/CD, monitoring), production hardening | 📅 Planned |

## Team & Acknowledgements

Built for Smart India Hackathon 2026 (SIH-182).

Acknowledgements to Ministry of Electronics & Information Technology (MeitY), National Crime Records Bureau (NCRB), and the SAHYOG Portal team for the problem statement.
