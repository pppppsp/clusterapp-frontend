import { useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Tooltip,
  Legend,
  Filler,
);

interface ChartJsDataset {
  label: string;
  data: Array<number | null>;
  borderColor: string;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  borderDash?: number[];
}

interface ChartJsLineChartProps {
  labels: string[];
  datasets: ChartJsDataset[];
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number | null) => string;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export function ChartJsLineChart({
  labels,
  datasets,
  yAxisFormatter,
  tooltipFormatter,
  xAxisTitle,
  yAxisTitle,
}: ChartJsLineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line"> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    chartRef.current?.destroy();

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data: {
        labels,
        datasets: datasets.map((dataset) => ({
          ...dataset,
          spanGaps: true,
          cubicInterpolationMode: "monotone",
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            labels: {
              color: "#d9e6f7",
            },
          },
          tooltip: {
            callbacks: {
              label(context) {
                const value = context.parsed.y as number | null;
                const label = context.dataset.label ?? "";
                const formatted = tooltipFormatter
                  ? tooltipFormatter(value)
                  : value?.toString() ?? "—";
                return `${label}: ${formatted}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: xAxisTitle
              ? {
                  display: true,
                  text: xAxisTitle,
                  color: "#d9e6f7",
                }
              : undefined,
            ticks: {
              color: "#9bb0c6",
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
            },
            grid: {
              color: "rgba(255,255,255,0.06)",
            },
          },
          y: {
            title: yAxisTitle
              ? {
                  display: true,
                  text: yAxisTitle,
                  color: "#d9e6f7",
                }
              : undefined,
            ticks: {
              color: "#9bb0c6",
              callback(value) {
                return yAxisFormatter ? yAxisFormatter(Number(value)) : String(value);
              },
            },
            grid: {
              color: "rgba(255,255,255,0.06)",
            },
          },
        },
      },
    };

    chartRef.current = new Chart(canvas, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [datasets, labels, tooltipFormatter, xAxisTitle, yAxisFormatter, yAxisTitle]);

  return <canvas ref={canvasRef} />;
}
