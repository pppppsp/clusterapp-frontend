export type ModelType = "sarimax" | "gru";

export interface StoreAggregate {
  store_id: number;
  mean_sales: number;
  std_sales: number;
  mean_temperature: number;
  mean_cpi: number;
  mean_unemployment: number;
  mean_fuel_price: number;
}

export interface SalesRecord {
  store: number;
  date: string;
  weekly_sales: number;
  holiday_flag: number;
  temperature: number;
  fuel_price: number;
  cpi: number;
  unemployment: number;
}

export interface ForecastPoint {
  date: string;
  actual: number | null;
  predicted: number;
  lower_ci: number | null;
  upper_ci: number | null;
}

export interface Metrics {
  mae: number;
  rmse: number;
  mape: number;
}

export interface Stationarity {
  adf_statistic: number;
  p_value: number;
  is_stationary: boolean;
  differencing_order: number;
}

export interface SarimaxResponse {
  stationarity: Stationarity;
  order: [number, number, number];
  seasonal_order: [number, number, number, number];
  train_forecast: ForecastPoint[];
  test_forecast: ForecastPoint[];
  residuals?: number[] | null;
  acf_values?: number[] | null;
  pacf_values?: number[] | null;
  acf_lags?: number[] | number | null;
  metrics: Metrics;
}

export interface GruHyperparams {
  hidden_size: number;
  num_layers: number;
  epochs_trained: number;
  learning_rate: number;
  sequence_length: number;
  features: string[];
}

export interface GruResponse {
  hyperparams: GruHyperparams;
  train_forecast: ForecastPoint[];
  test_forecast: ForecastPoint[];
  training_losses?: number[] | null;
  metrics: Metrics;
}
