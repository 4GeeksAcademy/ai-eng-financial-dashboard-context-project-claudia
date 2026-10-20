---
name: dashboard-deploy-smoke-check
description: "Check deployment readiness and frontend/backend integration for this React, Vite, FastAPI, and Docker Compose dashboard. Use before merge or deployment, or when checking Codespaces, VITE_API_BASE_URL, API connectivity, or dashboard smoke tests."
argument-hint: "[local-compose|codespaces]"
user-invocable: true
---

# Dashboard Deployment Smoke Check

Run a project-specific, evidence-based smoke check for this dashboard. This is
not a complete security review or a production deployment.

## Workflow

1. Read `AGENTS.md`, `verificacions-phase2.md`, `README.md`, and
   `README.es.md`. Inspect the current `docker-compose.yml`, frontend Vite
   configuration and environment example, frontend API usage and types,
   backend health and metrics routes, and the test scripts. Treat source code
   as authoritative if documentation and implementation disagree; report the
   discrepancy.

2. Identify the requested environment:
   - **local-compose:** expect the relative `/api` request to use the Vite proxy
     to the Compose backend service.
   - **codespaces:** inspect whether `VITE_API_BASE_URL` is configured for the
     backend origin and whether the frontend was restarted after a change.
   - If no environment is specified, infer it from the user's request and
     available runtime evidence; state the assumption.

   Never print environment-file contents, secret values, or full API payloads.
   Do not make ports public or change Codespaces port visibility.

3. Run non-destructive configuration checks when the required tools are
   available:
   - `docker compose config --quiet`
   - `docker compose ps`

   Do not start or stop services, rebuild images, edit source or environment
   files, push changes, or deploy. If a check would require one of these
   actions, report it as blocked and explain what is needed.

4. If the services are already running and the target is safely reachable,
   check:
   - `GET /health` returns a successful health response.
   - `GET /api/metrics` returns a successful JSON response compatible with
     `frontend/src/lib/financial-types.ts`.
   - The dashboard can reach the API using the proxy or configured backend
     origin for the selected environment.

   Compare response structure with the frontend types, but do not print
   movement records. Do not probe an unrelated or public target. If the
   endpoint cannot safely be reached or the services are stopped, mark runtime
   checks blocked rather than passed.

5. Run documented tests and frontend checks only when their dependencies and
   services are available:
   - `docker compose exec backend pytest`
   - `docker compose exec frontend npm test`
   - `docker compose exec frontend npm run lint`
   - `docker compose exec frontend npm run build`

   Report the actual result for each command. Do not claim an unrun check
   passed. Do not install dependencies or alter manifests without approval.

6. Report only repository-grounded deployment risks. In particular, distinguish
   synthetic demo data from real financial data, and flag development-only
   security settings found in the current code or configuration. Do not present
   this smoke check as a complete security audit or proof of production
   readiness.

## Report

Group results under:

- **Passed:** check performed and evidence observed.
- **Failed:** check performed, actual failure, and likely owning area.
- **Blocked / not run:** reason and action required to proceed.
- **Deployment risks:** relevant repository evidence and caveats.

Conclude with a readiness assessment limited to checks actually performed.
