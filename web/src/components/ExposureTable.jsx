const COLUMNS = [
  { key: "ip", label: "IP 地址", width: "minmax(168px,1.2fr)" },
  { key: "host", label: "主机标识", width: "minmax(120px,0.9fr)" },
  { key: "service", label: "端口 / 服务", width: "minmax(180px,1.2fr)" },
  { key: "scope", label: "暴露范围", width: "minmax(116px,0.8fr)" },
  { key: "location", label: "地理位置", width: "minmax(136px,1fr)" },
  { key: "status", label: "运行状态", width: "minmax(116px,0.8fr)" },
  { key: "risk", label: "风险标签", width: "minmax(128px,0.9fr)" },
  { key: "version", label: "版本信息", width: "minmax(126px,0.9fr)" },
  { key: "lastSeen", label: "最后发现时间", width: "minmax(166px,1fr)" },
];

const STATUS_STYLES = {
  在线监测: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  近期发现: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  待复核: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

function getTemplateColumns() {
  return COLUMNS.map((column) => column.width).join(" ");
}

export default function ExposureTable({ rows }) {
  const templateColumns = getTemplateColumns();

  return (
    <section className="overflow-hidden rounded-[28px] border border-[rgba(126,12,110,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,244,249,0.92))] shadow-[0_24px_60px_rgba(35,26,42,0.08)]">
      <div className="overflow-x-auto">
        <div className="min-w-[1280px] px-4 pb-4 pt-4">
          <div
            className="grid items-center gap-3 rounded-[20px] border border-[rgba(126,12,110,0.08)] bg-[rgba(126,12,110,0.04)] px-4 py-4 text-xs font-bold tracking-[0.12em] text-slate-500"
            style={{ gridTemplateColumns: templateColumns }}
          >
            {COLUMNS.map((column) => (
              <div key={column.key}>{column.label}</div>
            ))}
          </div>

          <div className="mt-3 space-y-3">
            {rows.map((row) => (
              <article
                key={row.id}
                className="grid items-center gap-3 rounded-[22px] border border-transparent bg-white px-4 py-4 shadow-[0_14px_34px_rgba(37,24,39,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(126,12,110,0.14)] hover:bg-[linear-gradient(90deg,rgba(126,12,110,0.04),rgba(255,255,255,0.98)_30%)] hover:shadow-[0_20px_44px_rgba(37,24,39,0.10)]"
                style={{ gridTemplateColumns: templateColumns }}
              >
                <div className="min-w-0">
                  <div className="truncate font-mono text-[15px] font-bold text-[rgb(126,12,110)]">{row.ip}</div>
                  <div className="mt-1 text-xs text-slate-400">公网暴露资产</div>
                </div>

                <div className="text-sm text-slate-600">{row.host}</div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800">{row.service}</div>
                  <div className="mt-1 text-xs text-slate-400">{row.serviceDesc}</div>
                </div>

                <div>
                  <span className="inline-flex rounded-xl bg-[rgba(126,12,110,0.08)] px-3 py-1.5 text-xs font-semibold text-[rgb(126,12,110)]">
                    {row.scope}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800">{row.location}</div>
                  <div className="mt-1 truncate text-xs text-slate-400">{row.asn}</div>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-semibold ${
                      STATUS_STYLES[row.status] ?? STATUS_STYLES.待复核
                    }`}
                  >
                    {row.status}
                  </span>
                </div>

                <div className="text-sm text-slate-600">{row.risk}</div>

                <div className="text-sm text-slate-600">{row.version}</div>

                <div className="text-right font-mono text-sm font-semibold text-slate-700">{row.lastSeen}</div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
