import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const LINE_COLORS = ["rgb(126, 12, 110)", "rgb(67, 121, 201)", "rgba(217, 145, 32, 0.8)"];
const SERIES_LABELS = ["每日数量", "累计数量", "新增数量"];

export default function ExposureTrendChart({ data, loading }) {
  const containerRef = useRef(null);
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

    const { dates = [], daily = [], cumulative = [], newAdded = [] } = data;

    chart.setOption(
      {
        backgroundColor: "transparent",
        grid: { top: 48, right: 24, bottom: 56, left: 64 },
        legend: {
          top: 8,
          right: 16,
          data: SERIES_LABELS,
          textStyle: { color: "#6b5f70", fontSize: 12 },
          itemWidth: 20,
          itemHeight: 3,
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
            const lines = params.map(
              (item) =>
                `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:6px"></span>${item.seriesName}：<b>${Number(item.value).toLocaleString("zh-CN")}</b>`
            );
            return `<div style="font-size:12px"><b>${date}</b><br/>${lines.join("<br/>")}</div>`;
          },
        },
        xAxis: {
          type: "category",
          data: dates,
          axisLine: { lineStyle: { color: "rgba(126, 12, 110, 0.16)" } },
          axisTick: { show: false },
          axisLabel: {
            color: "#7f7284",
            fontSize: 11,
            interval: Math.floor(dates.length / 8),
          },
        },
        yAxis: [
          {
            type: "value",
            name: "每日 / 新增",
            nameTextStyle: { color: "#7f7284", fontSize: 11 },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: "rgba(126, 12, 110, 0.08)", type: "dashed" } },
            axisLabel: { color: "#7f7284", fontSize: 11 },
          },
          {
            type: "value",
            name: "累计",
            nameTextStyle: { color: "#7f7284", fontSize: 11 },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { color: "#7f7284", fontSize: 11 },
          },
        ],
        series: [
          {
            name: SERIES_LABELS[0],
            type: "line",
            yAxisIndex: 0,
            data: daily,
            smooth: true,
            symbol: "none",
            lineStyle: { color: LINE_COLORS[0], width: 2.2 },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(126,12,110,0.15)" },
                  { offset: 1, color: "rgba(126,12,110,0)" },
                ],
              },
            },
          },
          {
            name: SERIES_LABELS[1],
            type: "line",
            yAxisIndex: 1,
            data: cumulative,
            smooth: true,
            symbol: "none",
            lineStyle: { color: LINE_COLORS[1], width: 2.1 },
          },
          {
            name: SERIES_LABELS[2],
            type: "bar",
            yAxisIndex: 0,
            data: newAdded,
            barMaxWidth: 8,
            itemStyle: { color: LINE_COLORS[2], borderRadius: [4, 4, 0, 0] },
          },
        ],
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
  }, [data, loading]);

  return <div ref={containerRef} className="oc-chart-container" style={{ height: 320 }} />;
}
