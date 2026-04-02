import { MODEL_LABELS } from "../constants";
import type { ModelType, StoreAggregate } from "../types";
import { SectionHeader } from "./SectionHeader";

interface ControlsPanelProps {
  stores: StoreAggregate[];
  selectedStoreId: number | null;
  model: ModelType;
  horizon: number;
  isLoadingStores: boolean;
  isLoadingForecast: boolean;
  onStoreChange: (storeId: number) => void;
  onModelChange: (model: ModelType) => void;
  onHorizonChange: (horizon: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ControlsPanel({
  stores,
  selectedStoreId,
  model,
  horizon,
  isLoadingStores,
  isLoadingForecast,
  onStoreChange,
  onModelChange,
  onHorizonChange,
  onSubmit,
}: ControlsPanelProps) {
  return (
    <section className="panel controls-panel">
      <SectionHeader
        title="Параметры"
        description="Выберите магазин, модель и горизонт прогноза."
      />

      <form className="controls-grid" onSubmit={onSubmit}>
        <label>
          Магазин
          <select
            value={selectedStoreId ?? ""}
            onChange={(event) => onStoreChange(Number(event.target.value))}
            disabled={isLoadingStores || stores.length === 0}
          >
            {stores.map((store) => (
              <option key={store.store_id} value={store.store_id}>
                Store {store.store_id}
              </option>
            ))}
          </select>
        </label>

        <label>
          Модель
          <select value={model} onChange={(event) => onModelChange(event.target.value as ModelType)}>
            <option value="sarimax">SARIMAX</option>
            <option value="gru">GRU</option>
          </select>
        </label>

        <label>
          Горизонт, недель
          <input
            type="number"
            min={1}
            max={52}
            value={horizon}
            onChange={(event) => onHorizonChange(Number(event.target.value))}
          />
        </label>

        <button type="submit" disabled={!selectedStoreId || isLoadingForecast}>
          {isLoadingForecast ? "Строим прогноз..." : `Запустить ${MODEL_LABELS[model]}`}
        </button>
      </form>
    </section>
  );
}
