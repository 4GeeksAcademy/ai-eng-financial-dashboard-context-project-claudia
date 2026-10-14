# SPEC-01: Main Dashboard Date Range Filter

**Status:** Functionally refined; implementation pending  
**Source:** User-provided Product Manager feature story and confirmed refinement.  
**Related technical spec:** [`components.md`](./components.md)

## Objective and functional description

Let the finance team focus on a specific period instead of viewing all historical data at once. Two date inputs at the top of the main dashboard define an optional range. The selected range is sent to the API, and all data currently shown on the dashboard is based on the returned movements for that range.

## Confirmed functional requirements

- Show start-date and end-date inputs at the top of the dashboard.
- Both date inputs are optional and can be used independently.
- Provide an **Apply** button; editing input values alone does not apply the filter.
- Submit non-empty dates as `YYYY-MM-DD`. When both are empty, show all available data.
- Show the dataset's earliest and latest dates near the inputs and limit date selection to that available range.
- Apply the filter through the backend API, not by filtering the unbounded movement collection in the browser.
- Recalculate every existing KPI and chart from the movement response for the applied range.
- Reflect the last applied range in the dashboard heading.
- Show an explicit empty state if a successful filtered request contains no movements.
- If start date is later than end date, prevent Apply and display a validation error.
- If applying a range fails, show an error while retaining the last successfully loaded dashboard data and applied heading.

## Expected interaction flow

1. On dashboard entry, load available date bounds from facets and load unfiltered movement data while both date fields are empty.
2. Display the available range next to the inputs; each input is optional and limited to that range.
3. The user edits either or both dates. Until Apply is selected, existing results and the heading remain unchanged. A reversed range displays a validation error and cannot be submitted.
4. On Apply, send non-empty values to `/api/metrics` as `start_date` and/or `end_date`; omit an empty value.
5. The backend returns the filtered movement list. Recalculate all current KPIs and charts from that response and update the heading to the applied range.
6. If the successful response is empty, show the explicit empty state. If the request fails, retain the last successful data/heading and show an error.

## Acceptance criteria

- **Given** facets have loaded, **when** the dashboard displays the date controls, **then** it shows `min_date` and `max_date` as the available range and limits selectable dates to those bounds.
- **Given** both date fields are empty, **when** the dashboard loads or the user applies the empty range, **then** it requests all available movements without date query parameters.
- **Given** only a start date or only an end date is selected, **when** the user applies it, **then** the request includes only that non-empty bound in `YYYY-MM-DD` format.
- **Given** both dates are selected, **when** the user applies the range, **then** the request includes both bounds and the backend includes movements on both boundary dates.
- **Given** a filtered movement response is received, **when** dashboard values render, **then** every existing KPI and chart reflects only the movements in that response.
- **Given** an applied range, **when** results render, **then** the heading describes that applied range rather than unsubmitted edits.
- **Given** a successful filtered request returns no movements, **when** the dashboard renders, **then** it shows an explicit empty state.
- **Given** both dates are entered and start is later than end, **when** the user tries Apply, **then** no API request is made and a validation error is shown.
- **Given** the dashboard has previously loaded data successfully, **when** a newly applied range request fails, **then** the previous data and applied heading remain visible and an error is displayed.

## Test cases and edge cases

These are acceptance scenarios, not newly added automated tests.

- Start date only; end date only; both dates; neither date.
- Same start and end date: both API bounds are inclusive.
- Select the facet minimum and maximum dates; both are valid boundary selections.
- Choose a valid in-bounds period with no movements; the dashboard shows the empty state.
- A direct API request outside facet bounds is not rejected by the backend and can return an empty array; UI date controls remain bounded by facets.
- A reversed date range is not rejected by the current API and yields no matching movements. The confirmed UI rule blocks Apply and shows validation; this does not claim server-side validation.
- A failed filtered request preserves the previous successful dashboard result and applied heading; do not show the failed range as applied.
- Backend tests exist for inclusive date filtering and `/api/metrics` date filters in [`../../backend/tests/test_routes.py`](../../backend/tests/test_routes.py); they were not executed for this specification.

## Endpoints, types, and parameters

| Method and endpoint | Request | Response | Type references |
|---|---|---|---|
| `GET /api/metrics/facets` | No query parameters. | Available facets and date bounds. | [`FacetsResponse`](./api-types.ts) |
| `GET /api/metrics` | Optional `start_date`, `end_date` (`YYYY-MM-DD`). The route also accepts `category` and `operation_type`, outside SPEC-01. | Chronologically sorted movement array. | [`DateRangeFilter`](./param-types.ts), `FinancialMovement[]` from [`../src/lib/financial-types.ts`](../src/lib/financial-types.ts) |

`FacetsResponse` properties are `operation_types`, `business_types`, `categories`, `min_date`, and `max_date`. A movement has `create_date`, `amount`, `operation_type`, `category`, and `business_type`.

The backend applies date bounds inclusively. With both query parameters omitted, `/api/metrics` returns all available movements. Facet bounds are enforced in the UI, not by the API. The generated dataset is synthetic, in-memory demo data; its date range depends on backend runtime date.

## Pending decisions and constraints

- Exact error copy if facets fail.
- Whether to disable Apply during loading and how to prevent stale overlapping responses; these remain proposed technical/UI policies in [`components.md`](./components.md).
- Exact heading/date display format and whether the applied range persists across reloads.
- Runtime `/docs` Try it out evidence and automated test execution remain pending in [`../../verifications-phase1.md`](../../verifications-phase1.md).
