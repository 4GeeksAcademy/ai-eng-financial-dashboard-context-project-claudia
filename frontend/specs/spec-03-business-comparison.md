# SPEC-03: B2B vs B2C Income Comparison

**Status:** Functionally refined; implementation is blocked by the facets contract gap.  
**Source:** User-provided Product Manager feature story and confirmed refinement.  
**Related technical spec:** [`components.md`](./components.md)

## Objective and functional description

Create a comparison page for income performance across the two business lines, B2B and B2C. Show two sections in parallel, each with a table of its five highest income categories, and one bar chart below comparing each group's total income. The user filters the comparison with the same date-range behavior as SPEC-01.

## Confirmed functional requirements

- Show two parallel sections: one for B2B and one for B2C.
- Each table shows category name, income total, and that category's percentage of all income for the group and applied range.
- Use facets as the source of available income categories separately by business type and applied date range. The current facets API is global-only; this requirement is blocked until its contract is revised.
- Obtain up to five income categories per group from `/api/metrics/categories/top`. Show only returned rows; do not pad missing categories.
- Show one bar chart below both tables comparing the two groups' total income over the applied range.
- Reuse SPEC-01 date semantics: optional start/end dates, `YYYY-MM-DD`, inclusive bounds, selectable range bounded by facets, and changes applied only through the shared **Apply** action.
- Show loading and error states for both business sections and the chart data.
- Display monetary values as USD with the existing `en-US`, zero-fraction-digit convention. The API does not provide currency metadata.
- Display category shares to one decimal place.
- If a group has zero total income, display income `0` and category shares as `—`; never divide by zero.

## Expected interaction flow

1. Load available date bounds and business-specific income-category availability from facets. The current API cannot provide the latter until its contract is extended.
2. Load each group's top income categories and grouped income summary for the applied date range. If no range is applied, omit both date query parameters.
3. Populate each table only with category rows returned for that group's top-categories request.
4. Sum the `income` values across summary periods separately for B2B and B2C. Use each full group total both for category-share denominators and as its bar-chart value.
5. The user edits dates; existing results remain until **Apply**. Apply sends the same date bounds to both groups' category and summary requests.
6. Show loading/error state for each affected section and for the chart. A zero-income group shows total `0` and share `—`.

## Acceptance criteria

- **Given** the comparison page loads without an applied date range, **when** it requests data, **then** it requests facets, top income categories for B2B and B2C, and monthly income summaries for each group without date parameters.
- **Given** an applied range exists, **when** the user activates Apply, **then** all category and summary requests use the same non-empty `start_date`/`end_date` values in `YYYY-MM-DD` format with inclusive bounds.
- **Given** facets are returned under the revised contract, **when** categories are presented, **then** available income categories are scoped by both `business_type` and applied date range.
- **Given** category rows are returned for a group, **when** its table renders, **then** it shows no more than five returned income categories in descending API order, without synthesized rows.
- **Given** a category has a returned amount and the group has positive total income, **when** its share renders, **then** calculate `category total_amount / full group income total * 100` and display one decimal place. The denominator is not the sum of the top five.
- **Given** summary data is returned for both groups, **when** the chart renders, **then** one bar chart compares the sum of B2B income with the sum of B2C income for the applied range.
- **Given** a group has zero total income, **when** its table and chart render, **then** display total income `0` and category shares `—`, with no division by zero.
- **Given** a request is loading or fails for one group, **when** the comparison renders, **then** show loading/error state for the affected section/chart without replacing the other group's successful data.

## Test cases and edge cases

These are acceptance scenarios, not newly added automated tests.

- Verify B2B and B2C requests use `operation_type=income`, `limit=5`, and their respective `business_type`.
- The current facets endpoint returns a global category list and cannot satisfy business-specific/date-filtered availability; verify this gap until the revised contract exists.
- Fewer than five category rows can be returned; do not pad missing values. Current synthetic income data generates only `sales` and `others`.
- Verify category shares against full group income when there are more than five categories; displayed shares may sum to less than 100%.
- Exercise no range, start only, end only, both bounds, same-day bounds, inclusive edges, and range changes per SPEC-01.
- Exercise one group with no income, both groups with no income, and a group with no returned category rows. Zero income must display `0` and shares `—`; exact empty-state copy remains open.
- Exercise independent B2B/B2C request failures and chart-summary failures.
- Existing tests cover category top ordering/limit and summary response shape, but not this view's shares/chart; they are cited, not run.

## Endpoints, types, and parameters

| Method and endpoint | Request | Response | Type references |
|---|---|---|---|
| `GET /api/metrics/facets` | Current endpoint has no query parameters and returns global facets. Target contract must filter/category availability by group and date. | Current `FacetsResponse`; target response shape is pending backend contract design. | [`FacetsResponse`](./api-types.ts) |
| `GET /api/metrics/categories/top` | `operation_type=income`, `limit=5`, `business_type=B2B` or `B2C`; optional SPEC-01 date bounds. | Up to five category totals, descending. | [`TopCategoriesParams`](./param-types.ts), [`TopCategoriesResponse`](./api-types.ts) |
| `GET /api/metrics/summary` | `group_by=month`, `business_type=B2B` or `B2C`; optional same date bounds. | Per-period `income`, `outcome`, and `net`; frontend sums `income`. | [`MetricsSummaryParams`](./param-types.ts), [`MetricsSummaryResponse`](./api-types.ts) |

The current summary response is sufficient to calculate full group income totals from the movements returned for the requested date range. The top-category response alone is not sufficient for the percentage denominator or chart total. All API monetary values remain numeric and have no currency field; USD is the UI display convention.

## Backend dependency and remaining presentation detail

- **Facets contract gap:** current facets returns global categories only. Define and implement income-category availability by `business_type` and applied date range before implementation. Do not add a speculative `FacetsResponse` field or `FacetsParams` type until that API contract is agreed.
- The current `categories/top` and `summary` endpoints already accept `business_type` and optional date bounds; their response shapes are represented by the existing types.
- The exact empty-state wording for a group with no income categories is not specified. Zero-total numeric presentation is confirmed (`0` total, `—` share).

## Refined acceptance criteria — category availability and zero totals

| ID | Given / When / Then | Verification case |
|---|---|---|
| AC-03-01 | **Given** an applied date range, **when** requesting category availability, **then** facets supplies income categories with recorded income separately for B2B and B2C within that range, rather than one global list. | Same category present for only one group; range change removes a category. |
| AC-03-02 | **Given** a category has no income recorded for a particular group and range, **when** availability is displayed, **then** it is not offered for that group/range. | Absent or zero-income category in one segment. |
| AC-03-03 | **Given** a category has a positive group total, **when** its share is displayed, **then** use full-group income rather than the top-five subtotal and show one decimal place. | More than five categories; one-decimal rounding. |
| AC-03-04 | **Given** a group has zero total income, **when** table/chart render, **then** show total `0` and percentage `—`, never divide by zero. | Zero-income B2B, B2C, and both groups. |
