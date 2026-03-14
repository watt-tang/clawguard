import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LINE_COLORS = ['#0ea5e9', '#10b981', '#f59e0b'];
const SERIES_LABELS = ['每日数量', '累计数量', '新增数量'];

/**
 * 暴露实例演化趋势 — 三条折线
 * data 结构：{ dates: string[], daily: number[], cumulative: number[], newAdded: number[] }
 */
export default function ExposureTrendChart({ data, loading }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

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

    const { dates = [], daily = [], cumulative = [], newAdded = [] } = data;

    chart.setOption(
      {
        backgroundColor: 'transparent',
        grid: { top: 44, right: 24, bottom: 56, left: 64 },
        legend: {
          top: 8,
          right: 16,
          data: SERIES_LABELS,
          textStyle: { color: '#4a6178', fontSize: 12 },
          itemWidth: 20,
          itemHeight: 3,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross', lineStyle: { color: '#0ea5e9', opacity: 0.4 } },
          formatter: (params) => {
            if (!params.length) return '';
            const date = params[0].axisValue;
            const lines = params.map(
              (p) => `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:6px"></span>${p.seriesName}：<b>${Number(p.value).toLocaleString('zh-CN')}</b>`
            );
            return `<div style="font-size:12px;color:#1e3a5f"><b>${date}</b><br/>${lines.join('<br/>')}</div>`;
          },
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLine: { lineStyle: { color: '#c5dce8' } },
          axisTick: { show: false },
          axisLabel: {
            color: '#6b8a9e',
            fontSize: 11,
            interval: Math.floor(dates.length / 8),
            rotate: 0,
          },
        },
        yAxis: [
          {
            type: 'value',
            name: '每日 / 新增',
            nameTextStyle: { color: '#6b8a9e', fontSize: 11 },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: '#e8f0f6', type: 'dashed' } },
            axisLabel: { color: '#6b8a9e', fontSize: 11 },
          },
          {
            type: 'value',
            name: '累计',
            nameTextStyle: { color: '#6b8a9e', fontSize: 11 },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { color: '#6b8a9e', fontSize: 11 },
          },
        ],
        series: [
          {
            name: SERIES_LABELS[0],
            type: 'line',
            yAxisIndex: 0,
            data: daily,
            smooth: true,
            symbol: 'none',
            lineStyle: { color: LINE_COLORS[0], width: 2 },
            areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(14,165,233,0.18)' }, { offset: 1, color: 'rgba(14,165,233,0)' }] } },
          },
          {
            name: SERIES_LABELS[1],
            type: 'line',
            yAxisIndex: 1,
            data: cumulative,
            smooth: true,
            symbol: 'none',
            lineStyle: { color: LINE_COLORS[1], width: 2 },
          },
          {
            name: SERIES_LABELS[2],
            type: 'bar',
            yAxisIndex: 0,
            data: newAdded,
            barMaxWidth: 6,
            itemStyle: { color: LINE_COLORS[2], borderRadius: [2, 2, 0, 0] },
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

  return (
    <div
      ref={containerRef}
      className="oc-chart-container"
      style={{ height: 320 }}
    />
  );
}
