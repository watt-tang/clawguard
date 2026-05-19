import { useMemo, useState } from "react";

const ROLE_LABELS = {
  source: "起点",
  relay: "中继",
  sink: "终点",
};

const NODE_TYPE_LABELS = {
  file: "文件",
  data: "数据",
  process: "进程",
  tool_call: "工具调用",
  network_endpoint: "网络端点",
  llm_step: "LLM 步骤",
};

const EDGE_LABELS = {
  flows_to: "数据流转",
  causes: "触发",
  reads: "读取",
  writes: "写入",
  connects: "外联",
  llm_mediated: "模型中转",
};

// 这组常量可以直接手动调，控制图的整体疏密和悬浮卡位置。
const GRAPH_HEIGHT = 356;
const CENTER_Y = 176;
const TOP_LABEL_Y = 44;
const BOTTOM_LABEL_Y = 220;
const EDGE_PADDING = 84;
const LABEL_WIDTH = 170;
const TOOLTIP_WIDTH = 272;

const NODE_PURPLE = "rgb(126, 12, 110)";
const LINE_PURPLE = "rgba(126, 12, 110, 0.32)";
const NODE_GLOW = "rgba(126, 12, 110, 0.18)";

function truncateText(value, maxLength = 20) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 3))}...`;
}

function formatRole(role) {
  return ROLE_LABELS[String(role || "").toLowerCase()] || "节点";
}

function formatNodeType(nodeType) {
  return NODE_TYPE_LABELS[String(nodeType || "").toLowerCase()] || "行为节点";
}

function formatEdge(edgeType) {
  return EDGE_LABELS[String(edgeType || "").toLowerCase()] || "关联";
}

function buildTooltipLines(node) {
  const lines = [];
  if (node.detail) lines.push(node.detail);
  const related = Array.isArray(node.related) ? node.related.slice(0, 3) : [];
  related.forEach((item) => {
    if (item?.label) lines.push(item.label);
  });
  return lines;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildChartModel(nodes = []) {
  const count = nodes.length;
  const chartWidth = Math.max(820, count * 178 + 140);
  const startX = EDGE_PADDING;
  const endX = chartWidth - EDGE_PADDING;
  const step = count > 1 ? (endX - startX) / (count - 1) : 0;

  const chartNodes = nodes.map((node, index) => {
    const isTop = index % 2 === 0;
    const x = count > 1 ? startX + step * index : chartWidth / 2;
    const tooltipLeft = clamp(x - TOOLTIP_WIDTH / 2, 16, chartWidth - TOOLTIP_WIDTH - 16);
    return {
      ...node,
      x,
      y: CENTER_Y,
      isTop,
      titleShort: truncateText(node.title, 20),
      metaShort: truncateText(formatNodeType(node.nodeType), 12),
      roleLabel: formatRole(node.role),
      nodeTypeLabel: formatNodeType(node.nodeType),
      edgeLabel: formatEdge(node.edgeType),
      tooltipLines: buildTooltipLines(node),
      labelY: isTop ? TOP_LABEL_Y : BOTTOM_LABEL_Y,
      tooltipLeft,
      tooltipTop: isTop ? 12 : CENTER_Y + 34,
      tooltipArrowOffset: x - tooltipLeft,
    };
  });

  const chartLinks = chartNodes.slice(1).map((node, index) => {
    const source = chartNodes[index];
    const target = node;
    return {
      id: `${source.id}-${target.id}`,
      x1: source.x,
      y1: CENTER_Y,
      x2: target.x,
      y2: CENTER_Y,
      label: truncateText(target.edgeLabel, 8),
      labelX: (source.x + target.x) / 2,
      // Alternate relation chips above/below the center line.
      labelY: index % 2 === 0 ? CENTER_Y - 18 : CENTER_Y + 18,
      labelPlacement: index % 2 === 0 ? "top" : "bottom",
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
              <defs>
                <linearGradient id="dynamic-chain-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(126, 12, 110, 0.18)" />
                  <stop offset="55%" stopColor={LINE_PURPLE} />
                  <stop offset="100%" stopColor="rgba(126, 12, 110, 0.5)" />
                </linearGradient>
              </defs>

              <line
                x1={EDGE_PADDING}
                y1={CENTER_Y}
                x2={Math.max(EDGE_PADDING, chartWidth - EDGE_PADDING)}
                y2={CENTER_Y}
                stroke="rgba(126, 12, 110, 0.08)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {chartLinks.map((link) => (
                <line
                  key={link.id}
                  x1={link.x1}
                  y1={link.y1}
                  x2={link.x2}
                  y2={link.y2}
                  stroke="url(#dynamic-chain-line-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {chartLinks.map((link) => (
              <div
                key={`${link.id}-label`}
                className={`dynamic-chain-edge-label is-${link.labelPlacement}`}
                style={{ left: `${link.labelX}px`, top: `${link.labelY}px` }}
              >
                {link.label}
              </div>
            ))}

            {chartNodes.map((node) => {
              const isHovered = hoveredNodeId === node.id;
              return (
                <div
                  key={node.id}
                  className="dynamic-chain-node-anchor"
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId((current) => (current === node.id ? "" : current))}
                >
                  <div
                    className={`dynamic-chain-node-copy is-${node.isTop ? "top" : "bottom"}`}
                    style={{ top: `${node.labelY}px`, width: `${LABEL_WIDTH}px` }}
                  >
                    <span>{node.roleLabel}</span>
                    <strong>{node.titleShort || "节点"}</strong>
                    <em>{node.metaShort}</em>
                  </div>

                  <div
                    className={`dynamic-chain-node-stem is-${node.isTop ? "top" : "bottom"}`}
                    style={{ height: `${node.isTop ? CENTER_Y - node.labelY - 12 : node.labelY - CENTER_Y - 12}px` }}
                  />

                  <button
                    type="button"
                    className="dynamic-chain-node-dot"
                    aria-label={node.title || "节点"}
                    onFocus={() => setHoveredNodeId(node.id)}
                    onBlur={() => setHoveredNodeId((current) => (current === node.id ? "" : current))}
                  />

                  {isHovered ? (
                    <div
                      className={`dynamic-chain-hover-card is-${node.isTop ? "top" : "bottom"}`}
                      style={{
                        left: `${node.tooltipLeft - node.x}px`,
                        top: `${node.tooltipTop - node.y}px`,
                        "--arrow-offset": `${node.tooltipArrowOffset}px`,
                      }}
                    >
                      <div className="dynamic-chain-hover-role">
                        <span>{node.roleLabel}</span>
                        <span>{node.nodeTypeLabel}</span>
                      </div>
                      <strong>{node.title || "节点"}</strong>
                      {node.tooltipLines.length ? (
                        node.tooltipLines.map((line, index) => (
                          <p key={`${node.id}-line-${index}`}>{line}</p>
                        ))
                      ) : (
                        <p>当前节点暂无更多详细信息。</p>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="dynamic-chain-chart-hint">鼠标悬停在节点上可以查看详细信息，节点与连线颜色统一沿用页面主紫色体系。</div>

      <div className="dynamic-chain-node-rail">
        {chainGraph.nodes.map((node) => (
          <div key={node.id} className={`dynamic-chain-node-pill is-${node.role || "relay"}`}>
            <span>{formatRole(node.role)}</span>
            <strong>{truncateText(node.title, 18) || "节点"}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
