import { useEffect, useRef, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import { VERSION_TOP_OPTIONS } from '../config.js';

// 为多版本生成色盘（teal → blue → purple 系）
const COLOR_PALETTE = [
  '#0ea5e9','#06b6d4','#10b981','#84cc16','#eab308',
  '#f97316','#ef4444','#ec4899','#8b5cf6','#6366f1',
  '#3b82f6','#14b8a6','#22c55e','#a3e635','#fbbf24',
  '#fb923c','#f87171','#f472b6','#a78bfa','#818cf8',
];

/**
 * 版本实例演化趋势 — 多折线
 * data 结构：{ dates: string[], versions: { [versionName]: number[] } }
 */
export default function VersionTrendChart({ data, loading }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [topN, setTopN] = useState(VERSION_TOP_OPTIONS[0]);

  // 按总量排序版本，取前 N
  const sortedVersions = useMemo(() => {
    if (!data?.versions) return [];
    return Object.entries(data.versions)
      .map(([name, values]) => ({ name, total: values.reduce((s, v) => s + v, 0) }))
      .sort((a, b) => b.total - a.total)
      .map((v) => v.name);
  }, [data]);

  const displayVersions = useMemo(
    () => sortedVersions.slice(0, topN),
    [sortedVersions, topN]
  );

  useEffect(() => {
    if (!containerRef.current) return undefined;

    let chart = echarts.getInstanceByDom(containerRef.current);
    if (!chart) {
      chart = echarts.init(containerRef.current, null, { renderer: 'canvas', locale: 'ZH' });
    }
    chartRef.current = chart;

    if (loading || !data) {
      chart.showLoading({ text: '加载中…', color: '#0ea5e9', maskColor: 'rgba(240,246,251,0.8)' });
      return undefined;
    }

    chart.hideLoading();

    const series = displayVersions.map((vname, idx) => ({
      name: vname,
      type: 'line',
      data: data.versions[vname] ?? [],
      smooth: true,
      symbol: 'none',
      lineStyle: { color: COLOR_PALETTE[idx % COLOR_PALETTE.length], width: 1.8 },
    }));

    const legendScrollable = displayVersions.length > 10;

    chart.setOption(
      {
        backgroundColor: 'transparent',
        color: COLOR_PALETTE,
        grid: { top: legendScrollable ? 80 : 56, right: 24, bottom: 48, left: 64 },
        legend: {
          type: legendScrollable ? 'scroll' : 'plain',
          top: 8,
          data: displayVersions,
          textStyle: { color: '#4a6178', fontSize: 11 },
          itemWidth: 16,
          itemHeight: 3,
          pageButtonItemGap: 5,
          pageTextStyle: { color: '#4a6178' },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', lineStyle: { color: '#0ea5e9', opacity: 0.4 } },
          formatter: (params) => {
            if (!params.length) return '';
            const date = params[0].axisValue;
            const lines = params
              .filter((p) => p.value != null)
              .sort((a, b) => b.value - a.value)
              .slice(0, 12) // 防止 tooltip 太长
              .map(
                (p) =>
                  `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:6px"></span>${p.seriesName}：<b>${Number(p.value).toLocaleString('zh-CN')}</b>`
              );
            return `<div style="font-size:12px;color:#1e3a5f;max-width:240px"><b>${date}</b><br/>${lines.join('<br/>')}</div>`;
          },
        },
        xAxis: {
          type: 'category',
          data: data.dates ?? [],
          axisLine: { lineStyle: { color: '#c5dce8' } },
          axisTick: { show: false },
          axisLabel: {
            color: '#6b8a9e',
            fontSize: 11,
            interval: Math.floor((data.dates?.length ?? 0) / 8),
          },
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e8f0f6', type: 'dashed' } },
          axisLabel: { color: '#6b8a9e', fontSize: 11 },
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
  }, [data, loading, displayVersions]);

  const dropdownExtra = (
    <div className="oc-version-selector">
      <label htmlFor="version-top-select" className="oc-version-selector-label">
        展示前
      </label>
      <select
        id="version-top-select"
        className="oc-select"
        value={topN}
        onChange={(e) => setTopN(Number(e.target.value))}
      >
        {VERSION_TOP_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n} 个版本
          </option>
        ))}
      </select>
    </div>
  );

  return { dropdownExtra, node: <div ref={containerRef} className="oc-chart-container" style={{ height: 360 }} /> };
}

/**
 * 版本趋势图 — 包含控件的完整组件（供 CollapsePanel extra 使用）
 */
export function VersionTrendChartWithControl({ data, loading }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [topN, setTopN] = useState(VERSION_TOP_OPTIONS[0]);

  const sortedVersions = useMemo(() => {
    if (!data?.versions) return [];
    return Object.entries(data.versions)
      .map(([name, values]) => ({ name, total: values.reduce((s, v) => s + v, 0) }))
      .sort((a, b) => b.total - a.total)
      .map((v) => v.name);
  }, [data]);

  const displayVersions = useMemo(() => sortedVersions.slice(0, topN), [sortedVersions, topN]);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    let chart = echarts.getInstanceByDom(containerRef.current);
    if (!chart) {
      chart = echarts.init(containerRef.current, null, { renderer: 'canvas', locale: 'ZH' });
    }
    chartRef.current = chart;

    if (loading || !data) {
      chart.showLoading({ text: '加载中…', color: '#0ea5e9', maskColor: 'rgba(240,246,251,0.8)' });
      return undefined;
    }

    chart.hideLoading();

    const series = displayVersions.map((vname, idx) => ({
      name: vname,
      type: 'line',
      data: data.versions[vname] ?? [],
      smooth: true,
      symbol: 'none',
      lineStyle: { color: COLOR_PALETTE[idx % COLOR_PALETTE.length], width: 1.8 },
    }));

    const legendScrollable = displayVersions.length > 10;

    chart.setOption(
      {
        backgroundColor: 'transparent',
        color: COLOR_PALETTE,
        grid: { top: legendScrollable ? 80 : 56, right: 24, bottom: 48, left: 64 },
        legend: {
          type: legendScrollable ? 'scroll' : 'plain',
          top: 8,
          data: displayVersions,
          textStyle: { color: '#4a6178', fontSize: 11 },
          itemWidth: 16,
          itemHeight: 3,
          pageTextStyle: { color: '#4a6178' },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', lineStyle: { color: '#0ea5e9', opacity: 0.4 } },
          formatter: (params) => {
            if (!params.length) return '';
            const date = params[0].axisValue;
            const lines = params
              .filter((p) => p.value != null)
              .sort((a, b) => b.value - a.value)
              .slice(0, 12)
              .map(
                (p) =>
                  `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:6px"></span>${p.seriesName}：<b>${Number(p.value).toLocaleString('zh-CN')}</b>`
              );
            return `<div style="font-size:12px;color:#1e3a5f;max-width:240px"><b>${date}</b><br/>${lines.join('<br/>')}</div>`;
          },
        },
        xAxis: {
          type: 'category',
          data: data.dates ?? [],
          axisLine: { lineStyle: { color: '#c5dce8' } },
          axisTick: { show: false },
          axisLabel: {
            color: '#6b8a9e',
            fontSize: 11,
            interval: Math.floor((data.dates?.length ?? 0) / 8),
          },
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#e8f0f6', type: 'dashed' } },
          axisLabel: { color: '#6b8a9e', fontSize: 11 },
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
  }, [data, loading, displayVersions]);

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
          onChange={(e) => setTopN(Number(e.target.value))}
        >
          {VERSION_TOP_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} 个版本
            </option>
          ))}
        </select>
        <span className="oc-version-selector-label">（共 {sortedVersions.length} 个版本）</span>
      </div>
      <div ref={containerRef} className="oc-chart-container" style={{ height: 360 }} />
    </div>
  );
}
