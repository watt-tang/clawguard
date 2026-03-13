import { ChevronDown } from "lucide-react";

const FILTERS = [
  { label: "风险等级", value: "全部等级" },
  { label: "暴露范围", value: "全部范围" },
  { label: "服务类型", value: "全部类型" },
  { label: "资产归属", value: "全部学院" },
  { label: "关联风险", value: "全部状态" },
];

export default function FilterPanel() {
  return (
    <div className="grid gap-3 xl:grid-cols-[repeat(5,minmax(0,1fr))]">
      {FILTERS.map((filter) => (
        <button
          key={filter.label}
          className="group flex min-h-[76px] items-center justify-between rounded-[20px] border border-[rgba(126,12,110,0.10)] bg-white px-4 py-4 text-left shadow-[0_10px_24px_rgba(34,24,39,0.04)] transition hover:-translate-y-0.5 hover:border-[rgba(126,12,110,0.22)] hover:shadow-[0_18px_36px_rgba(34,24,39,0.08)]"
          type="button"
        >
          <div>
            <div className="text-xs font-semibold tracking-[0.12em] text-slate-400">{filter.label}</div>
            <div className="mt-2 text-sm font-semibold text-slate-800">{filter.value}</div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgba(126,12,110,0.08)] text-[rgb(126,12,110)] transition group-hover:bg-[rgba(126,12,110,0.14)]">
            <ChevronDown size={16} />
          </div>
        </button>
      ))}
    </div>
  );
}
