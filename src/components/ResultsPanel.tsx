import { MODEL_LABELS } from "../constants";
import type { GruResponse, ModelType, SarimaxResponse } from "../types";
import { DiagnosticsPanel } from "./DiagnosticsPanel";
import { EmptyState } from "./EmptyState";
import { MetricsPanel } from "./MetricsPanel";
import { ModelDetails } from "./ModelDetails";
import { ResultPlotsPanel } from "./ResultPlotsPanel";
import { SectionHeader } from "./SectionHeader";

interface ResultsPanelProps {
  forecast: SarimaxResponse | GruResponse | null;
  model: ModelType;
}

export function ResultsPanel({ forecast, model }: ResultsPanelProps) {
  return (
    <section className="panel">
      <SectionHeader
        title={`Результаты модели ${forecast ? MODEL_LABELS[model] : ""}`.trim()}
        description="Метрики качества, параметры модели и диагностические графики из данных API."
      />

      {forecast ? (
        <>
          <div className="results-grid">
            <MetricsPanel metrics={forecast.metrics} />
            <ModelDetails response={forecast} />
          </div>
          <ResultPlotsPanel forecast={forecast} />
          <div className="results-spacer" />
          <DiagnosticsPanel forecast={forecast} />
        </>
      ) : (
        <EmptyState
          title="Нет результатов модели"
          description="После запуска прогноза здесь появятся метрики, параметры модели и диагностические графики."
        />
      )}
    </section>
  );
}
