import type { Data } from "plotly.js-dist-min";
import type { GruResponse, SarimaxResponse } from "../types";
import { formatCurrency, formatNumber } from "../utils/format";
import { asGru, asSarimax } from "../utils/model";
import { EmptyState } from "./EmptyState";
import { PlotlyChart } from "./charts/PlotlyChart";

interface DiagnosticsPanelProps {
  forecast: SarimaxResponse | GruResponse;
}

export function DiagnosticsPanel({ forecast }: DiagnosticsPanelProps) {
  const sarimax = asSarimax(forecast);
  const gru = asGru(forecast);

  if (sarimax) {
    return <SarimaxDiagnostics forecast={sarimax} />;
  }

  if (gru) {
    return <GruDiagnostics forecast={gru} />;
  }

  return (
    <EmptyState
      title="Недостаточно данных для диагностик"
      description="Ответ модели не содержит диагностических серий для локальной визуализации."
    />
  );
}

function SarimaxDiagnostics({ forecast }: { forecast: SarimaxResponse }) {
  const residuals = Array.isArray(forecast.residuals) ? forecast.residuals : [];
  const acfValues = Array.isArray(forecast.acf_values) ? forecast.acf_values : [];
  const pacfValues = Array.isArray(forecast.pacf_values) ? forecast.pacf_values : [];
  const acfLags = normalizeLags(forecast.acf_lags, Math.max(acfValues.length, pacfValues.length));

  if (residuals.length === 0) {
    return (
      <EmptyState
        title="Нет диагностик SARIMAX"
        description="Backend не вернул `residuals`, `acf_values` или `pacf_values`."
      />
    );
  }

  const residualPoints = residuals.map((_, index) => index + 1);

  const residualSeries: Data[] = [
    {
      type: "scatter",
      mode: "lines",
      name: "Residual",
      x: residualPoints,
      y: residuals,
      line: { color: "#f97316", width: 2 },
    },
  ];

  const histogramSeries: Data[] = [
    {
      type: "histogram",
      name: "Residual distribution",
      x: residuals,
      marker: { color: "#38bdf8" },
      opacity: 0.85,
    },
  ];

  const acfPacfSeries: Data[] = [];

  if (acfValues.length > 0 && acfLags.length > 0) {
    acfPacfSeries.push({
      type: "bar",
      name: "ACF",
      x: acfLags,
      y: acfValues,
      marker: { color: "#22c55e" },
      opacity: 0.8,
    });
  }

  if (pacfValues.length > 0 && acfLags.length > 0) {
    acfPacfSeries.push({
      type: "bar",
      name: "PACF",
      x: acfLags,
      y: pacfValues,
      marker: { color: "#a78bfa" },
      opacity: 0.72,
    });
  }

  return (
    <div className="diagnostics-grid single-column">
      <div className="subpanel">
        <h3>Остатки модели</h3>
        <p className="subpanel-copy">
          Используются готовые `residuals` из ответа backend.
        </p>
        <div className="chart-wrap">
          <PlotlyChart
            data={residualSeries}
            layout={{
              xaxis: { title: "Номер наблюдения" },
              yaxis: { title: "Остаток, $", tickformat: ",.0f" },
            }}
          />
        </div>
      </div>

      <div className="subpanel">
        <h3>Распределение остатков</h3>
        <p className="subpanel-copy">
          Среднее: {formatCurrency(average(residuals))} · Std: {formatNumber(std(residuals), 0)}
        </p>
        <div className="chart-wrap">
          <PlotlyChart
            data={histogramSeries}
            layout={{
              xaxis: { title: "Остаток, $", tickformat: ",.0f" },
              yaxis: { title: "Количество" },
              bargap: 0.08,
            }}
          />
        </div>
      </div>

      <div className="subpanel diagnostics-note">
        <h3>ACF / PACF</h3>
        <p className="subpanel-copy">
          Автокорреляция и частичная автокорреляция строятся напрямую из параметров: acf_values,
          pacf_values и acf_lags.
        </p>
        {acfPacfSeries.length > 0 ? (
          <div className="chart-wrap">
            <PlotlyChart
              data={acfPacfSeries}
              layout={{
                barmode: "group",
                xaxis: { title: "Лаг" },
                yaxis: { title: "Корреляция", range: [-1, 1] },
              }}
            />
          </div>
        ) : (
          <EmptyState
            title="Нет ACF/PACF"
            description="Backend не вернул лаги или значения для автокорреляции."
          />
        )}
      </div>
    </div>
  );
}

function GruDiagnostics({ forecast }: { forecast: GruResponse }) {
  const trainingLosses = Array.isArray(forecast.training_losses) ? forecast.training_losses : [];

  if (trainingLosses.length === 0) {
    return (
      <EmptyState
        title="Нет диагностик GRU"
        description="Backend не вернул `training_losses`."
      />
    );
  }

  const lossSeries: Data[] = [
    {
      type: "scatter",
      mode: "lines",
      name: "Training loss",
      x: trainingLosses.map((_, index) => index + 1),
      y: trainingLosses,
      line: { color: "#38bdf8", width: 2 },
    },
  ];

  return (
    <div className="diagnostics-grid single-column">
      <div className="subpanel">
        <h3>Кривая обучения GRU</h3>
        <p className="subpanel-copy">
          График строится напрямую из `training_losses`, которые возвращает backend.
        </p>
        <div className="chart-wrap">
          <PlotlyChart
            data={lossSeries}
            layout={{
              xaxis: { title: "Эпоха" },
              yaxis: { title: "Потери (loss)", tickformat: ".4f" },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function std(values: number[]) {
  const mean = average(values);
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function normalizeLags(
  rawLags: SarimaxResponse["acf_lags"],
  fallbackLength: number,
): number[] {
  if (Array.isArray(rawLags)) {
    return rawLags;
  }

  if (typeof rawLags === "number" && Number.isFinite(rawLags) && rawLags >= 0) {
    return Array.from({ length: rawLags + 1 }, (_, index) => index);
  }

  return Array.from({ length: fallbackLength }, (_, index) => index);
}
