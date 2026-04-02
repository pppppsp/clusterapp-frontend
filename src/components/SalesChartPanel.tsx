import { formatCurrency, formatNumber } from "../utils/format";
import { EmptyState } from "./EmptyState";
import { Loader } from "./Loader";
import { SectionHeader } from "./SectionHeader";
import { ChartJsLineChart } from "./charts/ChartJsLineChart";

interface SalesChartPoint {
  date: string;
  label: string;
  weekly_sales: number;
}

interface SalesChartPanelProps {
  isLoading: boolean;
  data: SalesChartPoint[];
}

export function SalesChartPanel({ isLoading, data }: SalesChartPanelProps) {
  const hasData = data.length > 0;

  return (
    <article className="panel chart-panel wide">
      <SectionHeader
        title="Исторические продажи"
        description="Временной ряд `Weekly_Sales` для выбранного магазина."
      />
      {!hasData && isLoading ? (
        <Loader label="Загружаем историю продаж" />
      ) : hasData ? (
        <div className="chart-wrap chart-wrap-with-overlay">
          <ChartJsLineChart
            labels={data.map((point) => point.label)}
            datasets={[
              {
                label: "Продажи",
                data: data.map((point) => point.weekly_sales),
                borderColor: "#f97316",
                backgroundColor: "rgba(249, 115, 22, 0.14)",
                fill: true,
                pointRadius: 0,
                tension: 0.24,
              },
            ]}
            yAxisFormatter={(value) => formatNumber(value, 0)}
            tooltipFormatter={formatCurrency}
            xAxisTitle="Дата"
            yAxisTitle="Продажи, $"
          />
          {isLoading ? (
            <div className="chart-loading-overlay">
              <Loader label="Загружаем историю продаж" />
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState
          title="История продаж отсутствует"
          description="Выберите магазин или проверьте ответ эндпоинта `/stores/{id}/sales`."
        />
      )}
    </article>
  );
}
