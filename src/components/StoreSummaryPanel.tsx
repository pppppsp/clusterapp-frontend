import type { StoreAggregate } from "../types";
import { formatCurrency, formatNumber } from "../utils/format";
import { EmptyState } from "./EmptyState";
import { MetricCard } from "./MetricCard";
import { SectionHeader } from "./SectionHeader";

interface StoreSummaryPanelProps {
  store: StoreAggregate | null;
}

export function StoreSummaryPanel({ store }: StoreSummaryPanelProps) {
  return (
    <article className="panel wide">
      <SectionHeader
        title="Сводка по магазину"
        description="Агрегированные показатели из `GET /api/v1/stores`."
      />
      {store ? (
        <div className="metric-grid metric-grid-store">
          <MetricCard label="Средние продажи" value={formatCurrency(store.mean_sales)} />
          <MetricCard label="Std продаж" value={formatCurrency(store.std_sales)} />
          <MetricCard
            label="Средняя температура"
            value={`${formatNumber(store.mean_temperature)} °F`}
          />
          <MetricCard label="Средний CPI" value={formatNumber(store.mean_cpi)} />
          <MetricCard
            label="Безработица"
            value={`${formatNumber(store.mean_unemployment)} %`}
          />
          <MetricCard
            label="Цена топлива"
            value={`$${formatNumber(store.mean_fuel_price)}`}
          />
        </div>
      ) : (
        <EmptyState
          title="Нет данных по магазину"
          description="Список магазинов ещё не загрузился или API вернул пустой ответ."
        />
      )}
    </article>
  );
}
