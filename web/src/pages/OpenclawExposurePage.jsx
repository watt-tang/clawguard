import { useEffect, useState } from 'react';
import CollapsePanel from '../components/CollapsePanel.jsx';
import StatsSection from '../components/StatsSection.jsx';
import WorldMapChart from '../components/WorldMapChart.jsx';
import ChinaMapChart from '../components/ChinaMapChart.jsx';
import ExposureTrendChart from '../components/ExposureTrendChart.jsx';
import { VersionTrendChartWithControl } from '../components/VersionTrendChart.jsx';
import ExposureDetailTable from '../components/ExposureDetailTable.jsx';
import {
  fetchStats,
  fetchWorldDist,
  fetchChinaDist,
  fetchExposureTrend,
  fetchVersionTrend,
  fetchExposureList,
} from '../services/dataService.js';

/**
 * OpenClaw 公网暴露检测页面
 * 六个可折叠模块：情况分析 / 全球分布 / 境内分布 / 暴露趋势 / 版本趋势 / 暴露详情
 *
 * @param {{ auth: { isLoggedIn, login, logout } }} props
 */
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

  // 独立加载各模块数据，互不阻塞
  useEffect(() => {
    let alive = true;

    fetchStats()
      .then((d) => { if (alive) { setStats(d); setStatsLoading(false); } })
      .catch(() => { if (alive) setStatsLoading(false); });

    fetchWorldDist()
      .then((d) => { if (alive) { setWorldDist(d); setWorldLoading(false); } })
      .catch(() => { if (alive) setWorldLoading(false); });

    fetchChinaDist()
      .then((d) => { if (alive) { setChinaDist(d); setChinaLoading(false); } })
      .catch(() => { if (alive) setChinaLoading(false); });

    fetchExposureTrend()
      .then((d) => { if (alive) { setExposureTrend(d); setTrendLoading(false); } })
      .catch(() => { if (alive) setTrendLoading(false); });

    fetchVersionTrend()
      .then((d) => { if (alive) { setVersionTrend(d); setVersionLoading(false); } })
      .catch(() => { if (alive) setVersionLoading(false); });

    fetchExposureList()
      .then((d) => { if (alive) { setListData(d); setListLoading(false); } })
      .catch(() => { if (alive) setListLoading(false); });

    return () => { alive = false; };
  }, []);

  return (
    <div className="oc-page">
      {/* 页头 */}
      <div className="oc-page-header">
        <div className="oc-page-header-main">
          <div className="oc-page-tag">公网暴露监测</div>
          <h2 className="oc-page-title">OpenClaw 公网暴露检测</h2>
          <p className="oc-page-desc">
            持续采集公网活跃 OpenClaw 节点，涵盖全球分布、境内覆盖、版本演化与实例详情。
          </p>
        </div>
        {stats && (
          <div className="oc-page-header-kpi">
            <div className="oc-kpi">
              <span className="oc-kpi-val">{stats.currentExposed.toLocaleString('zh-CN')}</span>
              <span className="oc-kpi-label">当前暴露</span>
            </div>
            <div className="oc-kpi">
              <span className="oc-kpi-val">{stats.countryCoverage}</span>
              <span className="oc-kpi-label">覆盖国家/地区</span>
            </div>
            <div className="oc-kpi">
              <span className="oc-kpi-val">{stats.highRiskCount.toLocaleString('zh-CN')}</span>
              <span className="oc-kpi-label">高风险实例</span>
            </div>
          </div>
        )}
      </div>

      {/* 模块 1：情况分析 */}
      <CollapsePanel title="情况分析">
        <StatsSection stats={stats} loading={statsLoading} />
      </CollapsePanel>

      {/* 模块 2：全球暴露实例分布图 */}
      <CollapsePanel title="全球暴露实例分布图" defaultOpen={true}>
        <WorldMapChart data={worldDist} loading={worldLoading} />
      </CollapsePanel>

      {/* 模块 3：中国境内实例分布图 */}
      <CollapsePanel title="中国境内实例分布图" defaultOpen={true}>
        <ChinaMapChart data={chinaDist} loading={chinaLoading} />
      </CollapsePanel>

      {/* 模块 4：暴露实例演化趋势 */}
      <CollapsePanel title="暴露实例演化趋势" defaultOpen={true}>
        <ExposureTrendChart data={exposureTrend} loading={trendLoading} />
      </CollapsePanel>

      {/* 模块 5：版本实例演化趋势 */}
      <CollapsePanel title="版本实例演化趋势" defaultOpen={true}>
        <VersionTrendChartWithControl data={versionTrend} loading={versionLoading} />
      </CollapsePanel>

      {/* 模块 6：暴露服务详情 */}
      <CollapsePanel title="暴露服务详情" defaultOpen={true}>
        <ExposureDetailTable
          rows={listData?.rows ?? []}
          loading={listLoading}
          auth={auth}
        />
      </CollapsePanel>
    </div>
  );
}
