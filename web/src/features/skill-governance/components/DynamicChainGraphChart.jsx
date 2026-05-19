import { useMemo, useState } from "react";

const ROLE_STYLE_MAP = {
  source: {
    dot: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.24)",
    line: "#9f67ff",
    chipBg: "rgba(139, 92, 246, 0.08)",
    chipBorder: "rgba(139, 92, 246, 0.16)",
  },
  relay: {
    dot: "#7e22ce",
    glow: "rgba(126, 34, 206, 0.24)",
    line: "#8b3df0",
    chipBg: "rgba(126, 34, 206, 0.08)",
    chipBorder: "rgba(126, 34, 206, 0.16)",
  },
  sink: {
    dot: "#db2777",
    glow: "rgba(219, 39, 119, 0.22)",
    line: "#ec4899",
    chipBg: "rgba(219, 39, 119, 0.08)",
    chipBorder: "rgba(219, 39, 119, 0.16)",
  },
};

const DEFAULT_STYLE = ROLE_STYLE_MAP.relay;
const GRAPH_HEIGHT = 320;
const NODE_RADIUS = 7;
const TOP_Y = 82;
const BOTTOM_Y = 236;

function truncateText(value, maxLength = 22) {
  const text = String(value ?? "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
}

function buildTooltipLines(node) {
  const lines = [];
  if (node.detail) lines.push(node.detail);
  const related = Array.isArray(node.related) ? node.related.slice(0, 2) : [];
  related.forEach((item) => {
    if (item?.label) lines.push(item.label);
  });
  return lines;
}

function buildCurvePath(source, target) {
  const deltaX = target.x - source.x;
  const controlOffset = Math.max(60, deltaX * 0.36);
  return [
    `M ${source.x} ${source.y}`,
    `C ${source.x + controlOffset} ${source.y},`,
    `${target.x - controlOffset} ${target.y},`,
    `${target.x} ${target.y}`,
  ].join(" ");
}

function buildChartModel(nodes = []) {
  const count = nodes.length;
  const chartWidth = Math.max(920, count * 220);
  const startX = 78;
  const endX = chartWidth - 78;
  const step = count > 1 ? (endX - startX) / (count - 1) : 0;

  const chartNodes = nodes.map((node, index) => {
    const roleKey = String(node.role || "relay").toLowerCase();
    const style = ROLE_STYLE_MAP[roleKey] || DEFAULT_STYLE;
    const isTop = index % 2 === 1;
    return {
      ...node,
      x: count > 1 ? startX + step * index : chartWidth / 2,
      y: isTop ? TOP_Y : BOTTOM_Y,
      isTop,
      roleKey,
      style,
      titleShort: truncateText(node.title, 22),
      metaShort: truncateText(node.nodeTypeLabel || node.roleLabel || "", 10),
      tooltipLines: buildTooltipLines(node),
    };
  });

  const chartLinks = chartNodes.slice(1).map((node, index) => {
    const source = chartNodes[index];
    const target = node;
    const relationLabel = truncateText(target.edgeLabel || "关联", 8);
    return {
      id: `${source.id}-${target.id}`,
      sourceId: source.id,
      targetId: target.id,
      label: relationLabel,
      style: target.style || DEFAULT_STYLE,
      path: buildCurvePath(source, target),
      labelX: (source.x + target.x) / 2,
      labelY: Math.min(source.y, target.y) + Math.abs(target.y - source.y) / 2,
    };
  });

  return { chartNodes, chartLinks, chartWidth };
}

export default function DynamicChainGraphChart({ chainGraph }) {
  const [hoveredNodeId, setHoveredNodeId] = useState("");
  const { chartNodes, chartLinks, chartWidth } = useMemo(
    () => buildChartModel(chainGraph?.nodes || []),
    [chainGraph?.nodes],
  );

  const hoveredNode = chartNodes.find((node) => node.id === hoveredNodeId) || null;

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
        <div className="dynamic-chain-chart-scroll">
          <div className="dynamic-chain-custom-chart" style={{ width: `${chartWidth}px`, height: `${GRAPH_HEIGHT}px` }}>
            <svg
              className="dynamic-chain-svg"
              viewBox={`0 0 ${chartWidth} ${GRAPH_HEIGHT}`}
              width={chartWidth}
              height={GRAPH_HEIGHT}
              aria-hidden="true"
            >
              {chartLinks.map((link) => (
                <path
                  key={link.id}
                  d={link.path}
                  fill="none"
                  stroke={link.style.line}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.92"
                />
              ))}
            </svg>

            {chartLinks.map((link) => (
              <div
                key={`${link.id}-label`}
                className="dynamic-chain-edge-label"
                style={{
                  left: `${link.labelX}px`,
                  top: `${link.labelY}px`,
                  backgroundColor: link.style.chipBg,
                  borderColor: link.style.chipBorder,
                  color: link.style.dot,
                }}
              >
                {link.label}
              </div>
            ))}

            {chartNodes.map((node) => (
              <div key={node.id}>
                <div
                  className={`dynamic-chain-node-copy is-${node.isTop ? "top" : "bottom"}`}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                >
                  <strong>{node.titleShort}</strong>
                  <span>{node.metaShort}</span>
                </div>
                <button
                  type="button"
                  className="dynamic-chain-node-dot"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    "--dot-color": node.style.dot,
                    "--dot-glow": node.style.glow,
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId((current) => (current === node.id ? "" : current))}
                  onFocus={() => setHoveredNodeId(node.id)}
                  onBlur={() => setHoveredNodeId((current) => (current === node.id ? "" : current))}
                  aria-label={node.title || "节点"}
                />
              </div>
            ))}

            {hoveredNode ? (
              <div
                className={`dynamic-chain-hover-card is-${hoveredNode.isTop ? "bottom" : "top"}`}
                style={{
                  left: `${hoveredNode.x}px`,
                  top: `${hoveredNode.y}px`,
                  "--hover-accent": hoveredNode.style.dot,
                }}
              >
                <div className="dynamic-chain-hover-role">
                  <span>{hoveredNode.roleLabel || "节点"}</span>
                  <span>{hoveredNode.nodeTypeLabel || "行为节点"}</span>
                </div>
                <strong>{hoveredNode.title}</strong>
                {hoveredNode.tooltipLines.map((line, index) => (
                  <p key={`${hoveredNode.id}-line-${index}`}>{line}</p>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="dynamic-chain-chart-hint">鼠标悬浮或轻触圆点可查看详细信息，上下文案用于快速识别关键节点。</div>
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
