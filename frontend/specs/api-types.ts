export type OperationType = "income" | "outcome";
export type BusinessType = "B2B" | "B2C";
export type Category = "suppliers" | "sales" | "operational" | "administrative" | "others";
export type GroupBy = "day" | "week" | "month";
export type ApiDate = string;

/**
 * Current response of GET /api/metrics/facets. `categories` is global and is
 * not filtered by business type or date range. This type intentionally does
 * not model the refined SPEC-03 target facets contract, which is not designed.
 */
export interface FacetsResponse {
  operation_types: OperationType[];
  business_types: BusinessType[];
  categories: Category[];
  min_date: ApiDate;
  max_date: ApiDate;
}
/**
 * Current response item from GET /api/metrics/alerts. This shape cannot encode
 * non-evaluated months or the refined zero-baseline anomaly with no percentage.
 */
export interface AlertEntry {
  period: string;
  outcome_total: number;
  baseline_average: number;
  /** Current API requires a number and suppresses non-positive baselines. */
  increase_ratio: number;
}
export type AlertsResponse = AlertEntry[];

/** Current response item from GET /api/metrics/categories/top. */
export interface CategoryEntry {
  category: Category;
  operation_type: OperationType;
  total_amount: number;
}
export type TopCategoriesResponse = CategoryEntry[];

/** Current response item from GET /api/metrics/summary. */
export interface MetricsSummaryItem {
  period: string;
  income: number;
  outcome: number;
  net: number;
}
export type MetricsSummaryResponse = MetricsSummaryItem[];
