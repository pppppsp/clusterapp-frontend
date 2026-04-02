import type { GruResponse, SarimaxResponse } from "../types";
import { asGru, asSarimax } from "../utils/model";
import { formatNumber } from "../utils/format";

interface ModelDetailsProps {
  response: SarimaxResponse | GruResponse;
}

export function ModelDetails({ response }: ModelDetailsProps) {
  const sarimax = asSarimax(response);
  const gru = asGru(response);

  return (
    <div className="subpanel">
      <h3>Параметры модели</h3>
      {sarimax ? (
        <div className="details-list">
          <DetailRow
            label="Stationary"
            value={sarimax.stationarity.is_stationary ? "Да" : "Нет"}
          />
          <DetailRow
            label="ADF / p-value"
            value={`${formatNumber(sarimax.stationarity.adf_statistic, 4)} / ${formatNumber(
              sarimax.stationarity.p_value,
              4,
            )}`}
          />
          <DetailRow
            label="Differencing order"
            value={String(sarimax.stationarity.differencing_order)}
          />
          <DetailRow label="Order" value={`(${sarimax.order.join(", ")})`} />
          <DetailRow label="Seasonal order" value={`(${sarimax.seasonal_order.join(", ")})`} />
        </div>
      ) : null}
      {gru ? (
        <div className="details-list">
          <DetailRow label="Hidden size" value={String(gru.hyperparams.hidden_size)} />
          <DetailRow label="Layers" value={String(gru.hyperparams.num_layers)} />
          <DetailRow label="Epochs" value={String(gru.hyperparams.epochs_trained)} />
          <DetailRow label="Learning rate" value={String(gru.hyperparams.learning_rate)} />
          <DetailRow label="Sequence length" value={String(gru.hyperparams.sequence_length)} />
          <DetailRow label="Features" value={gru.hyperparams.features.join(", ")} />
        </div>
      ) : null}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
