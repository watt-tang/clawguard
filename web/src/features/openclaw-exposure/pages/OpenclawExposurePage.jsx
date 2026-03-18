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
import { PAGE_SIZE_OPTIONS } from "../../../config.js";

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
  const [listLoading, setListLoading] = useState(false);
  const [listQuery, setListQuery] = useState({
    page: 1,
    pageSize: PAGE_SIZE_OPTIONS[0],
    ip: "",
    location: "",
    operator: "",
  });

  const [readyForSecondaryRequests, setReadyForSecondaryRequests] = useState(false);
  const [panelDemand, setPanelDemand] = useState({
    world: true,
    china: false,
    trend: false,
    version: false,
    detail: false,
  });

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

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let timeoutId = null;
    let idleId = null;

    const startSecondary = () => setReadyForSecondaryRequests(true);

    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(startSecondary, { timeout: 700 });
    } else {
      timeoutId = window.setTimeout(startSecondary, 180);
    }

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      if (idleId !== null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => {
    if (!readyForSecondaryRequests || !panelDemand.world) return undefined;

    let alive = true;
    setWorldLoading(true);

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

    return () => {
      alive = false;
    };
  }, [readyForSecondaryRequests, panelDemand.world]);

  useEffect(() => {
    if (!readyForSecondaryRequests || !panelDemand.china) return undefined;

    let alive = true;
    setChinaLoading(true);

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

    return () => {
      alive = false;
    };
  }, [readyForSecondaryRequests, panelDemand.china]);

  useEffect(() => {
    if (!readyForSecondaryRequests || !panelDemand.trend) return undefined;

    let alive = true;
    setTrendLoading(true);

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

    return () => {
      alive = false;
    };
  }, [readyForSecondaryRequests, panelDemand.trend]);

  useEffect(() => {
    if (!readyForSecondaryRequests || !panelDemand.version) return undefined;

    let alive = true;
    setVersionLoading(true);

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

    return () => {
      alive = false;
    };
  }, [readyForSecondaryRequests, panelDemand.version]);

  useEffect(() => {
    if (!readyForSecondaryRequests || !panelDemand.detail) return undefined;

    let alive = true;
    setListLoading(true);

    fetchExposureList({
      isLoggedIn: auth?.isLoggedIn,
      page: listQuery.page,
      page_size: listQuery.pageSize,
      ip: auth?.isLoggedIn ? listQuery.ip : "",
      location: auth?.isLoggedIn ? listQuery.location : "",
      operator: auth?.isLoggedIn ? listQuery.operator : "",
    })
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
  }, [
    readyForSecondaryRequests,
    panelDemand.detail,
    auth?.isLoggedIn,
    listQuery.page,
    listQuery.pageSize,
    listQuery.ip,
    listQuery.location,
    listQuery.operator,
  ]);

  const markPanelDemand = (panelKey, open) => {
    if (!open) return;
    setPanelDemand((prev) => {
      if (prev[panelKey]) return prev;
      return { ...prev, [panelKey]: true };
    });
  };

  const handlePageChange = (page) => {
    setListQuery((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize) => {
    setListQuery((prev) => ({ ...prev, page: 1, pageSize }));
  };

  const handleFilterChange = (partial) => {
    setListQuery((prev) => ({ ...prev, page: 1, ...partial }));
  };

  return (
    <div className="oc-page">
      <div className="oc-page-header">
        <div className="oc-page-header-main">
          <div className="oc-page-tag">公网暴露监测</div>
          <h2 className="oc-page-title">OpenClaw 公网暴露检测</h2>
          <p className="oc-page-desc">
            持续采集公网活跃 OpenClaw 节点，覆盖全球分布、境内覆盖、版本演化与暴露服务详情，服务于 OpenClaw 生态安全分析与资产梳理场景。
          </p>
        </div>
        {stats ? (
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
        ) : null}
      </div>

      <CollapsePanel title="情况分析">
        <StatsSection stats={stats} loading={statsLoading} />
      </CollapsePanel>

      <CollapsePanel title="全球暴露实例分布" defaultOpen={true} onOpenChange={(open) => markPanelDemand("world", open)}>
        <WorldMapChart data={worldDist} loading={worldLoading} />
      </CollapsePanel>

      <CollapsePanel title="中国境内实例分布" defaultOpen={false} onOpenChange={(open) => markPanelDemand("china", open)}>
        <ChinaMapChart data={chinaDist} loading={chinaLoading} />
      </CollapsePanel>

      <CollapsePanel title="暴露实例演化趋势" defaultOpen={false} onOpenChange={(open) => markPanelDemand("trend", open)}>
        <ExposureTrendChart data={exposureTrend} loading={trendLoading} />
      </CollapsePanel>

      <CollapsePanel title="版本实例演化趋势" defaultOpen={false} onOpenChange={(open) => markPanelDemand("version", open)}>
        <VersionTrendChartWithControl data={versionTrend} loading={versionLoading} />
      </CollapsePanel>

      <CollapsePanel title="暴露服务详情" defaultOpen={false} onOpenChange={(open) => markPanelDemand("detail", open)}>
        <ExposureDetailTable
          rows={listData?.rows ?? []}
          total={listData?.total ?? 0}
          page={listData?.page ?? listQuery.page}
          pageSize={listData?.page_size ?? listQuery.pageSize}
          filters={{
            ip: listQuery.ip,
            location: listQuery.location,
            operator: listQuery.operator,
          }}
          loading={listLoading}
          auth={auth}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterChange={handleFilterChange}
        />
      </CollapsePanel>
    </div>
  );
}
