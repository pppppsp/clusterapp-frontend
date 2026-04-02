import type { Data } from "plotly.js-dist-min";
import type { GruResponse, SarimaxResponse } from "../types";
import { EmptyState } from "./EmptyState";
import { PlotlyChart } from "./charts/PlotlyChart";

interface ResultPlotsPanelProps {
  forecast: SarimaxResponse | GruResponse;
}

export function ResultPlotsPanel({ forecast }: ResultPlotsPanelProps) {
  const trainActual = forecast.train_forecast.filter((point) => point.actual !== null);
  const testActual = forecast.test_forecast.filter((point) => point.actual !== null);
  const fullActual = [...trainActual, ...testActual];

  const timeSeriesData: Data[] = [
    {
      type: "scatter",
      mode: "lines",
      name: "Actual",
      x: fullActual.map((point) => point.date),
      y: fullActual.map((point) => point.actual),
      line: { color: "#f97316", width: 2 },
    },
  ];

  const forecastData: Data[] = [
    {
      type: "scatter",
      mode: "lines",
      name: "Train actual",
      x: trainActual.map((point) => point.date),
      y: trainActual.map((point) => point.actual),
      line: { color: "#22c55e", width: 2 },
    },
    {
      type: "scatter",
      mode: "lines",
      name: "Test actual",
      x: testActual.map((point) => point.date),
      y: testActual.map((point) => point.actual),
      line: { color: "#f97316", width: 2 },
    },
    {
      type: "scatter",
      mode: "lines",
      name: "Predicted",
      x: forecast.test_forecast.map((point) => point.date),
      y: forecast.test_forecast.map((point) => point.predicted),
      line: { color: "#38bdf8", width: 2 },
    },
  ];

  const hasConfidenceIntervals = forecast.test_forecast.some(
    (point) => point.lower_ci !== null || point.upper_ci !== null,
  );

  if (hasConfidenceIntervals) {
    forecastData.push(
      {
        type: "scatter",
        mode: "lines",
        name: "Upper CI",
        x: forecast.test_forecast.map((point) => point.date),
        y: forecast.test_forecast.map((point) => point.upper_ci),
        line: { color: "rgba(56, 189, 248, 0)" },
        hoverinfo: "skip",
        showlegend: false,
      },
      {
        type: "scatter",
        mode: "lines",
        name: "95% CI",
        x: forecast.test_forecast.map((point) => point.date),
        y: forecast.test_forecast.map((point) => point.lower_ci),
        line: { color: "rgba(56, 189, 248, 0)" },
        fill: "tonexty",
        fillcolor: "rgba(56, 189, 248, 0.14)",
      },
    );
  }

  if (timeSeriesData[0].x?.length === 0) {
    return (
      <EmptyState
        title="Нет данных для графиков результата"
        description="Backend не вернул `train_forecast` и `test_forecast` с наблюдаемыми значениями."
      />
    );
  }

  return (
    <div className="diagnostics-grid single-column">
      <div className="subpanel">
        <h3>Временной ряд</h3>
        <p className="subpanel-copy">
          Замена бывшего `time_series_url`: строится по `date` и `actual`.
        </p>
        <div className="chart-wrap">
          <PlotlyChart
            data={timeSeriesData}
            layout={{
              hovermode: "x unified",
              xaxis: { title: "Дата", type: "date" },
              yaxis: { title: "Продажи, $", tickformat: ",.0f" },
            }}
          />
        </div>
      </div>

      <div className="subpanel">
        <h3>Прогноз</h3>
        <p className="subpanel-copy">
          Замена бывшего `forecast_url`: train/test actual, predicted и доверительный интервал.
        </p>
        <div className="chart-wrap">
          <PlotlyChart
            data={forecastData}
            layout={{
              hovermode: "x unified",
              xaxis: { title: "Дата", type: "date" },
              yaxis: { title: "Продажи, $", tickformat: ",.0f" },
            }}
          />
        </div>
      </div>
    </div>
  );
}
