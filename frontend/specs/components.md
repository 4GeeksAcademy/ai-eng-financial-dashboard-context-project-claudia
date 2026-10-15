# Frontend Component Specifications

**Status:** Refined component design; future API contracts pending

**Scope:** Date-range filtering, expense alerts, top categories, and B2B-vs-B2C income comparison. This document specifies UI behavior only; it does not implement React components or change the current application.

## Shared conventions

- **Proposed architecture, not a confirmed product decision:** the page/container owns API requests and passes response data, request state, and callbacks to these components; components do not fetch directly.

- The prop signatures below are component design contracts, not API requirements. SPEC-02 and SPEC-03 behavior is refined below; props and behaviors for any unrefined standalone behavior remain provisional.

- Import API response types from `./api-types` and query parameter types from `./param-types`.

- Request parameters use the API's snake_case names. Empty optional date fields are omitted from query strings.

- Apply feature-specific states below. SPEC-02 has confirmed card-level loading, no-anomaly, error, insufficient-history, partial-coverage, and special-anomaly states; SPEC-03 has confirmed per-section loading/error behavior. SPEC-03 displays `—` for percentage when group income is zero; exact empty-state copy remains pending. An empty successful response is not an API error.

- For features without refined requirements, API support alone does not imply a user-visible filter control.

## 1. DateRangeFilter

**Responsibility:** Let the user choose an optional date range for the main dashboard and apply it to backend data. Display the available range returned by facets. This component does not filter records in the browser or calculate KPIs/charts.

### Props

| Prop | Type | Contract |
|---|---|---|
| `facets` | `FacetsResponse \| null` | Response from `GET /api/metrics/facets`; supplies `min_date` and `max_date`. Null until loaded. |
| `appliedRange` | `DateRangeFilter` | Last successfully applied range. Undefined properties mean no bound. |
| `facetsLoading` | `boolean` | Facets request is pending. |
| `applying` | `boolean` | Shared dashboard Apply requests are pending. |
| `facetsError` | `string \| null` | Facets load error, if any. |
| `applyError` | `string \| null` | Error loading metrics for the submitted range, if any. |
| `onApply` | `(range: DateRangeFilter) => void` | Called only by the shared dashboard Apply action; the parent sends dates to `GET /api/metrics` and applies the alert card's current threshold to `GET /api/metrics/alerts`. |
| `onRetryFacets` | `() => void` | Retries loading the available date range. |

### States and interactions

- **Proposed, pending product approval:** show a loading state and disable date inputs and Apply until facets are available.

- **Ready:** show two independently optional date inputs and the available range. The inputs use `min_date` and `max_date` as their selectable bounds.

- **Editing:** keep draft values separate from `appliedRange`; changing an input does not update dashboard data or the period heading.

- **Apply:** submit on the Apply button only. Send each non-empty bound as `YYYY-MM-DD`; omit empty bounds. Both empty means the full available dataset. The API applies bounds inclusively.

- **Confirmed dashboard behavior:** after the backend returns movements for the applied range, the dashboard container recalculates every existing KPI and chart from that response. No visible KPI or chart may continue to use unfiltered data. This form component does not perform those calculations.

- **Confirmed validation:** if both dates are present and start is after end, show validation and do not call `onApply`. Prevent dates outside the facet bounds, including manually entered values.

- **Proposed, pending product approval:** disable Apply while the request is pending to avoid overlapping submissions.

- **Proposed, pending product approval:** on facets error, show an inline error and retry action; keep date selection and Apply disabled because valid bounds are unavailable.

- **Confirmed error behavior:** on metrics error, show an error for the failed submission, retain the last successful results, and keep the heading aligned with `appliedRange`, not the failed draft.

- **Empty result:** the dashboard page, not this form, displays an explicit no-data state when a successful filtered request returns no movements.

- **Period heading:** the dashboard page reflects the last applied range. This is confirmed; exact wording/format for open-ended and full-range labels is pending.

**Contract note:** The date-bound and apply-button decisions were confirmed during refinement. The backend accepts either date independently and uses inclusive bounds. Validating start-before-end in the UI is confirmed behavior, even though the current API does not reject a reversed range. The exact user-facing date formatting and error copy remain unspecified.

## 2. ExpenseAlertsPanel

**Responsibility:** Present monthly expense anomalies returned by `GET /api/metrics/alerts`. The backend owns anomaly evaluation; the frontend converts the configured percentage to the API's decimal ratio and formats the returned increase for display.

### Props

| Prop | Type | Contract |
|---|---|---|
| `items` | `AlertsResponse \| null` | Alert response array; null means no successful response has been loaded yet. |
| `thresholdPercent` | `number` | Editable UI threshold from `1` through `100`; default `30`. This is a percentage value, not the API ratio. |
| `onThresholdChange` | `(percent: number) => void` | Updates the draft UI percentage. Does not request data until the shared Apply action. |
| `params` | `AlertsParams` | Last applied API parameters; `threshold` is the decimal ratio sent to the backend and `group_by` is `month`. |
| `loading` | `boolean` | Loading state for this card's alert request only. |
| `error` | `string \| null` | Error for this card's alert request, distinct from an empty result. |

### States and interactions

- **Grouping:** use monthly periods; no grouping selector is part of this functionality.

- **Threshold:** show a numeric percentage input constrained to `1–100`, default `30`. On the shared dashboard Apply action, convert it to the API ratio using `threshold = thresholdPercent / 100`.

- **Shared Apply:** one dashboard Apply action submits the date range to the main metrics request and submits the same active date range plus the converted threshold and `group_by=month` to `/api/metrics/alerts`. Draft edits alone do not trigger either request.

- **Loading:** show a loader inside this card only while its alert request is pending.

- **Success with standard entries:** render period, full-calendar-month recorded outcome, average outcome across the three immediately preceding complete calendar months, and percentage increase. Preserve API order; display the increase to one decimal place.

- **Special zero-baseline anomaly:** if baseline is zero with positive current-month outcome and coverage is verified, show the approved special new-expense anomaly with percentage `—`, independent of threshold. If baseline and current outcome are both zero, do not create an anomaly. The current `AlertEntry` cannot represent this target case.

- **Coverage and lookback:** the applied range selects whole calendar months intersecting it. Evaluate each selected month using its full-calendar-month outcome and the three immediately preceding complete calendar months. A no-movement month counts as zero only with verified complete coverage; unknown coverage makes the target month non-evaluable. SPEC-01 remains day-precise.
- **No anomalies:** show the explicit no-anomalies state only if at least one month was evaluable and none qualified. An empty current API array alone cannot establish this.
- **Insufficient history/coverage:** preserve alerts for evaluable months and identify exact selected months that were not evaluated. If none are evaluable, show insufficient history/coverage rather than no anomalies. The current API exposes neither coverage metadata nor non-evaluated month statuses, so these states are blocked pending a backend contract.

- **Error:** show an error state within this card, distinct from the empty and insufficient-history states. Retry behavior is not specified.

- The table's date filters are inherited from the main dashboard filter. Other API parameters (`business_type`) are not exposed by this functionality.

**Display note:** For standard alerts, API `increase_ratio` is a decimal ratio; multiply by 100 before displaying it as a percentage. For special zero-baseline anomalies, display `—` instead (future contract pending). Format `outcome_total` and `baseline_average` as USD using the existing frontend convention (`en-US`, zero fraction digits). USD is a display convention; the API has no currency field.

**API gaps:** the current backend averages all prior periods in the filtered series; it filters exact dates before aggregation; it omits no-movement months; and it exposes no reliable month-coverage metadata. Its response array cannot list non-evaluated months or encode the special zero-baseline anomaly. The current `items` prop describes only the implemented response; do not invent future props or response fields before the backend contract is designed.



### Refined calendar-month evaluation rules (confirmed)

- The shared date filter selects **calendar months intersecting** the applied range for SPEC-02. The dashboard metrics in SPEC-01 continue to use exact selected days.
- Evaluate each visible month using its **entire calendar month's outcome**, compared with the arithmetic mean of the **three complete preceding calendar months**. Shift the window for each evaluated month, including full-month lookback before the visible range.
- A month without movements counts as zero **only when full coverage is known**. Unknown or incomplete coverage in the evaluated month or any of the three reference months makes that evaluated month non-evaluable.
- With positive baseline, emit a standard anomaly only when `increase_ratio > threshold`. With baseline zero and positive current outcome, emit the approved **special new-expense anomaly** with undefined percentage shown as `—`, regardless of threshold. With baseline and current outcome both zero, emit no anomaly.
- Show alerts from evaluable months and identify the **exact months not evaluated** with a coverage/history warning. When none are evaluable, show insufficient history/coverage, not “no anomalies”. Only show “no anomalies” when at least one month was evaluable and none qualified.
- These are **target requirements**, not behaviors supported by today's `AlertsResponse`. The backend needs an agreed contract for evaluation status, excluded months, and special anomalies before implementing the UI states. Do not fabricate fields in `api-types.ts`.

## 3. TopCategoriesPanel

**Responsibility:** Present results from `GET /api/metrics/categories/top`. The backend calculates totals, applies the limit, and returns results sorted by `total_amount` descending.

### Props

| Prop | Type | Contract |
|---|---|---|
| `items` | `TopCategoriesResponse \| null` | Category response array; null means no successful response has been loaded yet. |
| `params` | `TopCategoriesParams` | Parameters used for the displayed response. |
| `loading` | `boolean` | Category request is pending. |
| `error` | `string \| null` | Category request error, if any. |
| `onRetry` | `() => void` | Retries the same query. |

### States and interactions

- **Proposed UI behavior, pending product approval:** show a loading placeholder, distinct from an empty result.

- **Success with entries:** preserve API order and present `category`, `operation_type`, and `total_amount`.

- **Proposed UI behavior, pending product approval:** show an explicit no-categories state for a successful empty response.

- **Proposed UI behavior, pending product approval:** show an error state with retry; do not silently replace a failed response with an empty array.

- **Filters:** the API supports optional `start_date`, `end_date`, and `business_type`, plus `operation_type` and `limit`. Whether this panel exposes controls for these parameters is pending product confirmation. A parent-supplied `params` prop is a proposed implementation approach, not an approved product requirement.

- API amounts do not specify a currency; the comparison page uses the confirmed USD display convention (`en-US`, zero fraction digits).

## 4. BusinessComparisonPage

**Responsibility:** Compose the B2B-vs-B2C income comparison page. Reuse SPEC-01 date-range semantics; do not derive group totals from the top-five category sums.

### Data and child component contracts

The page/container owns facets and API requests. Proposed children are two `BusinessSegmentSection` instances (one for each `BusinessType`) and one `IncomeComparisonBarChart`.

| Component/prop | Type | Contract |
|---|---|---|
| `facets` | `FacetsResponse \| null` | Current facets response is global only. Segment/range-specific availability is required by SPEC-03 but is not yet present in the API; the future contract is pending technical design. |
| `appliedRange` | `DateRangeFilter` | Applied date bounds using SPEC-01 semantics. Empty bounds mean all available dates. |
| `b2bCategories`, `b2cCategories` | `TopCategoriesResponse` | Results from separate `/api/metrics/categories/top` queries with `operation_type=income`, `limit=5`, and the matching `business_type`/date range. |
| `b2bSummary`, `b2cSummary` | `MetricsSummaryResponse` | Results from `/api/metrics/summary` with `group_by=month` and matching `business_type`/date range. |
| `BusinessSegmentSection.businessType` | `BusinessType` | Identifies the B2B or B2C table. |
| `BusinessSegmentSection.facetsCategories` | `Category[]` | Future segment-specific income-category availability from facets for the applied range. Current `FacetsResponse` cannot provide this; final prop contract is pending API design. |
| `BusinessSegmentSection.categories` | `TopCategoriesResponse` | Only category rows actually returned by the corresponding top-categories request; do not synthesize missing rows. |
| `BusinessSegmentSection.groupIncomeTotal` | `number` | Sum of `income` across that segment's `MetricsSummaryResponse` rows for the applied range. |
| `IncomeComparisonBarChart.b2bTotal`, `b2cTotal` | `number` | Same per-segment income totals used as percentage denominators. |
| Table/chart request state | `loading: boolean`, `error: string \| null` | Loading and error are tracked for the corresponding group/visualization. |

The category share is `CategoryEntry.total_amount / groupIncomeTotal * 100`, displayed to **one decimal place**. Its denominator is all income for that business type and applied date range, not just the returned top-five categories. Monetary values use the existing USD display convention (`en-US`, zero fraction digits); the API provides no currency metadata.

### States and interactions

- Use the SPEC-01 date inputs, bounds from facets, optional date semantics, inclusive boundaries, and **Apply** behavior.

- On page load and on Apply, request the required segment/range-aware facets (pending backend support), top income categories for B2B and B2C, and monthly summaries for B2B and B2C. Send the same optional date bounds to all relevant queries.

- Display the two business sections side-by-side, each showing only categories returned by `/api/metrics/categories/top` for that group.

- Below the sections, render one bar chart comparing total B2B income with total B2C income for the applied range.

- Show loading and error states for each section; the chart also reflects the status of the summary data it needs.

- The required facets behavior supplies available income categories per business type and applied range; the current global-only API does not yet meet this requirement. The top-category endpoint still supplies the displayed ranked rows and amounts.

- Guard the percentage calculation when `groupIncomeTotal` is zero. Show `—` for percentage and `0` for total income; the exact empty-state copy remains unspecified.

### API dependencies

- `GET /api/metrics/facets` currently supplies global categories; it must be extended to provide available income categories per business type and applied range, while retaining existing date bounds for SPEC-01.

- `GET /api/metrics/categories/top` supplies each segment's top income categories and amounts.

- `GET /api/metrics/summary` supplies grouped income values; sum its `income` fields per segment to obtain the denominator and the chart value. The summary endpoint supports `business_type`, `start_date`, and `end_date` filters.

The page uses the existing [`FacetsResponse`](./api-types.ts), [`CategoryEntry`](./api-types.ts), [`MetricsSummaryItem`](./api-types.ts), [`TopCategoriesParams`](./param-types.ts), and [`MetricsSummaryParams`](./param-types.ts) contracts. These names specify data already returned by backend routes and do not add API fields.

## Cross-component edge cases

- A valid request can return an empty array under the current API, but SPEC-02 requires separate information about evaluated and non-evaluated months. An explicit no-anomalies state for SPEC-02 is confirmed when evaluable months exist and none qualify; an empty HTTP 200 response must not be described as an API error.

- The top-categories result count may be less than `limit`; `limit` is a maximum, not a guaranteed count.

- **Confirmed SPEC-02/03 error behavior:** keep alert-card, B2B-section, B2C-section, and comparison-chart errors associated with their own data requests; do not present one group's failure as the other group's result. Retry controls remain unspecified.

- **Pending technical decision, not a confirmed product requirement:** prevent an older in-flight response from replacing a newer submitted query. The request-owning page would be responsible; the exact cancellation strategy is an implementation detail.

