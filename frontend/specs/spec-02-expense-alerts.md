# SPEC-02: Monthly Expense Anomaly Alerts

**Status:** Functionally refined; implementation blocked by backend/API gaps.  
**Source:** User-provided Product Manager feature story and confirmed refinement.  
**Related technical spec:** [`components.md`](./components.md)

## Objective and functional description

Show a table below the existing dashboard charts that highlights months when recorded expenses (`outcome`) increased unexpectedly. The user configures an alert threshold. The table respects the main dashboard's applied date range.

## Confirmed functional requirements

- Display a table below the existing charts with four columns: period, recorded `outcome`, average outcome from the three preceding calendar months, and percentage increase.
- Group alert periods monthly; no grouping control is requested.
- Provide a numeric threshold input in percent from `1%` to `100%`, default `30%`.
- Convert the UI percentage to a decimal ratio for the API (`30%` becomes `0.3`).
- For standard anomalies with a positive baseline, include a period only when its increase is strictly greater than the configured threshold (`>`).
- A verified zero baseline with positive current spending is a special new-expense anomaly, independent of threshold, with undefined percentage displayed as `—`. If both baseline and current spending are zero, do not emit an anomaly.
- The refined special-anomaly label is “Nuevo gasto sin historial de consumo previo”. This Spanish UI literal conflicts with the repository's English-only UI-string standard; confirm or translate it before implementation without changing the anomaly behavior.
- Use the same **Apply** action as the date-range filter. Draft edits do not request new data until Apply.
- The main dashboard's applied date range selects whole calendar months intersecting that range for alerts. SPEC-01 dashboard KPIs and charts continue using exact selected days.
- Evaluate each selected month using the full calendar month's outcome and the three complete calendar months immediately before it. For example, March uses December, January, and February.
- Count a no-movement month as zero only when complete historical coverage is verified. Missing movements without coverage evidence do not prove zero.
- Wait until the target month and its three reference months have verified coverage before evaluating. Preserve valid alerts for evaluable months and identify the exact months not evaluated. If none can be evaluated, show insufficient history/coverage rather than no anomalies.
- Show a loader inside the alert card while its request is pending, and an error state if the request fails.
- If at least one month was evaluated and no anomaly qualifies, keep the table/card visible with an explicit no-anomalies message.
- Format monetary values as USD using the existing frontend convention (`en-US`, zero fraction digits). This is presentation formatting; the API does not assign a currency to synthetic data.

## Expected interaction flow

1. Load alerts monthly using the default `30%` UI threshold (`0.3` API ratio) and the currently applied dashboard date range, if any.
2. Show a loader within the alert card while its request is pending.
3. The user edits the threshold and/or dashboard date range. Draft values do not update results before Apply.
4. The shared Apply action requests main dashboard data with exact date bounds. For alerts, it selects the whole calendar months intersecting those bounds and evaluates full-month totals with three complete, covered prior months per target month. The current API cannot do this correctly without backend changes.
5. Convert the threshold percentage to a decimal ratio by dividing by 100 and request monthly alerts.
6. Render standard alerts with the four requested values and percentage increase. Render the special zero-baseline anomaly with `—` as its percentage.
7. Preserve alerts for evaluable months and list exact non-evaluable months in a coverage/history notice. If none are evaluable, show insufficient history/coverage; show no anomalies only when evaluation occurred and returned no qualifying alerts. Show API errors separately.

## Acceptance criteria

- **Given** no threshold edit has been made, **when** the alert request is sent, **then** it uses a `30%` UI default, sends `threshold=0.3`, and groups by month.
- **Given** the user enters a threshold from `1%` through `100%`, **when** they activate the shared Apply action, **then** the API receives the entered percent divided by 100 as a decimal ratio.
- **Given** the user edits threshold or dates, **when** Apply has not been activated, **then** results remain associated with the last applied values.
- **Given** a dashboard date range is active, **when** Apply is activated, **then** the alert request uses the same optional inclusive date bounds to select intersecting months.
- **Given** a target month has three preceding complete calendar months with verified coverage, **when** it is evaluated, **then** its baseline is the arithmetic mean of those three months' outcomes, not the cumulative historical mean.
- **Given** a visible range begins or ends mid-month, **when** alerts are evaluated, **then** every selected month is evaluated using its full-calendar-month total and the exact three complete months before it for lookback. SPEC-01 remains day-level.
- **Given** a preceding month has verified complete coverage and no movements, **when** calculating the baseline, **then** that month contributes zero and occupies one of the three month positions.
- **Given** baseline is zero and current outcome is positive with verified coverage, **when** evaluated, **then** emit the special new-expense anomaly with percentage `—`, independently of threshold.
- **Given** baseline and current outcome are both zero, **when** evaluated, **then** do not emit an anomaly.
- **Given** coverage is incomplete or unknown for the target or any reference month, **when** evaluated, **then** mark that exact target month not evaluable and do not treat an unknown month as zero.
- **Given** a range contains both evaluable and non-evaluable months, **when** results render, **then** preserve valid alerts and identify exact non-evaluated calendar months. If none are evaluable, show insufficient history/coverage instead of no anomalies.
- **Given** at least one month was evaluated and no standard or special anomaly qualifies, **when** results render, **then** show the explicit no-anomalies state.
- **Given** an alert request is pending or fails, **when** the dashboard renders, **then** show a card-scoped loader or error state.

### Refined acceptance criteria — calendar coverage and special anomalies

| ID | Given / When / Then | Verification case |
|---|---|---|
| AC-02-01 | **Given** three preceding complete calendar months with verified data coverage, **when** a month is evaluated, **then** its baseline is the arithmetic mean of those three months' `outcome` totals, not the cumulative historical mean. | Three-month moving-window fixture; window shifts for consecutive evaluated months. |
| AC-02-02 | **Given** a preceding month with verified complete coverage and no movements, **when** computing the baseline, **then** its `outcome` is zero and the month still occupies one of the three calendar positions. | Missing movement month with known coverage. |
| AC-02-03 | **Given** baseline zero and positive spending in a month with verified coverage, **when** evaluating it, **then** show the special anomaly with the refined label and percentage `—`, independently of threshold. | Baseline `0`, current `> 0`, threshold at both bounds. |
| AC-02-04 | **Given** baseline zero and current spending zero, **when** evaluating the month, **then** do not generate an anomaly. | Baseline `0`, current `0`. |
| AC-02-05 | **Given** incomplete or unknown coverage in the evaluated month or any of its three reference months, **when** evaluating it, **then** mark it not evaluable with a coverage/history-insufficient reason; do not treat unknown months as zero. | Missing coverage in each reference position and in the evaluated month. |
| AC-02-06 | **Given** a visible range containing both evaluable and non-evaluable months, **when** results render, **then** preserve alerts for evaluable months and identify the exact calendar months not evaluated. | Mixed evaluable/non-evaluable range; all months non-evaluable. |
| AC-02-07 | **Given** a selected range starts or ends mid-month, **when** evaluating an intersecting month, **then** use that entire calendar month and its three complete preceding calendar months; this rule is SPEC-02 only, while SPEC-01 stays day-level. | 15 March–30 April: full March/April; March baseline December–February, April baseline January–March. |

## Test cases and edge cases

These are acceptance scenarios, not newly added automated tests.

- Threshold boundaries and conversion: `1%` -> `0.01`, `30%` -> `0.3`, `100%` -> `1.0`; never send displayed percentage as the ratio.
- Standard alert threshold is strict `>`; equal-to-threshold is not emitted.
- Verify a rolling three-month window shifts for consecutive months and uses complete calendar months before the selected range.
- Date range begins/ends mid-month: alerts use full totals for intersecting months, while SPEC-01 data stays day-level.
- Known-covered empty month counts as zero; unknown-coverage month is not assumed zero.
- Baseline zero/current positive emits special anomaly with `—`; baseline/current both zero emits none.
- All months evaluable/no alerts versus mixed evaluable/non-evaluable months versus no months evaluable.
- Existing `test_metrics_alerts_returns_anomaly_candidates` checks the response shape only; it was not run for this spec and does not cover the rolling window, lookback, coverage, special anomaly, or partial-status cases.

## Endpoints, types, and parameters

| Method and endpoint | Request | Response | Type references |
|---|---|---|---|
| `GET /api/metrics/alerts` | Current API: `threshold` decimal ratio, `group_by=month`, optional `start_date`, `end_date`, `business_type`. Target behavior additionally requires full-month lookback and coverage/evaluation status. | Current API: `AlertEntry[]`; target response contract is not yet designed. | [`AlertsParams`](./param-types.ts), [`AlertsResponse`](./api-types.ts) |
| Shared Apply also calls `GET /api/metrics` | SPEC-01 exact optional day-level date bounds. | Main dashboard movement response. | `DateRangeFilter`, `FinancialMovement[]` from [`../src/lib/financial-types.ts`](../src/lib/financial-types.ts) |

Current `AlertEntry` fields are `period`, `outcome_total`, `baseline_average`, and `increase_ratio`; the current API requires `increase_ratio` to be numeric. Do not add response fields to [`api-types.ts`](./api-types.ts) until the backend contract is designed and implemented.

## Known backend gaps and implementation dependencies

- **Rolling calculation:** current code averages all earlier periods in the filtered summary, not exactly the three preceding calendar months.
- **Full-month lookback:** current code applies exact date bounds before summarizing; it cannot use complete months before the range or full totals for partial first/last months.
- **Coverage:** the backend omits months without movements and provides no reliable complete-month coverage metadata. A no-movement month can only count as zero if complete coverage can be established.
- **Evaluation results:** current response is only a list of anomalies; it cannot report exact months not evaluated or distinguish no anomalies from insufficient/unknown history.
- **Special anomaly:** current response requires a numeric ratio and backend suppresses non-positive baseline. It cannot represent the approved zero-baseline/current-positive anomaly with undefined percentage.
- **Threshold validation:** UI range is confirmed as `1–100%` (`0.01–1.0` ratio, default `0.3`); current API allows any ratio `>= 0` with no maximum. API-side validation remains a backend gap, not an open product decision.

These are known backend/API dependencies, not discarded requirements. No API contract changes or implementation are included in this spec.
