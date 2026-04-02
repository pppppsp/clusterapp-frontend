import type {
  GruResponse,
  ModelType,
  SalesRecord,
  SarimaxResponse,
  StoreAggregate,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchStores(): Promise<StoreAggregate[]> {
  return request<StoreAggregate[]>("/api/v1/stores");
}

export async function fetchStoreSales(storeId: number): Promise<SalesRecord[]> {
  return request<SalesRecord[]>(`/api/v1/stores/${storeId}/sales`);
}

export async function fetchForecast(
  model: ModelType,
  storeId: number,
  horizon: number,
): Promise<SarimaxResponse | GruResponse> {
  return request<SarimaxResponse | GruResponse>(`/api/v1/forecast/${model}`, {
    method: "POST",
    body: JSON.stringify({ store_id: storeId, horizon }),
  });
}
