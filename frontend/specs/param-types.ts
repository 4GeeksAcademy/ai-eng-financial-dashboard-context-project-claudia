import type { ApiDate, BusinessType, Category, GroupBy, OperationType } from "./api-types";

/** Optional inclusive date query bounds; omit empty values. */
export interface DateRangeFilter {
  start_date?: ApiDate;
  end_date?: ApiDate;
}
export interface AlertsParams extends DateRangeFilter {
  /**
   * Current API ratio: default 0.3, minimum 0, no maximum. The UI input is
   * 1-100 percent (default 30%) and converts it by dividing by 100. SPEC-02's
   * full-calendar-month lookback and special zero-baseline result are not
   * expressible through the current query/response contract.
   */
  threshold?: number;
  group_by?: GroupBy;
  business_type?: BusinessType;
}
export interface TopCategoriesParams extends DateRangeFilter {
  operation_type?: OperationType;
  /** Current API integer 1–20; default 5. */
  limit?: number;
  business_type?: BusinessType;
}
export interface MetricsSummaryParams extends DateRangeFilter {
  /** Current API supports day/week/month; the comparison view requests month. */
  group_by?: GroupBy;
  category?: Category;
  operation_type?: OperationType;
  business_type?: BusinessType;
}

// The current facets endpoint has no query parameters. A FacetsParams type for
// SPEC-03's segment/date-filtered target is intentionally omitted until that
// API contract is designed.
