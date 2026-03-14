import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

/**
 * ECharts 图表实例生命周期管理 hook
 * 自动处理初始化、ResizeObserver 监听和销毁，避免内存泄漏
 *
 * @param {Function} buildOption  接收 (chart) 返回 option 的函数，在 ready 时调用
 * @param {Array}    deps         触发重新渲染的依赖项，发生变化时重新 setOption
 * @returns {{ chartRef, instanceRef }}
 *   chartRef    绑定到容器 DOM 元素的 ref
 *   instanceRef 可用于命令式调用 chart.dispatchAction 等
 */
export function useEChart(buildOption, deps = []) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const container = chartRef.current;
    if (!container) return undefined;

    // 初始化或复用实例
    let chart = echarts.getInstanceByDom(container);
    if (!chart) {
      chart = echarts.init(container, null, { renderer: 'canvas', locale: 'ZH' });
    }
    instanceRef.current = chart;

    const option = buildOption(chart);
    if (option) {
      chart.setOption(option, { notMerge: true });
    }

    // ResizeObserver 自动 resize
    const ro = new ResizeObserver(() => {
      if (!chart.isDisposed()) chart.resize();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      if (!chart.isDisposed()) {
        chart.dispose();
      }
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { chartRef, instanceRef };
}
