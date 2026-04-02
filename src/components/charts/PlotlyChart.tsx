import { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist-min";
import type { Config, Data, Layout } from "plotly.js-dist-min";

interface PlotlyChartProps {
  data: Data[];
  layout?: Partial<Layout>;
  config?: Partial<Config>;
}

export function PlotlyChart({ data, layout, config }: PlotlyChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const mergedLayout: Partial<Layout> = {
      autosize: true,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(15, 23, 42, 0.65)",
      font: {
        color: "#d9e6f7",
        size: 14,
      },
      margin: { l: 56, r: 24, t: 24, b: 56 },
      xaxis: {
        automargin: true,
        title: {
          font: {
            size: 15,
            color: "#d9e6f7",
          },
          standoff: 12,
        },
        tickfont: {
          size: 12,
          color: "#9bb0c6",
        },
        gridcolor: "rgba(255,255,255,0.06)",
        zerolinecolor: "rgba(255,255,255,0.08)",
        ...(layout?.xaxis ?? {}),
      },
      yaxis: {
        automargin: true,
        title: {
          font: {
            size: 15,
            color: "#d9e6f7",
          },
          standoff: 12,
        },
        tickfont: {
          size: 12,
          color: "#9bb0c6",
        },
        gridcolor: "rgba(255,255,255,0.06)",
        zerolinecolor: "rgba(255,255,255,0.08)",
        ...(layout?.yaxis ?? {}),
      },
      ...layout,
    };

    void Plotly.react(
      container,
      data,
      mergedLayout,
      {
        responsive: true,
        displayModeBar: false,
        ...config,
      },
    );

    const handleResize = () => {
      void Plotly.Plots.resize(container);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      void Plotly.purge(container);
    };
  }, [config, data, layout]);

  return <div className="plotly-host" ref={containerRef} />;
}
