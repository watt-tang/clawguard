import { Network } from "lucide-react";

export default function SidebarStatus() {
  return (
    <section className="rounded-[22px] border border-[rgba(126,12,110,0.10)] bg-[linear-gradient(180deg,rgba(126,12,110,0.05),rgba(255,255,255,0.92))] px-4 py-4 shadow-[0_10px_20px_rgba(35,24,39,0.04)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(126,12,110,0.10)] text-[rgb(126,12,110)]">
          <Network size={18} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800">当前聚焦范围</div>
          <div className="mt-1 text-xs leading-5 text-slate-500">
            左栏通过浅紫描边、微渐变与标签密度来传达校园科技感，避免做成普通后台硬菜单。
          </div>
        </div>
      </div>
    </section>
  );
}
