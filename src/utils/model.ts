import type { GruResponse, SarimaxResponse } from "../types";

export function asSarimax(
  response: SarimaxResponse | GruResponse | null,
): SarimaxResponse | null {
  return response && "stationarity" in response ? response : null;
}

export function asGru(response: SarimaxResponse | GruResponse | null): GruResponse | null {
  return response && "hyperparams" in response ? response : null;
}
