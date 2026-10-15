# Frontend Specifications Index

**Status:** Proposed

The individual SPEC files are the functional source of truth. `api-types.ts` and `param-types.ts` document current backend contracts; `components.md` is derived component-level design. These derived files must not invent fields or parameters for backend contracts that have not been designed.

## Specifications

| ID | Feature | Status | Specification |
|---|---|---|---|
| SPEC-01 | Main dashboard date-range filter | Functionally refined; implementation pending | [`spec-01-dashboard-date-range.md`](./spec-01-dashboard-date-range.md) |
| SPEC-02 | Monthly expense anomaly alerts | Functionally refined; backend/API work required | [`spec-02-expense-alerts.md`](./spec-02-expense-alerts.md) |
| SPEC-03 | B2B vs B2C income comparison | Functionally refined; facets API work required | [`spec-03-business-comparison.md`](./spec-03-business-comparison.md) |

## Shared References

- Current API response types: [`api-types.ts`](./api-types.ts)
- Current API query parameter types: [`param-types.ts`](./param-types.ts)
- Derived component props, states, and interactions: [`components.md`](./components.md)
- Existing movement type and calculations: [`../src/lib/financial-types.ts`](../src/lib/financial-types.ts), [`../src/lib/financial-utils.ts`](../src/lib/financial-utils.ts)
- Backend routes: [`../../backend/app/routes.py`](../../backend/app/routes.py)
- Verification evidence: [`../../verifications-phase1.md`](../../verifications-phase1.md), [`../../verifications.md`](../../verifications.md)

## Shared Conventions

- Dates use `YYYY-MM-DD` calendar-date strings. SPEC-01 defines the shared optional range, inclusive bounds, facets-bounded UI inputs, and Apply behavior.
- Monetary values use the existing USD, `en-US`, zero-decimal display convention. The API does not provide currency metadata.
- The product MVP and roadmap remain `To be defined`; these user-refined specs do not independently commit delivery scope.
- OpenAPI schemas were inspected, but interactive `/docs` **Try it out** responses and referenced automated tests remain pending in the verification records. Do not describe an unrun test or uncaptured runtime response as verified.

## Scope Boundaries and Traceability

- **SPEC-01:** filter the data already shown on the main dashboard; no new KPIs or charts are requested.
- **SPEC-02:** one monthly alert table below existing charts; no notifications, exports, or day/week grouping controls are requested.
- **SPEC-03:** one comparison page with two business tables and one bar chart; no additional analytics pages or exports are requested.
- **Traceability:** each SPEC links its user-provided feature story/refinement to functional requirements, acceptance criteria, edge cases, endpoints, and technical dependencies. Known backend gaps do not remove or downgrade confirmed requirements.

## Technical Design Backlog

These are implementation dependencies, not additional product features.

| Item | Required outcome | Verification to plan |
|---|---|---|
| SPEC-02 month coverage | Define trustworthy complete-month coverage, including dataset start/end and how a covered zero-transaction month differs from missing data. | Coverage metadata, zero-month, partial/current-month, and dataset-boundary cases. |
| SPEC-02 alert response | Design a compatible response contract for standard alerts, special zero-baseline anomalies with undefined percentage, and exact non-evaluable months/reasons. | OpenAPI/schema and type contract; empty list must not ambiguously mean insufficient history. |
| SPEC-02 full-month computation | Use full calendar months for selected alert months and three-month lookback while preserving SPEC-01 day-level filtering. | Mid-month boundaries, consecutive windows, year transitions. |
| SPEC-02 threshold validation | Keep UI percent `1–100` converted to API ratio `0.01–1.0`; decide whether/how the API validates those bounds. | Boundary, out-of-range UI and direct API requests. |
| SPEC-02 UI label | Resolve the Spanish special-anomaly label against the repository's English-only UI-string standard before implementation. | Approved English label or documented localization decision. |
| SPEC-03 facets by segment | Design a compatible facets request/response for income-category availability by `business_type` and applied dates while retaining fields used by SPEC-01. | Both segments, date ranges, empty segments, existing facets consumers. |
| SPEC-03 aggregate rounding | Define handling of rounding differences between `/categories/top` and `/summary`; shares display to one decimal. | Fractional values, group totals, chart and share consistency. |

## Definition of Ready (DoR)

A SPEC may be functionally refined before it is ready to implement. Mark it implementation-ready only when:

- [ ] The user story and approved refinements are traceable to requirements.
- [ ] Acceptance criteria cover normal paths, boundaries, empty results, and relevant failures; unresolved product ambiguities are explicitly listed.
- [ ] Endpoints, parameters, current response contracts, and required future API changes are distinguished.
- [ ] Blocking API contracts are agreed before dependent implementation; no speculative fields are added to current TypeScript types.
- [ ] Component responsibilities/data flow, dependencies, test scenarios, and out-of-scope behavior are identified.
- [ ] A reviewer approves the implementation-ready scope and verification limitations are honestly recorded.

**Current readiness:** SPEC-01 is functionally refined; implementation planning should confirm its outstanding presentation details. SPEC-02 is not backend-ready until its full-month window, coverage/evaluation, and special-anomaly contracts are designed. SPEC-03 is not backend-ready until facets can provide per-business/date category availability. These dependencies do not discard the approved requirements.

## Definition of Done (DoD)

Apply per SPEC after implementation; completing documentation alone does not satisfy DoD.

- [ ] Implemented behavior meets the SPEC's acceptance criteria, including agreed API changes.
- [ ] API responses, query parameters, TypeScript types, and component props match implemented contracts; no invented fields or silent fallbacks remain.
- [ ] Relevant automated tests pass for normal paths, boundaries, empty/error states, and SPEC-specific cases; report actual executions.
- [ ] UI behavior is verified for loading, errors, empty states, Apply semantics, and consistency across affected views.
- [ ] Existing dashboard functionality remains intact; no out-of-scope behavior was introduced.
- [ ] Verification evidence records commands/results and runtime endpoint checks where applicable; remaining limitations are disclosed.

**SPEC-specific completion checks:** SPEC-01 must update all existing KPIs/charts and preserve prior results on failed filters. SPEC-02 must use verified complete-calendar-month windows, lookback, zero-baseline special anomalies, and exact non-evaluable-month reporting. SPEC-03 must use per-business/date facets, top-five tables, full-group shares, and matching chart totals. See each individual SPEC for its detailed acceptance criteria.
