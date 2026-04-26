import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import { VERSION_TOP_OPTIONS } from "../../../config.js";

const COLOR_PALETTE = [
  "rgb(67, 121, 201)",
  "rgb(89, 137, 229)",
  "rgb(81, 185, 200)",
  "rgb(115, 198, 160)",
  "rgb(113, 72, 179)",
  "rgb(126, 12, 110)",
  "rgb(170, 60, 155)",
  "rgb(217, 145, 32)",
  "rgb(196, 105, 40)",
  "rgb(88, 87, 196)",
  "rgb(142, 167, 84)",
  "rgb(188, 88, 124)",
];

function useDisplayVersions(data, topN) {
  const sortedVersions = useMemo(() => {
    if (!data?.versions) return [];
    return Object.entries(data.versions)
      .map(([name, values]) => ({ name, total: values.reduce((sum, value) => sum + value, 0) }))
      .sort((a, b) => b.total - a.total)
      .map((item) => item.name);
  }, [data]);

  const displayVersions = useMemo(() => sortedVersions.slice(0, topN), [sortedVersions, topN]);
  return { sortedVersions, displayVersions };
}

function useVersionChart(containerRef, data, loading, displayVersions) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    let chart = echarts.getInstanceByDom(containerRef.current);
    if (!chart) {
      chart = echarts.init(containerRef.current, null, { renderer: "canvas", locale: "ZH" });
    }
    chartRef.current = chart;

    if (loading || !data) {
      chart.showLoading({
        text: "加载中...",
        color: "rgb(126, 12, 110)",
        maskColor: "rgba(248,244,248,0.86)",
      });
      return undefined;
    }

    chart.hideLoading();

    const series = displayVersions.map((versionName, index) => ({
      name: versionName,
      type: "line",
      data: data.versions[versionName] ?? [],
      smooth: true,
      symbol: "none",
      lineStyle: { color: COLOR_PALETTE[index % COLOR_PALETTE.length], width: 1.9 },
    }));

    const legendScrollable = displayVersions.length > 10;

    chart.setOption(
      {
        backgroundColor: "transparent",
        color: COLOR_PALETTE,
        grid: { top: legendScrollable ? 80 : 56, right: 24, bottom: 48, left: 64 },
        legend: {
          type: legendScrollable ? "scroll" : "plain",
          top: 8,
          data: displayVersions,
          textStyle: { color: "#6b5f70", fontSize: 11 },
          itemWidth: 16,
          itemHeight: 3,
          pageTextStyle: { color: "#6b5f70" },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(36, 24, 40, 0.92)",
          borderColor: "rgba(255,255,255,0.12)",
          textStyle: { color: "#fff" },
          axisPointer: { type: "cross", lineStyle: { color: "rgb(126, 12, 110)", opacity: 0.35 } },
          formatter: (params) => {
            if (!params.length) return "";
            const date = params[0].axisValue;
            const lines = params
              .filter((item) => item.value != null)
              .sort((a, b) => b.value - a.value)
              .slice(0, 12)
              .map(
                (item) =>
                  `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:6px"></span>${item.seriesName}：<b>${Number(item.value).toLocaleString("zh-CN")}</b>`
              );
            return `<div style="font-size:12px;max-width:240px"><b>${date}</b><br/>${lines.join("<br/>")}</div>`;
          },
        },
        xAxis: {
          type: "category",
          data: data.dates ?? [],
          axisLine: { lineStyle: { color: "rgba(126, 12, 110, 0.16)" } },
          axisTick: { show: false },
          axisLabel: {
            color: "#7f7284",
            fontSize: 11,
            interval: Math.floor((data.dates?.length ?? 0) / 8),
          },
        },
        yAxis: {
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "rgba(126, 12, 110, 0.08)", type: "dashed" } },
          axisLabel: { color: "#7f7284", fontSize: 11 },
        },
        series,
      },
      { notMerge: true }
    );

    const ro = new ResizeObserver(() => {
      if (!chart.isDisposed()) chart.resize();
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      if (!chart.isDisposed()) chart.dispose();
      chartRef.current = null;
    };
  }, [containerRef, data, loading, displayVersions]);
}

export default function VersionTrendChart({ data, loading }) {
  const containerRef = useRef(null);
  const [topN, setTopN] = useState(VERSION_TOP_OPTIONS[0]);
  const { displayVersions } = useDisplayVersions(data, topN);

  useVersionChart(containerRef, data, loading, displayVersions);

  const dropdownExtra = (
    <div className="oc-version-selector">
      <label htmlFor="version-top-select" className="oc-version-selector-label">
        展示前
      </label>
      <select
        id="version-top-select"
        className="oc-select"
        value={topN}
        onChange={(event) => setTopN(Number(event.target.value))}
      >
        {VERSION_TOP_OPTIONS.map((count) => (
          <option key={count} value={count}>
            {count} 个版本
          </option>
        ))}
      </select>
    </div>
  );

  return { dropdownExtra, node: <div ref={containerRef} className="oc-chart-container" style={{ height: 360 }} /> };
}

export function VersionTrendChartWithControl({ data, loading }) {
  const containerRef = useRef(null);
  const [topN, setTopN] = useState(VERSION_TOP_OPTIONS[0]);
  const { sortedVersions, displayVersions } = useDisplayVersions(data, topN);

  useVersionChart(containerRef, data, loading, displayVersions);

  return (
    <div>
      <div className="oc-version-toolbar">
        <label htmlFor="version-top-sel" className="oc-version-selector-label">
          展示前
        </label>
        <select
          id="version-top-sel"
          className="oc-select"
          value={topN}
          onChange={(event) => setTopN(Number(event.target.value))}
        >
          {VERSION_TOP_OPTIONS.map((count) => (
            <option key={count} value={count}>
              {count} 个版本
            </option>
          ))}
        </select>
        <span className="oc-version-selector-label">（共 {sortedVersions.length} 个版本）</span>
      </div>
      <div ref={containerRef} className="oc-chart-container" style={{ height: 360 }} />
    </div>
  );
}
