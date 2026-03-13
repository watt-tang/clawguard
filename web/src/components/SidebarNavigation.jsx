import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Globe,
  House,
  ShieldCheck,
  ShieldEllipsis,
  SplinePointer,
} from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import SidebarTags from "./SidebarTags";
import SidebarStatus from "./SidebarStatus";

const NAV_ITEMS = [
  { id: "home", label: "平台主页", icon: House },
  { id: "governance", label: "OpenClaw安全治理总览", icon: ShieldCheck },
  { id: "risk", label: "OpenClaw风险漏洞追踪", icon: AlertTriangle, expandable: true },
  { id: "exposure", label: "OpenClaw公网暴露监测", icon: Globe },
  { id: "skill", label: "Skill生态后门投毒治理", icon: ShieldEllipsis },
  { id: "deploy", label: "OpenClaw部署安全检测", icon: SplinePointer },
];

export default function SidebarNavigation() {
  const [activeNav, setActiveNav] = useState("exposure");

  return (
    <aside className="relative overflow-hidden rounded-[28px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,244,249,0.92))] shadow-[0_22px_68px_rgba(44,24,43,0.08)] backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(126,12,110,0.16),transparent_72%)]" />
      <div className="absolute bottom-0 left-0 h-32 w-full bg-[linear-gradient(180deg,transparent,rgba(126,12,110,0.04))]" />

      <div className="relative flex flex-col gap-4 p-4">
        <SidebarHeader />

        <section className="rounded-[22px] border border-[rgba(126,12,110,0.10)] bg-white/90 p-3 shadow-[0_10px_26px_rgba(35,24,39,0.04)]">
          <SectionTitle title="主功能导航" subtitle="安全平台入口" />
          <div className="mt-3 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;

              return (
                <button
                  key={item.id}
                  className={`group flex w-full items-center gap-3 rounded-[18px] border px-3.5 py-3 text-left transition ${
                    isActive
                      ? "border-[rgba(126,12,110,0.16)] bg-[linear-gradient(90deg,rgba(126,12,110,0.10),rgba(255,255,255,0.97))] shadow-[0_10px_26px_rgba(126,12,110,0.10)]"
                      : "border-transparent bg-transparent hover:border-[rgba(126,12,110,0.10)] hover:bg-[rgba(126,12,110,0.04)]"
                  }`}
                  onClick={() => setActiveNav(item.id)}
                  type="button"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-2xl transition ${
                      isActive
                        ? "bg-[rgba(126,12,110,0.12)] text-[rgb(126,12,110)]"
                        : "bg-slate-100 text-slate-500 group-hover:bg-[rgba(126,12,110,0.08)] group-hover:text-[rgb(126,12,110)]"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-slate-800">{item.label}</div>
                  </div>

                  {item.expandable ? (
                    <ChevronDown
                      size={15}
                      className={isActive ? "text-[rgb(126,12,110)]" : "text-slate-300 group-hover:text-slate-400"}
                    />
                  ) : (
                    <div
                      className={`h-2 w-2 rounded-full transition ${
                        isActive ? "bg-[rgb(126,12,110)]" : "bg-slate-200 group-hover:bg-slate-300"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <SidebarTags />
        <SidebarStatus />
      </div>
    </aside>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <div className="text-[11px] font-bold tracking-[0.16em] text-[rgb(126,12,110)]">{title}</div>
      <div className="mt-1 text-[11px] text-slate-400">{subtitle}</div>
    </div>
  );
}
