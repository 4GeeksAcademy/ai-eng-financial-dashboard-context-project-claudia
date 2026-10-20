# Project Context

- **Last verified:** 2026-10-09
- **Source:** repository inspection recorded in [`../verifications.md`](../verifications.md); normative rules are in [`../verificacions-phase2.md`](../verificacions-phase2.md).

This repository contains a demo financial metrics dashboard with a React/TypeScript frontend and FastAPI/Python backend. It displays income, expenses, net profit, and profit margin using synthetic movements. The intended user persona is not formally specified in the repository; do not present an inferred persona as an approved requirement.

The active UI fetches `GET /api/metrics`, then calculates KPI totals and monthly chart data in the frontend. The backend also defines summary, comparison, alert, top-category, facet, B2B, and B2C endpoints, but the current UI does not consume them. There is no database or persistent financial data store.

Use [README.md](../README.md) for run instructions, [`architecture-and-data-flow.md`](architecture-and-data-flow.md) for the current system map, and [`known-constraints.md`](known-constraints.md) for limitations. Keep this note factual and update its review date when implementation changes.

## Evidence

- Frontend flow: [`../frontend/src/App.tsx`](../frontend/src/App.tsx)
- Backend routes and synthetic data: [`../backend/app/routes.py`](../backend/app/routes.py)
- Current system verification: [`../verifications.md`](../verifications.md)

## UI review skill rationale

- **Decision recorded:** 2026-10-20. `web-design-guidelines` was selected for focused reviews of the project's web interface.
- It helps catch interface quality issues that can be missed when implementation focuses only on whether a feature works.
- It covers practical UI concerns such as keyboard focus, semantic markup, accessible names, forms, and asynchronous states.
- Its findings are organized by file and line, making proposed changes easier to verify and implement.
- It reviews interaction and presentation details beyond visual styling alone.
- It complements, but does not replace, the `accessibility` skill or dedicated backend, security, infrastructure, and deployment reviews. Its findings do not by themselves establish full WCAG conformance.

## Agent skills and frontend improvements

- **Recorded:** 2026-10-20. Added the project skills `accessibility`, `vercel-react-best-practices`, and `web-design-guidelines` under `../.agents/skills/`.
- Created [`dashboard-deploy-smoke-check`](../.agents/skills/dashboard-deploy-smoke-check/SKILL.md), a project-specific workflow for checking Docker Compose configuration, Vite/Codespaces API connectivity, FastAPI health/metrics responses, and documented test/build commands. It is evidence-based, non-destructive, and does not deploy or change port visibility.
- Applied accessibility improvements in [`../frontend/src/App.tsx`](../frontend/src/App.tsx), [`../frontend/src/components/ui/card.tsx`](../frontend/src/components/ui/card.tsx), and [`../frontend/src/index.css`](../frontend/src/index.css): skip link to main content, semantic card headings, an alert role for the asynchronous API error, and reduced-motion handling for skeleton pulses.
- Improved frontend request reliability and state ownership in [`../frontend/src/App.tsx`](../frontend/src/App.tsx): abort the metrics request on unmount and derive KPI/monthly values from the single movements state.
- `git diff --check` passed. Frontend lint and build were not verified because `eslint` and `tsc` were unavailable; installing dependencies was blocked by a filesystem permission error (`EACCES`). No deployment or commit was performed.
