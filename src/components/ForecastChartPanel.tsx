import type { Data } from "plotly.js-dist-min";
import { formatCurrency } from "../utils/format";
import { EmptyState } from "./EmptyState";
import { Loader } from "./Loader";
import { SectionHeader } from "./SectionHeader";
import { PlotlyChart } from "./charts/PlotlyChart";

interface ForecastChartPoint {
  date: string;
  label: string;
  actual: number | null;
  predicted: number;
  lower_ci: number | null;
  upper_ci: number | null;
}

interface ForecastChartPanelProps {
  isLoading: boolean;
  data: ForecastChartPoint[];
}

export function ForecastChartPanel({ isLoading, data }: ForecastChartPanelProps) {
  const hasData = data.length > 0;
  const plotData: Data[] = [
    {
      type: "scatter",
      mode: "lines",
      name: "Факт",
      x: data.map((point) => point.date),
      y: data.map((point) => point.actual),
      line: { color: "#22c55e", width: 2 },
    },
    {
      type: "scatter",
      mode: "lines",
      name: "Прогноз",
      x: data.map((point) => point.date),
      y: data.map((point) => point.predicted),
      line: { color: "#38bdf8", width: 2 },
    },
  ];

  const hasConfidenceIntervals = data.some(
    (point) => point.lower_ci !== null || point.upper_ci !== null,
  );

  if (hasConfidenceIntervals) {
    plotData.push(
      {
        type: "scatter",
        mode: "lines",
        name: "Upper CI",
        x: data.map((point) => point.date),
        y: data.map((point) => point.upper_ci),
        line: { color: "rgba(56, 189, 248, 0)" },
        hoverinfo: "skip",
        showlegend: false,
      },
      {
        type: "scatter",
        mode: "lines",
        name: "95% CI",
        x: data.map((point) => point.date),
        y: data.map((point) => point.lower_ci),
        line: { color: "rgba(56, 189, 248, 0)" },
        fill: "tonexty",
        fillcolor: "rgba(56, 189, 248, 0.14)",
      },
    );
  }

  return (
    <article className="panel chart-panel wide">
      <SectionHeader
        title="Локальный график прогноза"
        description="Факт, предсказание и доверительный интервал, если он доступен."
      />
      {!hasData && isLoading ? (
        <Loader label="Считаем прогноз и загружаем метрики" />
      ) : hasData ? (
        <div className="chart-wrap chart-wrap-with-overlay">
          <PlotlyChart
            data={plotData}
            layout={{
              hovermode: "x unified",
              xaxis: { title: "Дата", type: "date" },
              yaxis: { title: "Продажи, $", tickformat: ",.0f" },
            }}
            config={{
              locale: "ru",
            }}
          />
          {isLoading ? (
            <div className="chart-loading-overlay">
              <Loader label="Считаем прогноз и загружаем метрики" />
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyState
          title="Прогноз ещё не построен"
          description="Нажмите кнопку запуска, чтобы запросить `POST /forecast/sarimax` или `POST /forecast/gru`."
        />
      )}
    </article>
  );
}
