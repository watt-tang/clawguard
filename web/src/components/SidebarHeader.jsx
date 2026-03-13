import { Shield, Sparkles } from "lucide-react";

export default function SidebarHeader() {
  return (
    <section className="rounded-[22px] border border-[rgba(126,12,110,0.10)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,246,250,0.94))] px-4 py-4 shadow-[0_12px_30px_rgba(35,24,39,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,rgba(126,12,110,1),rgba(156,40,136,0.84))] text-white shadow-[0_12px_28px_rgba(126,12,110,0.24)]">
          <Sparkles size={17} />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[11px] font-semibold tracking-[0.18em] text-[rgb(126,12,110)]">CLAWGUARD</div>
          <div className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900">
            <Shield size={16} className="text-[rgb(126,12,110)]" />
            安全导航
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-500">
        左侧聚合平台功能、标签入口与状态提示，形成更精炼的安全平台侧边信息区。
      </p>
    </section>
  );
}
