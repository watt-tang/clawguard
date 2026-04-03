import { useEffect, useMemo, useState } from "react";
import { Activity, BookOpenText, Globe2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEChart } from "../../../hooks/useEChart.js";
import { fetchGovernanceOverview } from "../services/dataService.js";

function GovernanceCard({ title, subtitle, icon: Icon, children }) {
  return (
    <section className="gov-card">
      <div className="gov-card-head">
        <div className="gov-card-icon">
          <Icon size={16} strokeWidth={2} />
        </div>
        <div>
          <div className="gov-card-title">{title}</div>
          <div className="gov-card-subtitle">{subtitle}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function HealthRadar({ exposure, risk, research }) {
  const indicators = [
    { name: "暴露收敛", value: Math.max(5, 100 - Math.min(100, Math.round((exposure?.currentExposed || 0) / 900))) },
    { name: "漏洞修复", value: risk?.fixProgress?.percentFixed ?? 0 },
    { name: "情报覆盖", value: Math.min(100, ((research?.totals?.conferencePaperCount || 0) + (research?.totals?.preprintCount || 0)) * 5) },
    { name: "源稳定性", value: (research?.sourceMeta?.providers?.crossref?.ok ? 35 : 0) + (research?.sourceMeta?.providers?.arxiv?.ok ? 25 : 0) + (risk?.sourceMeta?.github?.ok ? 20 : 0) + (risk?.sourceMeta?.nvd?.ok ? 20 : 0) },
  ];
  const { chartRef } = useEChart(
    () => ({
      radar: {
        radius: "66%",
        splitNumber: 4,
        axisName: { color: "#3e3347", fontWeight: 700 },
        splitLine: { lineStyle: { color: ["rgba(126,12,110,0.08)"] } },
        splitArea: { areaStyle: { color: ["rgba(255,255,255,0.22)", "rgba(126,12,110,0.03)"] } },
        axisLine: { lineStyle: { color: "rgba(126,12,110,0.1)" } },
        indicator: indicators.map((item) => ({ name: item.name, max: 100 })),
      },
      series: [
        {
          type: "radar",
          symbol: "circle",
          symbolSize: 8,
          itemStyle: { color: "#8f2ca1" },
          lineStyle: { color: "#8f2ca1", width: 2 },
          areaStyle: { color: "rgba(143,44,161,0.18)" },
          data: [{ value: indicators.map((item) => item.value) }],
        },
      ],
    }),
    [JSON.stringify(indicators)],
  );

  return <div ref={chartRef} className="gov-chart-canvas" />;
}

function SnapshotTimeline({ exposure, risk, research }) {
  const items = [
    { label: "暴露面更新", value: exposure?.updatedAt || "-", tone: "exposure" },
    { label: "漏洞快照", value: risk?.sourceMeta?.storage?.snapshotKey || "-", tone: "risk" },
    { label: "学术快照", value: research?.sourceMeta?.storage?.snapshotKey || "-", tone: "research" },
  ];
  return (
    <div className="gov-timeline">
      {items.map((item) => (
        <div key={item.label} className="gov-timeline-item">
          <span className={`gov-timeline-dot is-${item.tone}`} />
          <div>
            <div className="gov-timeline-label">{item.label}</div>
            <div className="gov-timeline-value">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OpenclawGovernancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetchGovernanceOverview()
      .then((payload) => {
        if (!alive) return;
        setData(payload);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.message || "加载失败");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const exposure = data?.exposure;
  const risk = data?.risk;
  const research = data?.research;
  const healthLabel = useMemo(() => {
    const percent = risk?.fixProgress?.percentFixed ?? 0;
    if (percent >= 90) return "稳态收敛";
    if (percent >= 70) return "持续修复";
    return "重点治理";
  }, [risk?.fixProgress?.percentFixed]);

  return (
    <div className="oc-page gov-page">
      <section className="gov-hero">
        <div className="gov-hero-main">
          <div className="oc-page-tag">生态安全总览</div>
          <h2 className="oc-page-title">Claw 生态安全总览</h2>
          <p className="oc-page-desc">
            把公网暴露、漏洞修复与学术情报汇到一个统一面板里，帮助快速判断当前生态安全态势和后续治理优先级。
          </p>
          {error ? <div className="research-error">{error}</div> : null}
          <div className="gov-status-strip">
            <div className="gov-status-pill">
              <span>当前状态</span>
              <strong>{loading ? "--" : healthLabel}</strong>
            </div>
            <div className="gov-status-pill">
              <span>最新稳定版</span>
              <strong>{loading ? "--" : risk?.latestStable?.tagName || "-"}</strong>
            </div>
          </div>
        </div>

        <div className="gov-kpi-grid">
          <div className="gov-kpi-card">
            <span>公网暴露</span>
            <strong>{loading ? "--" : exposure?.currentExposed ?? 0}</strong>
          </div>
          <div className="gov-kpi-card">
            <span>高危漏洞</span>
            <strong>{loading ? "--" : risk?.totals?.highRiskCount ?? 0}</strong>
          </div>
          <div className="gov-kpi-card">
            <span>顶会研究</span>
            <strong>{loading ? "--" : research?.totals?.conferencePaperCount ?? 0}</strong>
          </div>
          <div className="gov-kpi-card">
            <span>修复进度</span>
            <strong>{loading ? "--" : `${risk?.fixProgress?.percentFixed ?? 0}%`}</strong>
          </div>
        </div>
      </section>

      <section className="gov-grid">
        <GovernanceCard title="总体健康度" subtitle="从暴露、漏洞、情报、源稳定性综合观察" icon={Activity}>
          <HealthRadar exposure={exposure} risk={risk} research={research} />
        </GovernanceCard>

        <GovernanceCard title="最新快照" subtitle="三个模块当前使用的最新数据基线" icon={ShieldCheck}>
          <SnapshotTimeline exposure={exposure} risk={risk} research={research} />
        </GovernanceCard>

        <GovernanceCard title="攻击面概览" subtitle="公网暴露和供应侧压力信号" icon={Globe2}>
          <div className="gov-metric-list">
            <div><span>当前暴露节点</span><strong>{loading ? "--" : exposure?.currentExposed ?? 0}</strong></div>
            <div><span>覆盖国家</span><strong>{loading ? "--" : exposure?.countryCoverage ?? 0}</strong></div>
            <div><span>城市数</span><strong>{loading ? "--" : exposure?.cityCount ?? 0}</strong></div>
            <div><span>运营商数</span><strong>{loading ? "--" : exposure?.operatorCount ?? 0}</strong></div>
          </div>
        </GovernanceCard>

        <GovernanceCard title="漏洞治理" subtitle="聚焦修复状态和关键风险密度" icon={ShieldAlert}>
          <div className="gov-metric-list">
            <div><span>漏洞总量</span><strong>{loading ? "--" : risk?.totals?.totalIssues ?? 0}</strong></div>
            <div><span>Critical</span><strong>{loading ? "--" : risk?.totals?.criticalCount ?? 0}</strong></div>
            <div><span>已修复</span><strong>{loading ? "--" : risk?.fixProgress?.fixed ?? 0}</strong></div>
            <div><span>待确认</span><strong>{loading ? "--" : risk?.fixProgress?.unknown ?? 0}</strong></div>
          </div>
        </GovernanceCard>

        <GovernanceCard title="学术情报" subtitle="研究来源与重点方向覆盖" icon={BookOpenText}>
          <div className="gov-metric-list">
            <div><span>顶会论文</span><strong>{loading ? "--" : research?.totals?.conferencePaperCount ?? 0}</strong></div>
            <div><span>预印本</span><strong>{loading ? "--" : research?.totals?.preprintCount ?? 0}</strong></div>
            <div><span>Agent 相关</span><strong>{loading ? "--" : research?.totals?.agent ?? 0}</strong></div>
            <div><span>Skill 相关</span><strong>{loading ? "--" : research?.totals?.skill ?? 0}</strong></div>
          </div>
        </GovernanceCard>

        <GovernanceCard title="运维建议" subtitle="对当前失败项和治理优先级给出短建议" icon={Activity}>
          <div className="gov-advice-list">
            <div className="gov-advice-item">优先保持漏洞页和暴露页的定时刷新，确保快照先稳定。</div>
            <div className="gov-advice-item">
              学术模块当前主要依赖 Crossref；arXiv 若出现限流，建议放到定时任务低频刷新，不要频繁手动刷。
            </div>
            <div className="gov-advice-item">
              如果需要更高质量论文元数据，下一步优先接 DBLP；Google Scholar 不建议直接爬取。
            </div>
          </div>
        </GovernanceCard>
      </section>
    </div>
  );
}
