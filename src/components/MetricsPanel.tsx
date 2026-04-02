import type { Metrics } from "../types";
import { formatCurrency, formatNumber } from "../utils/format";
import { MetricCard } from "./MetricCard";

interface MetricsPanelProps {
  metrics: Metrics;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="subpanel">
      <h3>Метрики</h3>
      <div className="metric-grid compact">
        <MetricCard label="MAE" value={formatCurrency(metrics.mae)} />
        <MetricCard label="RMSE" value={formatCurrency(metrics.rmse)} />
        <MetricCard label="MAPE" value={`${formatNumber(metrics.mape)} %`} />
      </div>
    </div>
  );
}
