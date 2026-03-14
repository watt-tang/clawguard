import { useEffect, useState } from "react";
import CollapsePanel from "../components/CollapsePanel.jsx";
import StatsSection from "../components/StatsSection.jsx";
import WorldMapChart from "../components/WorldMapChart.jsx";
import ChinaMapChart from "../components/ChinaMapChart.jsx";
import ExposureTrendChart from "../components/ExposureTrendChart.jsx";
import { VersionTrendChartWithControl } from "../components/VersionTrendChart.jsx";
import ExposureDetailTable from "../components/ExposureDetailTable.jsx";
import {
  fetchChinaDist,
  fetchExposureList,
  fetchExposureTrend,
  fetchStats,
  fetchVersionTrend,
  fetchWorldDist,
} from "../services/dataService.js";

export default function OpenclawExposurePage({ auth }) {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [worldDist, setWorldDist] = useState(null);
  const [worldLoading, setWorldLoading] = useState(true);

  const [chinaDist, setChinaDist] = useState(null);
  const [chinaLoading, setChinaLoading] = useState(true);

  const [exposureTrend, setExposureTrend] = useState(null);
  const [trendLoading, setTrendLoading] = useState(true);

  const [versionTrend, setVersionTrend] = useState(null);
  const [versionLoading, setVersionLoading] = useState(true);

  const [listData, setListData] = useState(null);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetchStats()
      .then((data) => {
        if (alive) {
          setStats(data);
          setStatsLoading(false);
        }
      })
      .catch(() => {
        if (alive) setStatsLoading(false);
      });

    fetchWorldDist()
      .then((data) => {
        if (alive) {
          setWorldDist(data);
          setWorldLoading(false);
        }
      })
      .catch(() => {
        if (alive) setWorldLoading(false);
      });

    fetchChinaDist()
      .then((data) => {
        if (alive) {
          setChinaDist(data);
          setChinaLoading(false);
        }
      })
      .catch(() => {
        if (alive) setChinaLoading(false);
      });

    fetchExposureTrend()
      .then((data) => {
        if (alive) {
          setExposureTrend(data);
          setTrendLoading(false);
        }
      })
      .catch(() => {
        if (alive) setTrendLoading(false);
      });

    fetchVersionTrend()
      .then((data) => {
        if (alive) {
          setVersionTrend(data);
          setVersionLoading(false);
        }
      })
      .catch(() => {
        if (alive) setVersionLoading(false);
      });

    fetchExposureList()
      .then((data) => {
        if (alive) {
          setListData(data);
          setListLoading(false);
        }
      })
      .catch(() => {
        if (alive) setListLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="oc-page">
      <div className="oc-page-header">
        <div className="oc-page-header-main">
          <div className="oc-page-tag">公网暴露监测</div>
          <h2 className="oc-page-title">OpenClaw 公网暴露检测</h2>
          <p className="oc-page-desc">
            持续采集公网活跃 OpenClaw 节点，覆盖全球分布、境内覆盖、版本演化与暴露服务详情，服务于校园安全分析和资产梳理场景。
          </p>
        </div>
        {stats && (
          <div className="oc-page-header-kpi">
            <div className="oc-kpi">
              <span className="oc-kpi-val">{stats.currentExposed.toLocaleString("zh-CN")}</span>
              <span className="oc-kpi-label">当前暴露</span>
            </div>
            <div className="oc-kpi">
              <span className="oc-kpi-val">{stats.countryCoverage}</span>
              <span className="oc-kpi-label">覆盖国家 / 地区</span>
            </div>
            <div className="oc-kpi">
              <span className="oc-kpi-val">{stats.highRiskCount.toLocaleString("zh-CN")}</span>
              <span className="oc-kpi-label">高风险实例</span>
            </div>
          </div>
        )}
      </div>

      <CollapsePanel title="情况分析">
        <StatsSection stats={stats} loading={statsLoading} />
      </CollapsePanel>

      <CollapsePanel title="全球暴露实例分布" defaultOpen={true}>
        <WorldMapChart data={worldDist} loading={worldLoading} />
      </CollapsePanel>

      <CollapsePanel title="中国境内实例分布" defaultOpen={true}>
        <ChinaMapChart data={chinaDist} loading={chinaLoading} />
      </CollapsePanel>

      <CollapsePanel title="暴露实例演化趋势" defaultOpen={true}>
        <ExposureTrendChart data={exposureTrend} loading={trendLoading} />
      </CollapsePanel>

      <CollapsePanel title="版本实例演化趋势" defaultOpen={true}>
        <VersionTrendChartWithControl data={versionTrend} loading={versionLoading} />
      </CollapsePanel>

      <CollapsePanel title="暴露服务详情" defaultOpen={true}>
        <ExposureDetailTable rows={listData?.rows ?? []} loading={listLoading} auth={auth} />
      </CollapsePanel>
    </div>
  );
}
