# Construction Daily Reporting Platform

Production-oriented monorepo for a mobile-first, AI-enabled construction daily reporting system.

## Monorepo Structure

```txt
apps/
  backend/         Express + Prisma + PostgreSQL API
  mobile/          React Native + Expo field application
  web-dashboard/   React/Vite executive dashboard
packages/
  shared/          Shared TS domain types
docs/
  wireframes.md    Code-based wireframes
```

## Core Capabilities Delivered

- Mobile daily report capture (labor, equipment, materials, safety, delays)
- Instagram-style photo reel UX for site photo review
- AI safety scanning pipeline for uploaded photos
- AI-generated daily summary on report finalization
- Hot-item auto creation + FCM notification flow
- Executive dashboard with risk trend visualization
- JWT auth + role-based access control + audit logs
- PDF export endpoint for finalized reports
- Cloud-ready image storage service abstraction

## Backend API Routes

### Auth
- `POST /api/auth/login`

### Daily Reports
- `POST /api/reports` - Create report
- `POST /api/reports/:reportId/photos` - Upload photo + AI scan
- `POST /api/reports/:reportId/finalize` - Lock report + AI summary
- `GET /api/reports/:reportId/export/pdf` - Export PDF

### Executive Dashboard
- `GET /api/dashboard/executive`

## Prisma Data Model

Implemented entities:
- `User`, `Company`, `Project`
- `DailyReport`, `LaborEntry`, `EquipmentEntry`, `MaterialEntry`
- `Photo`, immutable `AIScanLog`
- `HotItem`
- `AuditLog`

## AI Integration Details

- `runSafetyVisionScan(imageUrl)` handles vision inference integration boundaries and returns hazard flags + suggested caption.
- `calculateRiskScore(flags, priorOpenHotItems)` computes 1-10 normalized risk.
- `generateDailySummary(input)` builds a 3-paragraph executive-style report summary.

Replace `apps/backend/src/services/ai.service.ts` internals with your preferred provider (AWS Rekognition, Azure Vision, custom model API).

## Security Controls Included

- JWT auth middleware
- Role-based route guards (`SUPER`, `PM`, `EXEC`, `SAFETY`, `ADMIN`)
- Audit logging for report creation/finalization
- Locked report state after submission (`lockedAt`)
- Immutable AI scan log with SHA-256 hash
- Helmet + CORS + rate limiting

## Local Development Setup

### Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL 15+

### 1) Install deps
```bash
npm install
```

### 2) Configure backend env
```bash
cp apps/backend/.env.example apps/backend/.env
# update DATABASE_URL / JWT_SECRET
```

### 3) Generate Prisma client and migrate
```bash
npm --workspace @cdr/backend run prisma:generate
npm --workspace @cdr/backend run prisma:migrate
```

### 4) Run services
```bash
npm run dev:backend
npm run dev:mobile
npm run dev:web
```

- Backend: `http://localhost:4000`
- Expo mobile: via QR/local tunnel from Expo CLI
- Executive dashboard: `http://localhost:5173`

## Cloud Deployment Notes

### AWS-ready mapping
- API: ECS Fargate or EKS
- Database: RDS PostgreSQL
- Object Storage: S3 (`storage.service.ts` swap)
- Push: Firebase Cloud Messaging
- Secrets: AWS Secrets Manager

### Azure-ready mapping
- API: Azure Container Apps / AKS
- Database: Azure Database for PostgreSQL
- Object Storage: Blob Storage (`storage.service.ts` swap)
- Push: Firebase Cloud Messaging
- Secrets: Key Vault

## Performance and Scale Targets

Architecture is organized for:
- 1,000+ concurrent users
- <2s API response targets through indexed queries and stateless API scaling
- <10s AI photo scan targets (async worker split recommended for production)

## Roadmap Hooks (Bonus)

- Voice-to-text capture with native speech recognition
- Predictive delay forecasting from weather + productivity history
- Integrations adapters for Procore / ACC Build / Viewpoint Vista
- AI productivity benchmarking per trade / project phase
