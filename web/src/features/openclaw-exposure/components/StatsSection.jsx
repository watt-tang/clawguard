export default function StatsSection({ stats, loading }) {
  const cards = [
    { label: "历史暴露服务总数", key: "historyTotal", unit: "条" },
    { label: "当前暴露实例数", key: "currentExposed", unit: "条" },
    { label: "境内暴露总数", key: "domesticTotal", unit: "条" },
    { label: "境外暴露总数", key: "overseasTotal", unit: "条" },
    { label: "覆盖国家 / 地区数", key: "countryCoverage", unit: "个" },
    { label: "涉及城市数", key: "cityCount", unit: "个" },
    { label: "运营商 / 版本数", key: "operatorCount", unit: "个" },
    { label: "高风险实例数", key: "highRiskCount", unit: "条" },
  ];

  return (
    <div className="oc-stats-grid">
      {cards.map(({ label, key, unit }) => (
        <div key={key} className="oc-stat-card">
          <div className="oc-stat-label">{label}</div>
          <div className="oc-stat-value">
            {loading ? (
              <span className="oc-stat-skeleton" />
            ) : stats ? (
              <>
                <strong>{(stats[key] ?? stats.vendorCount ?? 0).toLocaleString("zh-CN")}</strong>
                <span className="oc-stat-unit">{unit}</span>
              </>
            ) : (
              <span className="oc-stat-empty">--</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
