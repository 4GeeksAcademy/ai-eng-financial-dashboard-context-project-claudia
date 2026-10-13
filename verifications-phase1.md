# Phase 1 Verification Record

- **Review date:** 2026-10-13
- **Revision/commit:** Not recorded.
- **Scope:** Compare product-planning wording and domain glossary with the API contracts for facets, expense alerts, and top categories.
- **Environment:** Source review. The backend was reported as running by the user; no live HTTP response or Swagger UI execution was captured by this review.
- **Method:** Static inspection of FastAPI route declarations, Pydantic response models, the domain glossary, product-planning documents, and existing backend tests.
- **Automated tests executed for this record:** None. Existing tests are cited as coverage evidence only.

## Evidence status

Use these labels to distinguish what was actually checked:

- **Source verified:** The route, query validation, and response model were inspected in source.
- **Test exists, not run:** A related automated test is present, but was not executed for this record.
- **Runtime pending:** No HTTP status and response body were captured from `/docs` or a direct request.

## Product wording and API terms

The product documents are planning templates, not approved requirements: [`docs/product/MVP.md`](docs/product/MVP.md) and [`docs/product/ROADMAP.md`](docs/product/ROADMAP.md) are marked `To be defined`. Therefore, this review cannot establish a mismatch against approved PM wording.

| Product/domain wording | Current API/code term | Evidence and note |
|---|---|---|
| Income | `operation_type: "income"`; summary field `income` | Current implementation term; not a confirmed accounting policy. |
| Expenses / expenditure | `operation_type: "outcome"`; alert field `outcome_total` | The glossary maps `outcome` to expenses. Confirm the preferred user-facing term with product/business owners. |
| Net / profit | API summary field `net`; frontend KPI label/calculation `profit` | Both currently mean income minus outcome. The API's top-category route does not return profit. |
| Expense increase / alert | `threshold`, `baseline_average`, `increase_ratio` | Threshold and increase are ratios. Alert semantics are described below; no PM acceptance criterion is recorded. |

These meanings describe the current implementation and glossary, not approved product or accounting policy. See [`memory-bank/domain-glossary.md`](memory-bank/domain-glossary.md).

## Endpoint contract checks

| ID | Endpoint and query checked | Response contract / behavior from source | Evidence status |
|---|---|---|---|
| API-01 | `GET /api/metrics/facets`; no query parameters | Object with `operation_types`, `business_types`, `categories`, `min_date`, and `max_date`. | Source verified. Test exists, not run: `test_metrics_facets_returns_filter_options_and_date_range`. Runtime pending. |
| API-02 | `GET /api/metrics/alerts?threshold=0.2&group_by=month` | Array of `{period, outcome_total, baseline_average, increase_ratio}`. Optional parameters: `start_date`, `end_date` (`YYYY-MM-DD`), and `business_type` (`B2B` or `B2C`). `threshold` is a float, default `0.3`, minimum `0`; `group_by` is `day`, `week`, or `month`, default `month`. | Source verified. Test exists, not run: `test_metrics_alerts_returns_anomaly_candidates`. Runtime pending. |
| API-03 | `GET /api/metrics/categories/top?operation_type=income&limit=5` | Array of `{category, operation_type, total_amount}`, sorted by `total_amount` descending. Optional parameters: `start_date`, `end_date` (`YYYY-MM-DD`), and `business_type` (`B2B` or `B2C`). `operation_type` is `income` or `outcome`, default `outcome`; `limit` defaults to `5`, range `1..20`. | Source verified. Test exists, not run: `test_top_categories_returns_limited_sorted_categories`. Runtime pending. |

### Behavior details observed in source

- Alert periods are compared with the average `outcome` of prior periods in the filtered series. The first period has no prior baseline; a baseline must be positive. An alert is emitted only when `increase_ratio > threshold`, not when equal.
- For top categories, `limit` is a maximum, not a guaranteed result count. Income movements are currently generated only for `sales` and `others`, so that query may return fewer than five items.
- Date filters in these routes are inclusive at both ends.

## Runtime evidence log

No live Swagger UI results were captured for this review. Complete this table after using **Try it out** in `/docs`:

| ID | Exact request | HTTP status | Observed response / artifact | Checked by | Date |
|---|---|---|---|---|---|
| API-01 | `GET /api/metrics/facets` | Pending | Pending | Pending | Pending |
| API-02 | `GET /api/metrics/alerts?threshold=0.2&group_by=month` | Pending | Pending | Pending | Pending |
| API-03 | `GET /api/metrics/categories/top?operation_type=income&limit=5` | Pending | Pending | Pending | Pending |

Record the actual status and a representative, sanitized response. Do not mark a runtime check verified based only on the declared response model or the existence of a test.

## References

- API routes and response models: [`backend/app/routes.py`](backend/app/routes.py)
- Existing backend tests: [`backend/tests/test_routes.py`](backend/tests/test_routes.py)
- Domain terms: [`memory-bank/domain-glossary.md`](memory-bank/domain-glossary.md)
- Product scope status: [`docs/product/MVP.md`](docs/product/MVP.md), [`docs/product/ROADMAP.md`](docs/product/ROADMAP.md)