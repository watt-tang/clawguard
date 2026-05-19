import { useMemo } from "react";
import { useEChart } from "../../../hooks/useEChart.js";

const ROLE_STYLE_MAP = {
  source: {
    color: "#0f766e",
    bg: "rgba(15, 118, 110, 0.14)",
    border: "rgba(15, 118, 110, 0.28)",
    shadow: "rgba(15, 118, 110, 0.24)",
  },
  relay: {
    color: "#7e0c6e",
    bg: "rgba(126, 12, 110, 0.14)",
    border: "rgba(126, 12, 110, 0.24)",
    shadow: "rgba(126, 12, 110, 0.2)",
  },
  sink: {
    color: "#c2410c",
    bg: "rgba(194, 65, 12, 0.16)",
    border: "rgba(194, 65, 12, 0.28)",
    shadow: "rgba(194, 65, 12, 0.22)",
  },
};

const DEFAULT_STYLE = ROLE_STYLE_MAP.relay;
const Y_PATTERN = [58, 28, 68, 38, 62, 34, 72, 46];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function truncateText(value, maxLength = 18) {
  const text = String(value ?? "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
}

function buildChartModel(nodes = []) {
  const count = nodes.length;
  const step = count > 1 ? 72 / (count - 1) : 0;

  const chartNodes = nodes.map((node, index) => {
    const roleKey = String(node.role || "relay").toLowerCase();
    const style = ROLE_STYLE_MAP[roleKey] || DEFAULT_STYLE;
    let y = Y_PATTERN[index % Y_PATTERN.length];
    if (index === 0) y = 58;
    if (index === count - 1) y = 44;
    if (roleKey === "sink") y = Math.min(y, 44);
    if (roleKey === "source") y = Math.max(y, 56);

    return {
      ...node,
      x: count > 1 ? 14 + step * index : 50,
      y,
      roleKey,
      style,
      symbolSize: roleKey === "sink" ? 32 : roleKey === "source" ? 30 : 28,
      labelPosition: index % 2 === 0 ? "top" : "bottom",
      shortTitle: truncateText(node.title, 16),
    };
  });

  const chartLinks = chartNodes.slice(1).map((node, index) => {
    const source = chartNodes[index];
    const target = node;
    const targetStyle = target.style || DEFAULT_STYLE;
    return {
      source: source.id,
      target: target.id,
      edgeLabel: target.edgeLabel || "关联",
      sourceTitle: source.title,
      targetTitle: target.title,
      lineStyle: {
        width: 3,
        color: targetStyle.color,
        curveness: index % 2 === 0 ? 0.16 : -0.12,
        opacity: 0.82,
        shadowBlur: 8,
        shadowColor: targetStyle.shadow,
      },
      label: {
        show: true,
        formatter: () => `{edge|${truncateText(target.edgeLabel || "关联", 10)}}`,
      },
    };
  });

  return { chartNodes, chartLinks };
}

function buildTooltip(node) {
  const relations = Array.isArray(node.related) ? node.related : [];
  const relatedHtml = relations.length
    ? `<div class="cg-dynamic-tooltip-related">${relations
      .map((item) => `<span>${escapeHtml(item.label)}</span>`)
      .join("")}</div>`
    : '<div class="cg-dynamic-tooltip-empty">无额外关联边</div>';

  const completeness = node.completeness ? escapeHtml(node.completeness) : "normal";

  return `
    <div class="cg-dynamic-tooltip">
      <div class="cg-dynamic-tooltip-top">
        <span class="cg-dynamic-tooltip-role is-${escapeHtml(node.roleKey)}">${escapeHtml(node.roleLabel || "节点")}</span>
        <span class="cg-dynamic-tooltip-kind">${escapeHtml(node.nodeTypeLabel || "行为节点")}</span>
      </div>
      <div class="cg-dynamic-tooltip-title">${escapeHtml(node.title || "未命名节点")}</div>
      <div class="cg-dynamic-tooltip-detail">${escapeHtml(node.detail || "暂无节点说明。")}</div>
      <div class="cg-dynamic-tooltip-meta">完整度: ${completeness}</div>
      ${relatedHtml}
    </div>
  `;
}

export default function DynamicChainGraphChart({ chainGraph }) {
  const { chartNodes, chartLinks } = useMemo(
    () => buildChartModel(chainGraph?.nodes || []),
    [chainGraph?.nodes],
  );

  const { chartRef } = useEChart(
    () => ({
      animationDuration: 520,
      animationDurationUpdate: 300,
      tooltip: {
        trigger: "item",
        enterable: true,
        borderWidth: 0,
        backgroundColor: "rgba(18, 24, 38, 0.94)",
        extraCssText: "box-shadow: 0 18px 48px rgba(15, 23, 42, 0.28); border-radius: 18px; padding: 0;",
        formatter: (params) => {
          if (params.dataType === "edge") {
            const source = escapeHtml(params.data?.sourceTitle || params.data?.source || "");
            const target = escapeHtml(params.data?.targetTitle || params.data?.target || "");
            const edgeLabel = escapeHtml(params.data?.edgeLabel || "关联");
            return `
              <div class="cg-dynamic-tooltip cg-dynamic-tooltip-edge">
                <div class="cg-dynamic-tooltip-top">
                  <span class="cg-dynamic-tooltip-kind">链路关系</span>
                </div>
                <div class="cg-dynamic-tooltip-title">${edgeLabel}</div>
                <div class="cg-dynamic-tooltip-detail">${source} -> ${target}</div>
              </div>
            `;
          }
          return buildTooltip(params.data || {});
        },
      },
      series: [
        {
          type: "graph",
          layout: "none",
          roam: false,
          left: 8,
          right: 8,
          top: 18,
          bottom: 18,
          data: chartNodes.map((node) => ({
            id: node.id,
            name: node.title,
            x: node.x,
            y: node.y,
            title: node.title,
            detail: node.detail,
            roleLabel: node.roleLabel,
            roleKey: node.roleKey,
            nodeTypeLabel: node.nodeTypeLabel,
            related: node.related,
            completeness: node.completeness,
            symbolSize: node.symbolSize,
            itemStyle: {
              color: node.style.bg,
              borderColor: node.style.border,
              borderWidth: 2,
              shadowBlur: 18,
              shadowColor: node.style.shadow,
            },
            label: {
              show: true,
              position: node.labelPosition,
              distance: 12,
              formatter: () => `{title|${node.shortTitle}}\n{meta|${truncateText(node.nodeTypeLabel, 8)}}`,
            },
          })),
          links: chartLinks,
          edgeSymbol: ["none", "arrow"],
          edgeSymbolSize: [0, 8],
          lineStyle: {
            width: 3,
            color: "rgba(126, 12, 110, 0.35)",
            curveness: 0.12,
            opacity: 0.78,
          },
          edgeLabel: {
            show: true,
            fontSize: 11,
            color: "#475569",
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            borderColor: "rgba(126, 12, 110, 0.12)",
            borderWidth: 1,
            borderRadius: 999,
            padding: [4, 8],
            rich: {
              edge: {
                color: "#6b21a8",
                fontSize: 11,
                fontWeight: 700,
              },
            },
          },
          label: {
            color: "#1f1726",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 18,
            rich: {
              title: {
                color: "#201826",
                fontSize: 12,
                fontWeight: 800,
                align: "center",
              },
              meta: {
                color: "#756a80",
                fontSize: 10,
                fontWeight: 600,
                align: "center",
              },
            },
          },
          emphasis: {
            focus: "adjacency",
            scale: 1.12,
            lineStyle: {
              width: 4,
              opacity: 1,
            },
            label: {
              color: "#0f172a",
            },
          },
        },
      ],
    }),
    [JSON.stringify(chartNodes), JSON.stringify(chartLinks)],
  );

  return (
    <div className="dynamic-chain-graph-shell">
      <div className="dynamic-chain-visual-header">
        <span className="dynamic-chain-visual-stat">链路节点 {chainGraph.nodes.length}</span>
        <span className="dynamic-chain-visual-stat">图谱节点 {chainGraph.summary.nodeCount}</span>
        <span className="dynamic-chain-visual-stat">图谱边 {chainGraph.summary.edgeCount}</span>
      </div>
      {!chainGraph.hasRecoveredChain ? (
        <div className="skill-inline-empty dynamic-graph-hint">
          本次没有恢复出闭合链路，当前图谱展示的是动态执行中的关键节点关系。
        </div>
      ) : null}
      <div className="dynamic-chain-chart-shell">
        <div ref={chartRef} className="dynamic-chain-chart" />
      </div>
      <div className="dynamic-chain-chart-hint">悬浮或轻触节点可查看详细信息，边上的标签表示节点间的关键关系。</div>
      <div className="dynamic-chain-node-rail">
        {chainGraph.nodes.map((node) => (
          <div key={node.id} className={`dynamic-chain-node-pill is-${node.role || "relay"}`}>
            <span>{node.roleLabel}</span>
            <strong>{truncateText(node.title, 18)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
