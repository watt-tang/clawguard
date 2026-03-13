import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarClock, Database, Filter, Shield } from "lucide-react";
import FilterPanel from "./components/FilterPanel";
import ExposureTable from "./components/ExposureTable";
import Pagination from "./components/Pagination";
import SidebarNavigation from "./components/SidebarNavigation";

const PAGE_SIZE_OPTIONS = [50, 100, 200];

function formatSnapshotDate(dateKey) {
  if (!dateKey || dateKey.length !== 8) {
    return "--";
  }

  return `${dateKey.slice(0, 4)}-${dateKey.slice(4, 6)}-${dateKey.slice(6, 8)}`;
}

function getPageList(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
}

export default function App() {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1]);

  useEffect(() => {
    let active = true;

    fetch("/data/exposure-data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (!active) {
          return;
        }

        setPayload(data);
        setError("");
      })
      .catch((fetchError) => {
        if (!active) {
          return;
        }

        setError(fetchError.message || "数据加载失败");
      });

    return () => {
      active = false;
    };
  }, []);

  const total = payload?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const rows = payload?.rows ?? [];
  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage, pageSize]);

  const pageList = useMemo(() => getPageList(safePage, totalPages), [safePage, totalPages]);
  const startRecord = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRecord = Math.min(safePage * pageSize, total);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(126,12,110,0.12),transparent_28%),linear-gradient(180deg,#f8f4f8_0%,#f2f6fb_55%,#eff3f7_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1700px] gap-6 lg:grid-cols-[286px,minmax(0,1fr)] xl:grid-cols-[296px,minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <SidebarNavigation />
        </div>

        <section className="overflow-hidden rounded-[30px] border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(58,20,55,0.10)] backdrop-blur">
          <div className="relative overflow-hidden border-b border-[rgba(126,12,110,0.10)] px-8 py-8">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(126,12,110,0.11),transparent_28%,rgba(12,76,126,0.07)_70%,transparent_100%)]" />
            <div className="absolute right-[-40px] top-[-60px] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(126,12,110,0.24),transparent_68%)]" />
            <div className="absolute bottom-[-60px] left-[28%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(15,92,126,0.16),transparent_72%)]" />
            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(126,12,110,0.12)] bg-[rgba(126,12,110,0.08)] px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[rgb(126,12,110)]">
                  <Shield size={14} />
                  clawguard 安全平台
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <h1 className="text-4xl font-black tracking-[0.04em] text-slate-900">暴露服务详情</h1>
                  <p className="max-w-3xl text-sm leading-7 text-slate-600">
                    面向校园与企业场景的暴露面监测视图。页面基于
                    <span className="mx-1 font-semibold text-[rgb(126,12,110)]">web/clawdbot_alive</span>
                    的真实快照生成，表格核心字段展示 IP 地址与最后发现时间，其余列保留为安全平台占位信息。
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[520px]">
                <InfoCard
                  icon={Database}
                  label="资产总量"
                  value={payload ? total.toLocaleString("zh-CN") : "--"}
                  hint="实时快照聚合"
                />
                <InfoCard
                  icon={CalendarClock}
                  label="最新快照"
                  value={payload ? formatSnapshotDate(payload.latestSnapshot) : "--"}
                  hint={payload?.sourceDir ?? "等待数据源"}
                />
                <InfoCard
                  icon={Activity}
                  label="当前区间"
                  value={payload ? `${startRecord}-${endRecord}` : "--"}
                  hint={payload ? `第 ${safePage} / ${totalPages} 页` : "分页未初始化"}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 px-8 py-7">
            <div className="flex flex-col gap-4 rounded-[26px] border border-[rgba(126,12,110,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,246,250,0.92))] p-5 shadow-[0_18px_48px_rgba(32,24,39,0.05)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 text-[15px] font-semibold text-slate-800">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(126,12,110,0.09)] text-[rgb(126,12,110)]">
                    <Filter size={18} />
                  </div>
                  静态筛选器
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                    当前主体表格保持不变
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
                    左侧标签入口可扩展绑定逻辑
                  </div>
                </div>
              </div>

              <FilterPanel />
            </div>

            {error ? (
              <div className="rounded-[24px] border border-rose-200 bg-rose-50/80 px-6 py-10 text-center text-sm text-rose-600">
                数据加载失败：{error}
              </div>
            ) : null}

            {!error && !payload ? (
              <div className="rounded-[24px] border border-dashed border-[rgba(126,12,110,0.22)] bg-white/70 px-6 py-14 text-center text-sm text-slate-500">
                正在加载暴露服务真实数据...
              </div>
            ) : null}

            {payload ? (
              <>
                <ExposureTable rows={pagedRows} />
                <Pagination
                  currentPage={safePage}
                  pageSize={pageSize}
                  pageSizeOptions={PAGE_SIZE_OPTIONS}
                  total={total}
                  totalPages={totalPages}
                  pageList={pageList}
                  onPageChange={setPage}
                  onPageSizeChange={(nextPageSize) => {
                    setPageSize(nextPageSize);
                    setPage(1);
                  }}
                />
              </>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ icon: Icon, label, value, hint }) {
  return (
    <article className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,245,250,0.88))] p-5 shadow-[0_18px_44px_rgba(42,26,42,0.08)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.14em] text-slate-500">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgba(126,12,110,0.10)] text-[rgb(126,12,110)]">
          <Icon size={16} />
        </div>
      </div>
      <div className="mt-5 text-3xl font-black tracking-[0.03em] text-slate-900">{value}</div>
      <div className="mt-2 text-xs text-slate-500">{hint}</div>
    </article>
  );
}
