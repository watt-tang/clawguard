import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { GEO_PATHS } from '../config.js';

const CHART_COLORS = {
  empty: '#dde8f0',
  min: '#b3d4e8',
  max: '#0c5478',
  bg: '#f0f6fb',
  border: '#c5dce8',
};

const TOP_N = 10;

/**
 * 全球暴露实例分布图
 * @param {{ topCountries: Array<{name:string, value:number}> }} data
 * @param {boolean} loading
 */
export default function WorldMapChart({ data, loading }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || loading) return undefined;

    let active = true;

    fetch(GEO_PATHS.WORLD)
      .then((r) => {
        if (!r.ok) throw new Error(`geo fetch failed: ${r.status}`);
        return r.json();
      })
      .then((geoJson) => {
        if (!active || !containerRef.current) return;

        echarts.registerMap('world', geoJson);

        const chart =
          echarts.getInstanceByDom(containerRef.current) ||
          echarts.init(containerRef.current, null, { renderer: 'canvas', locale: 'ZH' });
        chartRef.current = chart;

        const maxVal = Math.max(...data.topCountries.map((d) => d.value), 1);

        chart.setOption(
          {
            backgroundColor: CHART_COLORS.bg,
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                const v = params.value;
                if (!v) return `${params.name}<br/>暂无数据`;
                return `${params.name}<br/>暴露实例：<strong>${Number(v).toLocaleString('zh-CN')}</strong> 条`;
              },
            },
            visualMap: {
              min: 0,
              max: maxVal,
              left: 16,
              bottom: 16,
              text: ['多', '少'],
              textStyle: { color: '#4a6178', fontSize: 11 },
              inRange: { color: [CHART_COLORS.min, CHART_COLORS.max] },
              calculable: true,
            },
            series: [
              {
                type: 'map',
                map: 'world',
                roam: true,
                emphasis: {
                  label: { show: false },
                  itemStyle: { areaColor: '#0ea5e9', borderColor: '#0284c7' },
                },
                itemStyle: {
                  areaColor: CHART_COLORS.empty,
                  borderColor: CHART_COLORS.border,
                  borderWidth: 0.5,
                },
                data: data.topCountries,
              },
            ],
          },
          { notMerge: true }
        );

        const ro = new ResizeObserver(() => {
          if (!chart.isDisposed()) chart.resize();
        });
        ro.observe(containerRef.current);

        // store cleanup
        containerRef.current.__ro = ro;
      })
      .catch((err) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="oc-map-error">地图数据加载失败：${err.message}<br/>请运行 <code>npm run download:geo</code></div>`;
        }
      });

    return () => {
      active = false;
      if (containerRef.current?.__ro) containerRef.current.__ro.disconnect();
      if (chartRef.current && !chartRef.current.isDisposed()) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [data, loading]);

  const top = data?.topCountries?.slice(0, TOP_N) ?? [];
  const maxVal = top[0]?.value || 1;

  return (
    <div className="oc-map-layout">
      <div className="oc-map-container" ref={containerRef}>
        {loading && <div className="oc-chart-loading">加载中…</div>}
        {!loading && !data && <div className="oc-chart-empty">暂无数据</div>}
      </div>
      {top.length > 0 && (
        <div className="oc-map-sidebar">
          <div className="oc-map-sidebar-title">Top {TOP_N} 国家/地区</div>
          {top.map((item, i) => (
            <div key={item.name} className="oc-map-sidebar-row">
              <span className="oc-rank">{i + 1}</span>
              <span className="oc-country-name">{item.name}</span>
              <div className="oc-bar-wrap">
                <div
                  className="oc-bar-fill"
                  style={{ width: `${(item.value / maxVal) * 100}%` }}
                />
              </div>
              <span className="oc-country-val">{item.value.toLocaleString('zh-CN')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
