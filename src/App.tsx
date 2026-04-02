import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fetchForecast, fetchStoreSales, fetchStores } from "./api";
import { ControlsPanel } from "./components/ControlsPanel";
import { ForecastChartPanel } from "./components/ForecastChartPanel";
import { HeroSection } from "./components/HeroSection";
import { ResultsPanel } from "./components/ResultsPanel";
import { SalesChartPanel } from "./components/SalesChartPanel";
import { StoreSummaryPanel } from "./components/StoreSummaryPanel";
import { formatDate } from "./utils/format";
import type {
  ForecastPoint,
  GruResponse,
  ModelType,
  SalesRecord,
  SarimaxResponse,
  StoreAggregate,
} from "./types";

function App() {
  const [stores, setStores] = useState<StoreAggregate[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [model, setModel] = useState<ModelType>("sarimax");
  const [horizon, setHorizon] = useState<number>(12);
  const [forecast, setForecast] = useState<SarimaxResponse | GruResponse | null>(null);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [isLoadingSales, setIsLoadingSales] = useState(false);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preservedScrollTopRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadStores() {
      setIsLoadingStores(true);
      setError(null);

      try {
        const data = await fetchStores();
        setStores(data);
        setSelectedStoreId((current) => current ?? data[0]?.store_id ?? null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить магазины");
      } finally {
        setIsLoadingStores(false);
      }
    }

    void loadStores();
  }, []);

  useEffect(() => {
    if (!selectedStoreId) {
      return;
    }

    const storeId = selectedStoreId;

    async function loadSales() {
      setIsLoadingSales(true);
      setError(null);

      try {
        const data = await fetchStoreSales(storeId);
        setSales(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить продажи");
      } finally {
        setIsLoadingSales(false);
      }
    }

    void loadSales();
  }, [selectedStoreId]);

  useLayoutEffect(() => {
    if (preservedScrollTopRef.current === null) {
      return;
    }

    window.scrollTo({ top: preservedScrollTopRef.current, behavior: "auto" });

    if (!isLoadingSales && !isLoadingForecast) {
      preservedScrollTopRef.current = null;
    }
  }, [forecast, isLoadingForecast, isLoadingSales, sales]);

  async function handleForecastSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedStoreId) {
      return;
    }

    preservedScrollTopRef.current = window.scrollY;
    setIsLoadingForecast(true);
    setError(null);

    try {
      const data = await fetchForecast(model, selectedStoreId, horizon);
      setForecast(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Не удалось построить прогноз");
    } finally {
      setIsLoadingForecast(false);
    }
  }

  function handleStoreChange(storeId: number) {
    preservedScrollTopRef.current = window.scrollY;
    setSelectedStoreId(storeId);
  }

  function handleModelChange(nextModel: ModelType) {
    preservedScrollTopRef.current = window.scrollY;
    setModel(nextModel);
  }

  function handleHorizonChange(nextHorizon: number) {
    preservedScrollTopRef.current = window.scrollY;
    setHorizon(nextHorizon);
  }

  const selectedStore = useMemo(
    () => stores.find((item) => item.store_id === selectedStoreId) ?? null,
    [selectedStoreId, stores],
  );

  const salesChartData = useMemo(
    () =>
      sales.map((item) => ({
        date: item.date,
        label: formatDate(item.date),
        weekly_sales: item.weekly_sales,
      })),
    [sales],
  );

  const forecastChartData = useMemo(() => {
    if (!forecast) {
      return [];
    }

    return [...forecast.train_forecast, ...forecast.test_forecast].map((point: ForecastPoint) => ({
      date: point.date,
      label: formatDate(point.date),
      actual: point.actual,
      predicted: point.predicted,
      lower_ci: point.lower_ci,
      upper_ci: point.upper_ci,
    }));
  }, [forecast]);

  return (
    <div className="page-shell">
      {error ? <div className="error-banner">{error}</div> : null}

      <div className="workspace-layout">
        <aside className="controls-sidebar">
          <ControlsPanel
            stores={stores}
            selectedStoreId={selectedStoreId}
            model={model}
            horizon={horizon}
            isLoadingStores={isLoadingStores}
            isLoadingForecast={isLoadingForecast}
            onStoreChange={handleStoreChange}
            onModelChange={handleModelChange}
            onHorizonChange={handleHorizonChange}
            onSubmit={handleForecastSubmit}
          />
        </aside>

        <main className="content-stack">
          <HeroSection />

          <section className="dashboard-grid">
            <StoreSummaryPanel store={selectedStore} />
            <SalesChartPanel isLoading={isLoadingSales} data={salesChartData} />
            <ForecastChartPanel isLoading={isLoadingForecast} data={forecastChartData} />
          </section>

          <ResultsPanel forecast={forecast} model={model} />
        </main>
      </div>
    </div>
  );
}

export default App;
